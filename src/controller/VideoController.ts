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
    ) {}

    async trigger(input: TriggerVideoInput) {
        const usecase = new TriggerVideoToProcessUseCase(this.logger, this.triggerQueueService)
        return usecase.execute(input)
    }

    async process(input: SplitVideoToFramesInput) {
        const usecase =  new SplitVideoToFramesUseCase(this.downloadFileService, this.uploadFileService, 
            this.splitVideoFramesService, this.compressQueueService, this.configuration, this.logger)
        return usecase.execute(input)
    }

}