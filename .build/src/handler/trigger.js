"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const container_1 = require("../infra/container");
const types_1 = require("../types");
const handler = async (event) => {
    const logger = container_1.container.get(types_1.TYPES.Logger);
    const controller = container_1.container.get(types_1.TYPES.VideoController);
    logger.debug(`Start fn trigger.handler`, { event });
    for (const record of event.Records) {
        logger.debug(`Start processing record`, { record });
        const input = {
            bucket: record.s3.bucket.name,
            key: record.s3.object.key
        };
        await controller.trigger(input);
        logger.debug(`End processing record`, { record });
    }
};
exports.handler = handler;
