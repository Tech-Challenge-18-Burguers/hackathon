"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class DynamoDBRepository {
    constructor(logger, client, tableName) {
        this.logger = logger;
        this.client = client;
        this.tableName = tableName;
    }
    async putItem(entity) {
        const command = {
            TableName: this.tableName,
            Item: this.convertToSchema(entity)
        };
        this.logger.debug(`Create PutItemCommandInput`, { command });
        const response = await this.client.send(new client_dynamodb_1.PutItemCommand(command));
        this.logger.debug(`Response to PutItemCommand`, { response });
        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error(`PutItem Failed`);
        }
        return entity;
    }
    async getItemById(id) {
        const command = {
            TableName: this.tableName,
            Key: id
        };
        this.logger.debug(`Create GetItemCommandInput`, { command });
        const response = await this.client.send(new client_dynamodb_1.GetItemCommand(command));
        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error(`GetItemById Failed`);
        }
        if (!response.Item) {
            throw new Error('Item not found');
        }
        return this.convertFromSchema(response.Item);
    }
    async updateItem(id, attributes) {
        const expressionAttributesNames = Object.keys(attributes)
            .reduce((prev, curr) => ({ ...prev, [`#${curr}`]: curr }), {});
        const expressionAttributesValues = Object.keys(attributes)
            .reduce((prev, curr) => ({ ...prev, [`:${curr}`]: attributes[curr] }), {});
        const updateExpression = 'SET ' + Object.keys(attributes)
            .map(key => `#${key} = :${key}`).join(',');
        const command = {
            TableName: this.tableName,
            Key: { id: { S: id } },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributesNames,
            ExpressionAttributeValues: expressionAttributesValues,
            ReturnValues: "ALL_NEW"
        };
        this.logger.debug(`Create UpdateCommand`, { command });
        const response = await this.client.send(new lib_dynamodb_1.UpdateCommand(command));
        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error(`UpdateItem Failed`);
        }
        if (response.Attributes) {
            return this.convertFromSchema(response.Attributes);
        }
        return attributes;
    }
    async findByFilter(attibuteKey, attributeValue) {
        const command = {
            TableName: this.tableName,
            FilterExpression: '#attr = :value',
            ExpressionAttributeNames: { '#attr': attibuteKey },
            ExpressionAttributeValues: { ':value': attributeValue }
        };
        this.logger.debug(`Create QueryCommand`, { command });
        const response = await this.client.send(new client_dynamodb_1.QueryCommand(command));
        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error(`UpdateItem Failed`);
        }
        if (response.Items) {
            return response.Items.map(item => this.convertFromSchema(item));
        }
        return [];
    }
    convertToSchema(entity) {
        const schema = {};
        for (const key in entity) {
            const value = entity[key];
            if (typeof value === "string") {
                schema[key] = { S: value };
            }
            else if (typeof value === "number") {
                schema[key] = { N: value.toString() };
            }
            else {
                throw new Error(`Unsupported type for key "${key}"`);
            }
        }
        return schema;
    }
    convertFromSchema(schema) {
        const entity = {};
        for (const key in schema) {
            const value = schema[key];
            if (value.S !== undefined) {
                entity[key] = value.S;
            }
            else if (value.N !== undefined) {
                entity[key] = Number(value.N);
            }
            else {
                throw new Error(`Unsupported schema format for key "${key}"`);
            }
        }
        return entity;
    }
}
exports.default = DynamoDBRepository;
