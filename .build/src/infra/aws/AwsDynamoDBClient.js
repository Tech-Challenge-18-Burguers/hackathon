"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class AwsDynamoDBClient extends client_dynamodb_1.DynamoDBClient {
    constructor() {
        super({ region: process.env.AWS_REGION || 'us-east-1' });
    }
}
exports.default = AwsDynamoDBClient;
