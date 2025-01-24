import { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from "aws-lambda";

export function getAuthenticatedUser(event: APIGatewayProxyEvent) {
    const userId = event.requestContext.authorizer?.claims.sub
    return userId
}