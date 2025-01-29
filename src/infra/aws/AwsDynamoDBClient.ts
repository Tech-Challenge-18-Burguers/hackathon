import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export default class AwsDynamoDBClient extends DynamoDBClient {
    constructor() {
        super({ region: process.env.AWS_REGION || 'us-east-1', endpoint: 'http://localhost:8900' })
    }
}