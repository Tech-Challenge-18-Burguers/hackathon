import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from "aws-lambda";

export function getAuthenticatedUser(event: APIGatewayProxyEvent) {
    const { claims } = event.requestContext.authorizer as any
    const userId = claims.sub
    return userId
}