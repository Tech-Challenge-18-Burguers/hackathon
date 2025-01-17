import { Configuration } from "../../infra/configuration";
import Logger from "../../infra/logger/Logger";
import CompressService from "../service/CompressService";
import DownloadFileService, { DownloadFileInput } from "../service/DownloadFileService";
import ListFilesByPrefixService from "../service/ListFilesByPrefixService";
import UploadFileService from "../service/UploadFileService";
import * as path from 'path'
import * as fs from 'fs'
import { splitArrayIntoChunks } from "../../helper/arrayHelper";
import ChangeVideoStatusQueueService from "../service/ChangeVideoStatusQueueService";
import { VideoStatus } from "../entity/Video";

export type CompressFilesInput = {
    id: string
    bucket: string
}

export default class CompressFilesUseCase {
    
    constructor(
        private readonly logger: Logger,
        private readonly compressService: CompressService,
        private readonly downloadService: DownloadFileService,
        private readonly uploadService: UploadFileService,
        private readonly listFilesByPrefixService: ListFilesByPrefixService,
        private readonly changeVideoStatusService: ChangeVideoStatusQueueService,
        private readonly configuration: Configuration
    ) {}

    async execute(input: CompressFilesInput): Promise<void> {
        await this.changeVideoStatusService.send({ id: input.id, status: VideoStatus.COMPRESSING })
        const prefix = `${input.id}/frames`
        const workdir = path.join(this.configuration.TMP_DIR, `${input.id}-frames`)

        if(!fs.existsSync(workdir)) {
            this.logger.debug(`Create a workdir ${workdir}`)
            fs.mkdirSync(workdir)
        }

        const objects = await this.listFilesByPrefixService
            .list({ bucket: this.configuration.DATA_BUCKET_NAME, prefix })

        const filesMetadata: Array<DownloadFileInput> = objects.keys.map(key => ({ 
            bucket: objects.bucket, 
            key, 
            filename: this.extractFileName(key),
            outputDir: workdir
        }))

        const chunks = splitArrayIntoChunks(filesMetadata, 10)
        for(const chunk of chunks) {
            const response = await Promise.all(chunk.map((item: DownloadFileInput) => this.downloadService.download(item)))
            this.logger.debug(`Response to download chunk`, { chunk, response })
        }

        this.logger.info(`Download of frames sucessfully`)
        
        const zipFilePath = path.join(this.configuration.TMP_DIR, `${input.id}.zip`)

        const compressResponse = await this.compressService.compress({ baseDir: workdir, outputFile: zipFilePath })

        const uploadResponse = await this.uploadService
            .upload({ bucket: input.bucket, key: `${input.id}/frames.zip`, filePath: compressResponse.filename })

        this.logger.info(`Upload successfully`, { uploadResponse })
    }

    private extractFileName(key: string): string {
        return key.split('/').slice(-1)[0]
    }
}