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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const types_1 = require("../../types");
const Logger_1 = __importDefault(require("../../infra/logger/Logger"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const Storage_1 = require("../../core/entity/Storage");
let StorageServiceImpl = class StorageServiceImpl {
    constructor(logger, client) {
        this.logger = logger;
        this.client = client;
    }
    async generateUrl(input) {
        const command = this.generateCommand(input);
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.client, command, { expiresIn: (input.duration * 60) }); // transform to minutes
        return { url };
    }
    generateCommand(input) {
        const params = { Bucket: input.bucket, Key: input.key };
        const actions = {
            [Storage_1.GenerateUrlType.DOWNLOAD]: new client_s3_1.GetObjectCommand(params),
            [Storage_1.GenerateUrlType.UPLOAD]: new client_s3_1.PutObjectCommand(params)
        };
        return actions[input.type];
    }
};
StorageServiceImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Logger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.S3Client)),
    __metadata("design:paramtypes", [Logger_1.default,
        client_s3_1.S3Client])
], StorageServiceImpl);
exports.default = StorageServiceImpl;
