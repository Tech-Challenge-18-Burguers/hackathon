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
const authenticatedUser_1 = require("../helper/authenticatedUser");
const handler = async (event) => {
    const logger = container_1.container.get(types_1.TYPES.Logger);
    try {
        logger.debug(`Received event`, { event });
        const controller = container_1.container.get(types_1.TYPES.VideoController);
        const input = { ...(0, awsEventHelper_1.default)(event.body), userId: (0, authenticatedUser_1.getAuthenticatedUser)(event) };
        const response = await controller.generatePresignUrl(input);
        logger.info(`Generated with success`, { response });
        return {
            statusCode: 200,
            body: JSON.stringify(response)
        };
    }
    catch (error) {
        logger.error(error.message, { error });
        return {
            statusCode: 400,
            body: JSON.stringify(error)
        };
    }
};
exports.handler = handler;
