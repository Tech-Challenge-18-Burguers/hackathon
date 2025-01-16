"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_sqs_1 = require("@aws-sdk/client-sqs");
class SqsQueueService {
    constructor(logger, client) {
        this.logger = logger;
        this.client = client;
    }
    async sendMessage(messageBody, queueName, attributes) {
        const queueUrl = await this.getQueueUrl(queueName);
        const command = new client_sqs_1.SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify(messageBody),
            MessageAttributes: this.buildMessageAttributes(attributes)
        });
        this.logger.debug(`Create a command send queue ${queueName}`, { command });
        const response = await this.client.send(command);
        this.logger.debug(`Response to send message to queue ${queueName}`, { response });
        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error('Error to send message to queue');
        }
    }
    async getQueueUrl(queueName) {
        this.logger.debug(`Get queue url from queueName ${queueName}`);
        const command = new client_sqs_1.GetQueueUrlCommand({ QueueName: queueName });
        const response = await this.client.send(command);
        this.logger.debug(`Response to get queue url`, { response });
        if (response.QueueUrl) {
            return response.QueueUrl;
        }
        throw new Error('Queue Not Found!');
    }
    buildMessageAttributes(attributes) {
        if (!attributes)
            return;
        return Object.keys(attributes).reduce((previous, current) => {
            return {
                ...previous,
                [current]: { DataType: 'String', StringValue: attributes[current] }
            };
        }, {});
    }
}
exports.default = SqsQueueService;
