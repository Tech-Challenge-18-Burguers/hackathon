"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Storage_1 = require("../entity/Storage");
class GeneratePreSignedUrlUseCase {
    constructor(logger, storageService, configuration) {
        this.logger = logger;
        this.storageService = storageService;
        this.configuration = configuration;
    }
    async execute(input) {
        this.logger.debug(`Generate url to parameters`, { input });
        const params = {
            bucket: this.configuration.DATA_BUCKET_NAME,
            key: this.generateKey(input),
            type: input.type,
            duration: 20,
        };
        return this.storageService.generateUrl(params);
    }
    generateKey(input) {
        const actions = {
            [Storage_1.GenerateUrlType.DOWNLOAD]: () => `${input.id}/frames.zip`,
            [Storage_1.GenerateUrlType.UPLOAD]: () => `${input.id}/video.mp4`
        };
        return actions[input.type]();
    }
}
exports.default = GeneratePreSignedUrlUseCase;
