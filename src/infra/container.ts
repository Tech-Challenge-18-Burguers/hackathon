import { Container } from "inversify"
import { TYPES } from "../types"
import Logger from "./logger/Logger"

import CompressService from "../core/service/CompressService"
import CompressServiceImpl from "../application/service/CompressServiceImpl"
import DownloadFileService from "../core/service/DownloadFileService"
import DownloadFileServiceImpl from "../application/service/DownloadFileServiceImpl"
import SplitVideoFramesService from "../core/service/SplitVideoFramesService"
import SplitVideoFramesServiceImpl from "../application/service/SplitVideoFramesServiceImpl"
import UploadFileService from "../core/service/UploadFileService"
import UploadFileServiceImpl from "../application/service/UploadFileServiceImpl"
import VideoController from "../controller/VideoController"
import AwsS3Client from "./aws/AwsS3Client"
import TriggerQueueService from "../core/service/TriggerQueueService"
import TriggerQueueServiceImpl from "../application/service/TriggerQueueServiceImpl"
import { configuration, Configuration } from "./configuration"
import AwsSqsClient from "./aws/AwsSqsClient"
import ListFilesByPrefixService from "../core/service/ListFilesByPrefixService"
import ListFilesByPrefixServiceImpl from "../application/service/ListFilesByPrefixServiceImpl"
import FileController from "../controller/FileController"
import CompressQueueService from "../core/service/CompressQueueService"
import CompressQueueServiceImpl from "../application/service/CompressQueueServiceImpl"
import AwsDynamoDBClient from "./aws/AwsDynamoDBClient"
import VideoRepository from "../core/repository/VideoRepository"
import VideoRepositoryDynamoDB from "../application/repository/VideoRepositoryDynamoDB"

const container = new Container()

container.bind<Logger>(TYPES.Logger).toConstantValue(new Logger())
container.bind<Configuration>(TYPES.Configuration).toConstantValue(configuration)
container.bind<AwsS3Client>(TYPES.S3Client).toConstantValue(new AwsS3Client())
container.bind<AwsSqsClient>(TYPES.SQSClient).toConstantValue(new AwsSqsClient())
container.bind<AwsDynamoDBClient>(TYPES.DynamoDBClient).toConstantValue(new AwsDynamoDBClient())

container.bind<VideoRepository>(TYPES.VideoRepository).to(VideoRepositoryDynamoDB)

container.bind<CompressService>(TYPES.CompressService).to(CompressServiceImpl)
container.bind<DownloadFileService>(TYPES.DownloadFileService).to(DownloadFileServiceImpl)
container.bind<SplitVideoFramesService>(TYPES.SplitVideoFramesService).to(SplitVideoFramesServiceImpl)
container.bind<UploadFileService>(TYPES.UploadFileService).to(UploadFileServiceImpl)
container.bind<TriggerQueueService>(TYPES.TriggerQueueService).to(TriggerQueueServiceImpl)
container.bind<ListFilesByPrefixService>(TYPES.ListFilesByPrefixService).to(ListFilesByPrefixServiceImpl)
container.bind<CompressQueueService>(TYPES.CompressQueueService).to(CompressQueueServiceImpl)

container.bind<VideoController>(TYPES.VideoController).to(VideoController)
container.bind<FileController>(TYPES.FileController).to(FileController)

export { container }