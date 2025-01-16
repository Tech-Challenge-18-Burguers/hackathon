import Logger from "../../infra/logger/Logger"
import { QueryCommandInput, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb"
import { 
    AttributeValue,
    DynamoDBClient,
    GetItemCommand,
    GetItemCommandInput,
    PutItemCommand,
    PutItemCommandInput, 
    QueryCommand
} from "@aws-sdk/client-dynamodb"

export interface Schema {
    [key: string]: { S?: string, N?: string }
}

export type Entity = Record<string, string | number>

export default abstract class DynamoDBRepository {
    constructor(
        protected readonly logger: Logger,
        protected readonly client: DynamoDBClient,
        protected readonly tableName: string
    ) {}

    protected async putItem<T>(entity: T): Promise<T> {
        const command: PutItemCommandInput = {
            TableName: this.tableName,
            Item: this.convertToSchema(entity as any)
        }
        this.logger.debug(`Create PutItemCommandInput`, { command })
        const response = await this.client.send(new PutItemCommand(command))
        this.logger.debug(`Response to PutItemCommand`, { response })
        if(response.$metadata.httpStatusCode !== 200) {
            throw new Error(`PutItem Failed`)
        }
        return entity
    }

    protected async getItemById<T>(id: any): Promise<T> {
        const command: GetItemCommandInput = {
            TableName: this.tableName,
            Key: id
        }
        this.logger.debug(`Create GetItemCommandInput`, { command })
        const response = await this.client.send(new GetItemCommand(command))
        if(response.$metadata.httpStatusCode !== 200) {
            throw new Error(`GetItemById Failed`)
        }
        if(!response.Item) {
            throw new Error('Item not found')
        }
        return this.convertFromSchema(response.Item) as T
    }

    protected async updateItem<T>(id: any, attributes: { [K: string]: any }): Promise<T> {

        const expressionAttributesNames = Object.keys(attributes)
            .reduce((prev, curr) => ({...prev, [`#${curr}`]: curr }), {})

        const expressionAttributesValues = Object.keys(attributes)
            .reduce((prev, curr)=> ({ ...prev, [`:${curr}`]: attributes[curr] }), {})

        const updateExpression = 'SET ' + Object.keys(attributes)
            .map(key => `#${key} = :${key}`).join(',')

        const command: UpdateCommandInput = {
            TableName: this.tableName,
            Key: { id: { S: id }  },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributesNames,
            ExpressionAttributeValues: expressionAttributesValues,
            ReturnValues: "ALL_NEW"
        }
        this.logger.debug(`Create UpdateCommand`, { command })

        const response = await this.client.send(new UpdateCommand(command))
        if(response.$metadata.httpStatusCode !== 200) {
            throw new Error(`UpdateItem Failed`)
        }
        if(response.Attributes) {
            return this.convertFromSchema(response.Attributes) as T
        }
        return attributes as T
    }

    protected async findByFilter<T>(attibuteKey: string, attributeValue: any): Promise<Array<T>> {
        const command: QueryCommandInput = {
            TableName: this.tableName,
            FilterExpression: '#attr = :value',
            ExpressionAttributeNames: { '#attr': attibuteKey },
            ExpressionAttributeValues: { ':value': attributeValue }
        }
        this.logger.debug(`Create QueryCommand`, { command })

        const response = await this.client.send(new QueryCommand(command))
        if(response.$metadata.httpStatusCode !== 200) {
            throw new Error(`UpdateItem Failed`)
        }

        if(response.Items) {
            return response.Items.map(item => this.convertFromSchema(item) as T)
        }
        return []
    }

    protected convertToSchema<T extends Entity>(entity: T): Record<string, AttributeValue> | undefined {
        const schema: Schema = {}

        for (const key in entity) {
            const value = entity[key]
            if (typeof value === "string") {
                schema[key] = { S: value }
            } else if (typeof value === "number") {
                schema[key] = { N: value.toString() }
            } else {
                throw new Error(`Unsupported type for key "${key}"`)
            }
        }

        return schema as Record<string, AttributeValue> | undefined
    }

    protected convertFromSchema(schema: Schema): Entity {
        const entity: Entity = {}

        for (const key in schema) {
            const value = schema[key]
            if (value.S !== undefined) {
                entity[key] = value.S
            } else if (value.N !== undefined) {
                entity[key] = Number(value.N) 
            } else {
                throw new Error(`Unsupported schema format for key "${key}"`)
            }
        }

        return entity
    }
}


