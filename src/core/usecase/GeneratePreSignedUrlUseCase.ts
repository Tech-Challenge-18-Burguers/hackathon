import { Configuration } from "../../infra/configuration";
import Logger from "../../infra/logger/Logger";
import { GenerateUrlOutput, GenerateUrlType } from "../entity/Storage";
import StorageService from "../service/StorageService"

export type PreSignUrlInput = {
    id: string
    type: GenerateUrlType
}

export default class GeneratePreSignedUrlUseCase {
    
    constructor(
        private readonly logger: Logger,
        private readonly storageService: StorageService,
        private readonly configuration: Configuration
    ) {}

    async execute(input: PreSignUrlInput): Promise<GenerateUrlOutput> {
        this.logger.debug(`Generate url to parameters`, { input })
        const params = { 
            bucket: this.configuration.DATA_BUCKET_NAME, 
            key: this.generateKey(input), 
            type: input.type, 
            duration: 20, 
        }
        return this.storageService.generateUrl(params)
    }

    generateKey(input: PreSignUrlInput) {
        const actions = {
            [GenerateUrlType.DOWNLOAD]: () => `${input.id}/frames.zip`,
            [GenerateUrlType.UPLOAD]: () => `${input.id}/video.mp4`
        }
        return actions[input.type]()
    }
}