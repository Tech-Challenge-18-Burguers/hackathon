import Logger from "../../infra/logger/Logger";
import { GetQueueUrlCommand, SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'

export default abstract class SqsQueueService {

    constructor(
        protected readonly logger: Logger,
        protected readonly client: SQSClient
    ) {}

    protected async sendMessage(messageBody: any, queueName: string, attributes?: { K: [V: string] }) {
        const queueUrl = await this.getQueueUrl(queueName)
        
        const command = new SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify(messageBody),
            MessageAttributes: this.buildMessageAttributes(attributes)
        })
        this.logger.debug(`Create a command send queue ${queueName}`, { command })
        const response = await this.client.send(command)
        this.logger.debug(`Response to send message to queue ${queueName}`, { response })
        if(response.$metadata.httpStatusCode !== 200) {
            throw new Error('Error to send message to queue')
        }
    }

    protected async getQueueUrl(queueName: string) {
        this.logger.debug(`Get queue url from queueName ${queueName}`)
        const command = new GetQueueUrlCommand({ QueueName: queueName })
        const response = await this.client.send(command)
        this.logger.debug(`Response to get queue url`, { response })
        if(response.QueueUrl) {
            return response.QueueUrl
        }
        throw new Error('Queue Not Found!')
    }

    protected buildMessageAttributes(attributes?: { [K: string]: [V: string] }) {
        if(!attributes) return
        return Object.keys(attributes).reduce((previous, current) => {
            return {
                ...previous,
                [current]: { DataType: 'String', StringValue: attributes[current] }
            }
        }, {})
    }
}