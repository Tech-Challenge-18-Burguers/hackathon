import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import UploadFileService, { UploadFileInput, UploadFileOutput } from "../../core/service/UploadFileService";
import { createReadStream } from 'fs'
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { Logger } from "@aws-lambda-powertools/logger";

@injectable()
export default class UploadFileServiceImpl implements UploadFileService {

    constructor(
        @inject(TYPES.Logger) private readonly logger: Logger,
        @inject(TYPES.S3Client) private readonly client: S3Client
    ) {}
    
    async upload(input: UploadFileInput): Promise<UploadFileOutput> {
        this.logger.debug(`Upload file to s3`, { input })
        
        const fileStream = createReadStream(input.filePath)
        
        const command = new PutObjectCommand({ 
            Bucket: input.bucket, 
            Key: input.key,
            Body: fileStream
        })
        this.logger.debug(`Put object with command`, { command })

        const response = await this.client.send(command)
        this.logger.debug(`Put object with response`, { response })

        if(response.$metadata.httpStatusCode !== 200) {
            return {
                bucket: input.bucket,
                key: input.key,
                status: 'FAILED'
            }    
        }

        return {
            bucket: input.bucket,
            key: input.key,
            status: 'SUCCESS'
        }
    }

}