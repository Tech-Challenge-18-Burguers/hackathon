import { inject, injectable } from "inversify"
import TriggerQueueService, { TriggerQueueInput } from "../../core/service/TriggerQueueService"
import { TYPES } from "../../types"
import { Logger } from "@aws-lambda-powertools/logger"
import { SQSClient } from "@aws-sdk/client-sqs"
import SqsQueueService from "./SqsQueueService"
import { Configuration } from "../../infra/configuration"

@injectable()
export default class TriggerQueueServiceImpl extends SqsQueueService implements TriggerQueueService {
    
    constructor(
        @inject(TYPES.Logger) protected readonly logger: Logger,
        @inject(TYPES.SQSClient) protected readonly client: SQSClient,
        @inject(TYPES.Configuration) protected configuration: Configuration
    ) {
        super(logger, client)
    }

    async send(input: TriggerQueueInput): Promise<void> {
        await this.sendMessage(input, this.configuration.PROCESS_VIDEO_QUEUE_NAME)
    }

}