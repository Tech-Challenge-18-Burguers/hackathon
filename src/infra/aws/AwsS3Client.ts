import { S3Client } from "@aws-sdk/client-s3";

export default class AwsS3Client extends S3Client {
    constructor() {
        super({ region: process.env.AWS_REGION || 'us-east-1' })
    }
}