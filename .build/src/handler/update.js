"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const container_1 = require("../infra/container");
const types_1 = require("../types");
const awsEventHelper_1 = __importDefault(require("../helper/awsEventHelper"));
const handler = async (event) => {
    const logger = container_1.container.get(types_1.TYPES.Logger);
    logger.debug(`Received event`, { event });
    try {
        const controller = container_1.container.get(types_1.TYPES.VideoController);
        for (const record of event.Records) {
            logger.debug(`Start processing record`, { record });
            const input = (0, awsEventHelper_1.default)(record.body);
            const response = await controller.update(input);
            logger.debug(`End processing record`, { record, response });
        }
    }
    catch (error) {
        logger.error(error.message, { error });
        throw new Error(error);
    }
};
exports.handler = handler;
