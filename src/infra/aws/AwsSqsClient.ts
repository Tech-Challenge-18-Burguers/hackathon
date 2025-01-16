import { SQSClient } from "@aws-sdk/client-sqs"
import { injectable } from "inversify"

@injectable()
export default class AwsSqsClient extends SQSClient {
    constructor() {
        super({ region: process.env.AWS_REGION || 'us-east-1' })
    }
}