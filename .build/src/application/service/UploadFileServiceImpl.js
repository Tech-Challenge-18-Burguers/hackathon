"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = require("fs");
const inversify_1 = require("inversify");
const types_1 = require("../../types");
const logger_1 = require("@aws-lambda-powertools/logger");
let UploadFileServiceImpl = class UploadFileServiceImpl {
    constructor(logger, client) {
        this.logger = logger;
        this.client = client;
    }
    async upload(input) {
        this.logger.debug(`Upload file to s3`, { input });
        const fileStream = (0, fs_1.createReadStream)(input.filePath);
        const command = new client_s3_1.PutObjectCommand({
            Bucket: input.bucket,
            Key: input.key,
            Body: fileStream
        });
        this.logger.debug(`Put object with command`, { command });
        const response = await this.client.send(command);
        this.logger.debug(`Put object with response`, { response });
        if (response.$metadata.httpStatusCode !== 200) {
            return {
                bucket: input.bucket,
                key: input.key,
                status: 'FAILED'
            };
        }
        return {
            bucket: input.bucket,
            key: input.key,
            status: 'SUCCESS'
        };
    }
};
UploadFileServiceImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Logger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.S3Client)),
    __metadata("design:paramtypes", [logger_1.Logger,
        client_s3_1.S3Client])
], UploadFileServiceImpl);
exports.default = UploadFileServiceImpl;
