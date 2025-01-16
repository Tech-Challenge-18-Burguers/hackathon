import { inject, injectable } from "inversify";
import VideoRepository from "../../core/repository/VideoRepository";
import Video from "../../core/entity/Video";
import { TYPES } from "../../types";
import Logger from "../../infra/logger/Logger";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Configuration } from "../../infra/configuration";
import DynamoDBRepository from "./DynamoDBRepository";

@injectable()
export default class VideoRepositoryDynamoDB extends DynamoDBRepository implements VideoRepository {
    
    constructor(
        @inject(TYPES.Logger) protected readonly logger: Logger,
        @inject(TYPES.DynamoDBClient) protected readonly client: DynamoDBClient,
        @inject(TYPES.Configuration) protected readonly configuration: Configuration
    ) {
        super(logger, client, configuration.VIDEO_TABLE)
    }

    async save(video: Video): Promise<Video> {
        return this.putItem(video)
    }
    
    async update(video: Video): Promise<Video> {
        return this.updateItem(video.id, { status: video.status })
    }
    
    async findById(id: string): Promise<Video> {
        return this.getItemById(id)
    }
    
    async findAllByUserId(userId: string): Promise<Array<Video>> {
        return this.findByFilter('userId', userId)
    }

}