"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
class AwsS3Client extends client_s3_1.S3Client {
    constructor() {
        super({ region: process.env.AWS_REGION || 'us-east-1' });
    }
}
exports.default = AwsS3Client;
