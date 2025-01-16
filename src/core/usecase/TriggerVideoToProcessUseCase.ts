import Logger from "../../infra/logger/Logger";
import TriggerQueueService from "../service/TriggerQueueService";

export type TriggerVideoInput = {
    bucket: string
    key: string
}

export default class TriggerVideoToProcessUseCase {
    
    constructor(
        private readonly logger: Logger,
        private readonly queueService: TriggerQueueService
    ) {}

    async execute(input: TriggerVideoInput): Promise<void> {
        const id = this.extractId(input.key)

        const videoMetadata = {
            bucket: input.bucket,
            key: input.key,
            id: id
        }
        this.logger.info(`video metadata`, { videoMetadata })
        await this.queueService.send(videoMetadata)
    }

    private extractId(key: string): string {
        return key.split('/')[0]
    }
}