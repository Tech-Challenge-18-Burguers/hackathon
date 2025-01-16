import { APIGatewayProxyEventV2 } from "aws-lambda";

export function getAuthenticatedUser(event: APIGatewayProxyEventV2) {
    return `user-fake-001`
}