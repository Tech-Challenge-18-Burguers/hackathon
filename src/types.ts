
export const TYPES = {
    Configuration: Symbol.for('Configuration'),
    Logger: Symbol.for('Logger'),
    CompressService: Symbol.for('CompressService'),
    DownloadFileService: Symbol.for('DownloadFileService'),
    UploadFileService: Symbol.for('UploadFileService'),
    SplitVideoFramesService: Symbol.for('SplitVideoFramesService'),
    VideoController: Symbol.for('VideoController'),
    S3Client: Symbol.for('S3Client'),
    TriggerQueueService: Symbol.for('TriggerQueueService'),
    SQSClient: Symbol.for('SQSClient'),
    ListFilesByPrefixService: Symbol.for('ListFilesByPrefixService'),
    FileController: Symbol.for('FileController'),
    CompressQueueService: Symbol.for('CompressQueueService'),
    DynamoDBClient: Symbol.for('DynamoDBClient'),
    VideoRepository: Symbol.for('VideoRepository'),
    StorageService: Symbol.for('StorageService'),
    ChangeVideoStatusQueueService: Symbol.for('ChangeVideoStatusQueueService'),
    IdentityService: Symbol.for('IdentityService'),
    CognitoClient: Symbol.for('CognitoClient'),
    UserController: Symbol.for('UserController')
}