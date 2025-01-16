"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TriggerVideoToProcessUseCase {
    constructor(logger, queueService) {
        this.logger = logger;
        this.queueService = queueService;
    }
    async execute(input) {
        const id = this.extractId(input.key);
        const videoMetadata = {
            bucket: input.bucket,
            key: input.key,
            id: id
        };
        this.logger.info(`video metadata`, { videoMetadata });
        await this.queueService.send(videoMetadata);
    }
    extractId(key) {
        return key.split('/')[0];
    }
}
exports.default = TriggerVideoToProcessUseCase;
