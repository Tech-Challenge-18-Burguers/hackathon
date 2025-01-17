import { inject, injectable } from "inversify"
import { TYPES } from "../types"
import Logger from "../infra/logger/Logger"
import DownloadFileService from "../core/service/DownloadFileService"
import SplitVideoFramesService from "../core/service/SplitVideoFramesService"
import UploadFileService from "../core/service/UploadFileService"
import SplitVideoToFramesUseCase, { SplitVideoToFramesInput } from "../core/usecase/SplitVideoToFramesUseCase"
import { Configuration } from "../infra/configuration"
import TriggerVideoToProcessUseCase, { TriggerVideoInput } from "../core/usecase/TriggerVideoToProcessUseCase"
import TriggerQueueService from "../core/service/TriggerQueueService"
import CompressQueueService from "../core/service/CompressQueueService"
import { VideoInput, VideoUpdate } from "../core/entity/Video"
import CreateVideoUseCase from "../core/usecase/CreateVideoUseCase"
import VideoRepository from "../core/repository/VideoRepository"
import UpdateVideoUseCase from "../core/usecase/UpdateVideoUseCase"
import GeneratePreSignedUrlUseCase, { PreSignUrlInput } from "../core/usecase/GeneratePreSignedUrlUseCase"
import StorageService from "../core/service/StorageService"
import ChangeVideoStatusQueueService from "../core/service/ChangeVideoStatusQueueService"

@injectable()
export default class VideoController {

    constructor(
        @inject(TYPES.Logger) private readonly logger: Logger,
        @inject(TYPES.DownloadFileService) private readonly downloadFileService: DownloadFileService,
        @inject(TYPES.SplitVideoFramesService) private readonly splitVideoFramesService: SplitVideoFramesService,
        @inject(TYPES.UploadFileService) private readonly uploadFileService: UploadFileService,
        @inject(TYPES.Configuration) private readonly configuration: Configuration,
        @inject(TYPES.TriggerQueueService) private readonly triggerQueueService: TriggerQueueService,
        @inject(TYPES.CompressQueueService) private readonly compressQueueService: CompressQueueService,
        @inject(TYPES.VideoRepository) private readonly videoRepository: VideoRepository,
        @inject(TYPES.StorageService) private readonly storageService: StorageService,
        @inject(TYPES.ChangeVideoStatusQueueService) private readonly changeVideoStatusService: ChangeVideoStatusQueueService
    ) {}

    async trigger(input: TriggerVideoInput) {
        const usecase = new TriggerVideoToProcessUseCase(this.logger, this.triggerQueueService, this.changeVideoStatusService)
        return usecase.execute(input)
    }

    async process(input: SplitVideoToFramesInput) {
        const usecase =  new SplitVideoToFramesUseCase(this.downloadFileService, this.uploadFileService, 
            this.splitVideoFramesService, this.compressQueueService, this.changeVideoStatusService, this.configuration, this.logger)
        return usecase.execute(input)
    }

    async create(input: VideoInput) {
        const usecase = new CreateVideoUseCase(this.logger, this.videoRepository)
        return usecase.execute(input)
    }

    async update(input: VideoUpdate) {
        const usecase = new UpdateVideoUseCase(this.logger, this.videoRepository)
        return usecase.execute(input)
    }

    async generatePresignUrl(input: PreSignUrlInput) {
        const usecase = new GeneratePreSignedUrlUseCase(this.logger, this.storageService, 
            this.videoRepository, this.changeVideoStatusService, this.configuration)
        return usecase.execute(input)
    }
}