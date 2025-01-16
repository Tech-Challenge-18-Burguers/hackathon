"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UpdateVideoUseCase {
    constructor(logger, repository) {
        this.logger = logger;
        this.repository = repository;
    }
    async execute(input) {
        return this.repository.update({
            id: input.id,
            status: input.status,
            userId: input.userId,
            name: "",
        });
    }
}
exports.default = UpdateVideoUseCase;
