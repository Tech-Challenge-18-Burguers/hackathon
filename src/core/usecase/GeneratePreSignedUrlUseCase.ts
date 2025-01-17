import { Configuration } from "../../infra/configuration";
import Logger from "../../infra/logger/Logger";
import { GenerateUrlOutput, GenerateUrlType } from "../entity/Storage";
import Video, { VideoStatus } from "../entity/Video";
import UnauthorizedException from "../exception/UnauthorizedException";
import VideoRepository from "../repository/VideoRepository";
import ChangeVideoStatusQueueService from "../service/ChangeVideoStatusQueueService";
import StorageService from "../service/StorageService"

export type PreSignUrlInput = {
    id: string
    userId: string
    type: GenerateUrlType
}

export default class GeneratePreSignedUrlUseCase {
    
    constructor(
        private readonly logger: Logger,
        private readonly storageService: StorageService,
        private readonly videoRepository: VideoRepository,
        private readonly changeVideoStatusService: ChangeVideoStatusQueueService,
        private readonly configuration: Configuration
    ) {}

    async execute(input: PreSignUrlInput): Promise<GenerateUrlOutput> {
        this.logger.debug(`Generate url to parameters`, { input })

        const video = await this.videoRepository.findById(input.id)
        this.logger.info(`Video ${input.id} found`, { input, video })

        if(video.userId !== input.userId) {
            throw new UnauthorizedException()
        }

        this.isPermited(input, video)

        if(input.type === GenerateUrlType.UPLOAD) {
            await this.changeVideoStatusService.send({ id: input.id, status: VideoStatus.WAITING_UPLOAD })
        }

        const params = { 
            bucket: this.configuration.DATA_BUCKET_NAME, 
            key: this.generateKey(input), 
            type: input.type, 
            duration: 20, 
        }
        return this.storageService.generateUrl(params)
    }

    private generateKey(input: PreSignUrlInput) {
        const actions = {
            [GenerateUrlType.DOWNLOAD]: () => `${input.id}/frames.zip`,
            [GenerateUrlType.UPLOAD]: () => `${input.id}/video.mp4`
        }
        return actions[input.type]()
    }

    private isPermited(input: PreSignUrlInput, video: Video) {
        const actions = {
            [GenerateUrlType.UPLOAD]: [VideoStatus.CREATED, VideoStatus.WAITING_UPLOAD],
            [GenerateUrlType.DOWNLOAD]: [VideoStatus.DOWNLOAD_AVAILABLE]
        }

        const availables = actions[input.type]
        if(!availables.includes(video.status)) {
            throw new Error(`Action not permied`)
        }
    }
}