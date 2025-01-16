import { inject, injectable } from "inversify";
import CompressQueueService, { CompressQueueInput } from "../../core/service/CompressQueueService";
import SqsQueueService from "./SqsQueueService";
import { TYPES } from "../../types";
import { Logger } from "@aws-lambda-powertools/logger";
import { SQSClient } from "@aws-sdk/client-sqs";
import { Configuration } from "../../infra/configuration";

@injectable()
export default class CompressQueueServiceImpl extends SqsQueueService implements CompressQueueService {
    
    constructor(
        @inject(TYPES.Logger) protected readonly logger: Logger,
        @inject(TYPES.SQSClient) protected readonly client: SQSClient,
        @inject(TYPES.Configuration) protected configuration: Configuration
    ) {
        super(logger, client)
    }

    async send(input: CompressQueueInput): Promise<void> {
        await this.sendMessage(input, this.configuration.COMPRESS_VIDEO_QUEUE_NAME)
    }

}