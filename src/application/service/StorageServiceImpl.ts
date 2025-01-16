import { inject, injectable } from "inversify"
import StorageService from "../../core/service/StorageService"
import { TYPES } from "../../types"
import Logger from "../../infra/logger/Logger"
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GenerateUrlInput, GenerateUrlOutput, GenerateUrlType } from "../../core/entity/Storage"

@injectable()
export default class StorageServiceImpl implements StorageService {
    
    constructor(
        @inject(TYPES.Logger) private readonly logger: Logger,
        @inject(TYPES.S3Client) private readonly client: S3Client
    ) {}

    async generateUrl(input: GenerateUrlInput): Promise<GenerateUrlOutput> {
        const command = this.generateCommand(input)
        const url = await getSignedUrl(this.client, command, { expiresIn: (input.duration * 60) }) // transform to minutes
        return { url }
    }

    generateCommand(input: GenerateUrlInput) {
        const params = { Bucket: input.bucket, Key: input.key }
        const actions = {
            [GenerateUrlType.DOWNLOAD]: new GetObjectCommand(params),
            [GenerateUrlType.UPLOAD]: new PutObjectCommand(params)
        }
        return actions[input.type]
    }

}