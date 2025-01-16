"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
require("reflect-metadata");
const container_1 = require("../infra/container");
const types_1 = require("../types");
const awsEventHelper_1 = __importDefault(require("../helper/awsEventHelper"));
const handler = async (event) => {
    const logger = container_1.container.get(types_1.TYPES.Logger);
    const controller = container_1.container.get(types_1.TYPES.FileController);
    logger.debug(`Start fn compress.handler`, { event });
    for (const record of event.Records) {
        logger.info(`Processing record`, { record });
        const input = (0, awsEventHelper_1.default)(record.body);
        const response = await controller.compress(input);
        logger.info(`Finish Processing record`, { record, response });
    }
    logger.debug(`End fn compress.handler`);
};
exports.handler = handler;
