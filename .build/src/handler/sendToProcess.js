"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const handler = async (event) => {
    console.log(event);
    const client = new client_s3_1.S3Client({ region: 'us-east-1' });
    const command = new client_s3_1.GetObjectCommand({
        Bucket: 'serverless-framework-deployments-us-east-1-5232e58e-dd98',
        Key: 'teste.json'
    });
    const response = await client.send(command);
    console.log(response.$metadata);
    if (response.$metadata.httpStatusCode != 200) {
        throw new Error('Erro ao tentar ler arquivo');
    }
    const body = await response.Body?.transformToString();
    return {
        statusCode: 200,
        body: body
    };
};
exports.handler = handler;
