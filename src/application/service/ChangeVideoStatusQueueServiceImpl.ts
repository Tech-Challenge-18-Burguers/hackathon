import { inject, injectable } from "inversify";
import ChangeVideoStatusQueueService, { ChangeVideoStatus } from "../../core/service/ChangeVideoStatusQueueService";
import SqsQueueService from "./SqsQueueService";
import { TYPES } from "../../types";
import Logger from "../../infra/logger/Logger";
import { SQSClient } from "@aws-sdk/client-sqs";
import { Configuration } from "../../infra/configuration";

@injectable()
export default class ChangeVideoStatusQueueServiceImpl extends SqsQueueService implements ChangeVideoStatusQueueService {
    
    constructor(
        @inject(TYPES.Logger) protected readonly logger: Logger,
        @inject(TYPES.SQSClient) protected readonly client: SQSClient,
        @inject(TYPES.Configuration) protected configuration: Configuration
    ) {
        super(logger, client)
    }

    async send(input: ChangeVideoStatus): Promise<void> {
        this.sendMessage(input, this.configuration.STATUS_QUEUE_NAME)
    }

}