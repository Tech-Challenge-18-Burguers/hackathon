import { getExtension } from "../../helper/extensionHelper"
import { Configuration } from "../../infra/configuration"
import DownloadFileService, { DownloadFileOutput } from "../service/DownloadFileService"
import SplitVideoFramesService from "../service/SplitVideoFramesService"
import UploadFileService, { UploadFileInput, UploadFileOutput } from "../service/UploadFileService"
import * as path from 'path'
import * as fs from 'fs'
import { splitArrayIntoChunks } from "../../helper/arrayHelper"
import Logger from "../../infra/logger/Logger"
import CompressQueueService from "../service/CompressQueueService"
import ChangeVideoStatusQueueService from "../service/ChangeVideoStatusQueueService"
import { VideoStatus } from "../entity/Video"

export type SplitVideoToFramesInput = {
    id: string
    bucket: string
    key: string
}

export type SplitVideoToFramesOutput = {
    keyPrefix: string
    filenames: Array<string>
    keys: Array<string>
}

export default class SplitVideoToFramesUseCase {
    
    constructor(
        private readonly downloadFileService: DownloadFileService,
        private readonly uploadFileService: UploadFileService,
        private readonly splitVideoService: SplitVideoFramesService,
        private readonly compressQueueService: CompressQueueService,
        private readonly changeVideoStatusService: ChangeVideoStatusQueueService,
        private readonly configuration: Configuration,
        private readonly logger: Logger
    ) {}

    async execute(input: SplitVideoToFramesInput): Promise<SplitVideoToFramesOutput> {

        const workdir = path.join(this.configuration.TMP_DIR, input.id)
        
        if(!fs.existsSync(workdir)) {
            this.logger.debug(`Create a workdir ${workdir}`)
            fs.mkdirSync(workdir)
        }
        
        await this.changeVideoStatusService.send({ id: input.id, status: VideoStatus.PROCESSING })
        
        const downloadMetadata = { 
            bucket: input.bucket, 
            key: input.key, 
            filename: `video${getExtension(input.key)}`, 
            outputDir: workdir
        }

        const videoFile = await this.downloadFileService.download(downloadMetadata)
        this.logger.info(`Download video successfully`, { videoFile })

        const framesWorkdir = path.join(workdir, 'frames')
        this.logger.debug(`Defined frames workdir ${framesWorkdir}`)

        const framesOutput = await this.splitVideoService.split({ filePath: videoFile.path, outputDir: framesWorkdir })
        this.logger.info(`Split video successfully`, { framesOutput })

        const uploadFiles: Array<UploadFileInput> = framesOutput.filenames
            .map(item => ({ 
                bucket: input.bucket, 
                key: `${input.id}/frames/${item}`,
                filePath: path.join(framesOutput.outputDir, item)
            }))

        this.logger.info(`Files to be upload`, { uploadFiles })

        const framesPool = splitArrayIntoChunks(uploadFiles, 10)

        const keys: Array<string> = []

        for(const frames of framesPool) {
            const response: Array<UploadFileOutput> = await Promise
                .all(frames.map((frame: UploadFileInput) => this.uploadFileService.upload(frame)))
            this.logger.debug(`Response to upload chunck`, { response })
            const partial = response.map(item => item.key)
            keys.push(...partial)
        }

        await this.compressQueueService.send({ bucket: input.bucket, id: input.id })

        return {
            filenames: framesOutput.filenames,
            keyPrefix: `${input.id}/frames/`,
            keys
        }
    }
}