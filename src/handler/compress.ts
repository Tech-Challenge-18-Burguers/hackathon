import { S3Event, SQSEvent } from "aws-lambda";
import { container } from "../infra/container";
import { TYPES } from "../types";
import Logger from "../infra/logger/Logger";
import FileController from "../controller/FileController";
import { CompressFilesInput } from "../core/usecase/CompressFilesUseCase";
import parseRecordBody from "../helper/awsEventHelper";

export const handler = async (event: SQSEvent): Promise<void> => {

    const logger = container.get<Logger>(TYPES.Logger)
    const controller = container.get<FileController>(TYPES.FileController)
    
    logger.debug(`Start fn compress.handler`, { event })
    for(const record of event.Records) {
        logger.info(`Processing record`, { record })
        const input: CompressFilesInput = parseRecordBody(record.body)
        const response = await controller.compress(input)
        logger.info(`Finish Processing record`, { record, response })
    }
    logger.debug(`End fn compress.handler`)
}