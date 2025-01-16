import 'reflect-metadata'
import { S3Event } from "aws-lambda";
import { container } from "../infra/container";
import Logger from "../infra/logger/Logger";
import { TYPES } from "../types";
import VideoController from "../controller/VideoController";
import { TriggerVideoInput } from "../core/usecase/TriggerVideoToProcessUseCase";

export const handler = async (event: S3Event): Promise<void> => {

    const logger = container.get<Logger>(TYPES.Logger)
    const controller = container.get<VideoController>(TYPES.VideoController)

    logger.debug(`Start fn trigger.handler`, { event })

    for(const record of event.Records) {
        logger.debug(`Start processing record`, { record })
        const input: TriggerVideoInput = { 
            bucket: record.s3.bucket.name,
            key: record.s3.object.key
        }

        await controller.trigger(input)
        logger.debug(`End processing record`, { record })
    }
}