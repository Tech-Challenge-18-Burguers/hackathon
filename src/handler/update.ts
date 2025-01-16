import { SQSEvent } from "aws-lambda"
import { container } from "../infra/container"
import Logger from "../infra/logger/Logger"
import { TYPES } from "../types"
import VideoController from "../controller/VideoController"
import parseRecordBody from "../helper/awsEventHelper"

export const handler = async (event: SQSEvent): Promise<void> => {
    const logger = container.get<Logger>(TYPES.Logger)

    try {
        logger.debug(`Received event`, { event })
        const controller = container.get<VideoController>(TYPES.VideoController)
        for(const record of event.Records) {
            logger.debug(`Start processing record`, { record })
            const input = parseRecordBody(record.body)
            const response = await controller.update(input)
            logger.debug(`End processing record`, { record, response })
        }
    } catch (error: any) {
        logger.error(error.message, { error })
        throw new Error(error)
    }
}