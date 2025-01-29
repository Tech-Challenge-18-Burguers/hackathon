import 'reflect-metadata'
import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda"
import { container } from "../infra/container"
import Logger from "../infra/logger/Logger"
import { TYPES } from "../types"
import parseRecordBody from "../helper/awsEventHelper"
import UserController from '../controller/UserController'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
    const logger = container.get<Logger>(TYPES.Logger)

    try {
        const controller = container.get<UserController>(TYPES.VideoController)
        const input = { ...parseRecordBody(event.body) }
        const response = await controller.authenticate(input)
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