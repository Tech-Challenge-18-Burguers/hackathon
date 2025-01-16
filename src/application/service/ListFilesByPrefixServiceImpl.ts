import { inject, injectable } from "inversify";
import ListFilesByPrefixService, { ListFilesByPrefixInput, ListFilesByPrefixOutput } from "../../core/service/ListFilesByPrefixService";
import { TYPES } from "../../types";
import Logger from "../../infra/logger/Logger";
import { ListBucketIntelligentTieringConfigurationsCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

@injectable()
export default class ListFilesByPrefixServiceImpl implements ListFilesByPrefixService {
    
    constructor(
        @inject(TYPES.Logger) private readonly logger: Logger,
        @inject(TYPES.S3Client) private readonly client: S3Client
    ) {}

    async list(input: ListFilesByPrefixInput): Promise<ListFilesByPrefixOutput> {
        const command = new ListObjectsV2Command({ Bucket: input.bucket, Prefix: input.prefix })
        const response = await this.client.send(command)
        if(response.$metadata.httpStatusCode !== 200) {
            throw new Error('Error on list objects by prefix')
        }
        
        if(!response.Contents) {
            throw new Error('Contents undefined')
        }

        const keys = response.Contents
            .filter(content => content.Key !== undefined)
            .map(content => content.Key)
            
        return {
            bucket: input.bucket,
            keys: keys as string[]
        }
    }

}