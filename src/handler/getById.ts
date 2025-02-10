import 'reflect-metadata'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { container } from "../infra/container"
import Logger from "../infra/logger/Logger"
import { TYPES } from "../types"
import VideoController from "../controller/VideoController"
import { getAuthenticatedUser } from "../helper/authenticatedUser"

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = container.get<Logger>(TYPES.Logger)

    try {
        logger.debug(`Received event`, { event })
        const controller = container.get<VideoController>(TYPES.VideoController)
        const input = { id: event.pathParameters?.id || '', userId: getAuthenticatedUser(event) }
        const response = await controller.getById(input)
        return {
            statusCode: 200,
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