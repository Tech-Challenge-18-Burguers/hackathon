import { GetObjectCommand, GetObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import DownloadFileService, { DownloadFileInput, DownloadFileOutput } from "../../core/service/DownloadFileService";
import * as path from 'path'
import { pipeline } from 'stream/promises'
import { promisify } from 'util'
import { writeFile } from 'fs/promises'
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import Logger from "../../infra/logger/Logger";

const streamPipeline = promisify(pipeline)

@injectable()
export default class DownloadFileServiceImpl implements DownloadFileService {

    constructor(
        @inject(TYPES.Logger) private readonly logger: Logger,
        @inject(TYPES.S3Client) private readonly client: S3Client
    ) {}

    async download(input: DownloadFileInput): Promise<DownloadFileOutput> {
        
        const command = new GetObjectCommand({ Bucket: input.bucket, Key: input.key })
        this.logger.debug(`Create command to download`, { command })

        const response: GetObjectCommandOutput = await this.client.send(command)        
        this.logger.debug(`Response to download command`, { command, response })

        if(response.$metadata.httpStatusCode !== 200) {
            throw new Error('Erro to get object')
        }

        if(!response.Body) throw new Error('Body not found')

        const filePath = path.join(input.outputDir, input.filename)
        const byteArray = await response.Body.transformToByteArray()

        this.logger.debug(`Write file to ${filePath}`)
        await writeFile(filePath, Buffer.from(byteArray))

        return {
            baseDir: input.outputDir,
            filename: input.filename,
            path: filePath
        }
    }

}