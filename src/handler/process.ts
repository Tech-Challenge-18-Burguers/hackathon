import 'reflect-metadata'
import { SQSEvent } from 'aws-lambda'
import { SplitVideoToFramesInput } from "../core/usecase/SplitVideoToFramesUseCase"
import { container } from '../infra/container'
import { TYPES } from '../types'
import VideoController from '../controller/VideoController'
import { Logger } from '@aws-lambda-powertools/logger'
import parseRecordBody from '../helper/awsEventHelper'

export const handler = async (event: SQSEvent): Promise<void> => {

    const logger = container.get<Logger>(TYPES.Logger)
    const controller = container.get<VideoController>(TYPES.VideoController)
    
    logger.debug(`Start fn process.handler`, { event })
    for(const record of event.Records) {
        logger.info(`Processing record`, { record })
        const input: SplitVideoToFramesInput = parseRecordBody(record.body)
        const response = await controller.process(input)
        logger.info(`Finish processing record`, { record, response })
    }

    logger.debug(`End fn process.handler`)
}