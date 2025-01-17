import { inject, injectable } from "inversify"
import { TYPES } from "../types"
import Logger from "../infra/logger/Logger"
import DownloadFileService from "../core/service/DownloadFileService"
import UploadFileService from "../core/service/UploadFileService"
import { Configuration } from "../infra/configuration"
import ListFilesByPrefixService from "../core/service/ListFilesByPrefixService"
import CompressFilesUseCase, { CompressFilesInput } from "../core/usecase/CompressFilesUseCase"
import CompressService from "../core/service/CompressService"
import ChangeVideoStatusQueueService from "../core/service/ChangeVideoStatusQueueService"

@injectable()
export default class FileController {

    constructor(
        @inject(TYPES.Logger) private readonly logger: Logger,
        @inject(TYPES.DownloadFileService) private readonly downloadFileService: DownloadFileService,
        @inject(TYPES.UploadFileService) private readonly uploadFileService: UploadFileService,
        @inject(TYPES.Configuration) private readonly configuration: Configuration,
        @inject(TYPES.ListFilesByPrefixService) private readonly listFilesByPrefixService: ListFilesByPrefixService,
        @inject(TYPES.CompressService) private readonly compressService: CompressService,
        @inject(TYPES.ChangeVideoStatusQueueService) private readonly changeVideoStatusService: ChangeVideoStatusQueueService
    ) {}

    async compress(input: CompressFilesInput) {
        const usecase = new CompressFilesUseCase(this.logger, this.compressService, this.downloadFileService, 
            this.uploadFileService, this.listFilesByPrefixService, this.changeVideoStatusService, this.configuration)
        return usecase.execute(input)
    }
}