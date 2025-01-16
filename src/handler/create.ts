import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { container } from "../infra/container";
import Logger from "../infra/logger/Logger";
import { TYPES } from "../types";
import VideoController from "../controller/VideoController";
import parseRecordBody from "../helper/awsEventHelper";
import { getAuthenticatedUser } from "../helper/authenticatedUser";

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    const logger = container.get<Logger>(TYPES.Logger)

    try {
        logger.debug(`Received event`, { event })
        const controller = container.get<VideoController>(TYPES.VideoController)
        const input = { ...parseRecordBody(event.body), userId: getAuthenticatedUser(event) }
        const response = await controller.create(input)
        return {
            statusCode: 201,
            body: JSON.stringify(response)
        }    
    } catch (error: any) {
        logger.error(error.message, { error })
        return {
            statusCode: 400,
            body: JSON.stringify(error)
        }
    }
}