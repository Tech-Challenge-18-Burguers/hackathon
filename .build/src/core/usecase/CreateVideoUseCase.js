"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_crypto_1 = require("node:crypto");
class CreateVideoUseCase {
    constructor(logger, repository) {
        this.logger = logger;
        this.repository = repository;
    }
    async execute(input) {
        const video = { ...input, id: (0, node_crypto_1.randomUUID)() };
        this.logger.info(`Convert input to entity`, { input, video });
        return this.repository.save(video);
    }
}
exports.default = CreateVideoUseCase;
