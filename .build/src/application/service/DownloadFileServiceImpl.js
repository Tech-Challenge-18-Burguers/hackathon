"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const client_s3_1 = require("@aws-sdk/client-s3");
const path = __importStar(require("path"));
const promises_1 = require("stream/promises");
const util_1 = require("util");
const promises_2 = require("fs/promises");
const inversify_1 = require("inversify");
const types_1 = require("../../types");
const Logger_1 = __importDefault(require("../../infra/logger/Logger"));
const streamPipeline = (0, util_1.promisify)(promises_1.pipeline);
let DownloadFileServiceImpl = class DownloadFileServiceImpl {
    constructor(logger, client) {
        this.logger = logger;
        this.client = client;
    }
    async download(input) {
        const command = new client_s3_1.GetObjectCommand({ Bucket: input.bucket, Key: input.key });
        this.logger.debug(`Create command to download`, { command });
        const response = await this.client.send(command);
        this.logger.debug(`Response to download command`, { command, response });
        if (response.$metadata.httpStatusCode !== 200) {
            throw new Error('Erro to get object');
        }
        if (!response.Body)
            throw new Error('Body not found');
        const filePath = path.join(input.outputDir, input.filename);
        const byteArray = await response.Body.transformToByteArray();
        this.logger.debug(`Write file to ${filePath}`);
        await (0, promises_2.writeFile)(filePath, Buffer.from(byteArray));
        return {
            baseDir: input.outputDir,
            filename: input.filename,
            path: filePath
        };
    }
};
DownloadFileServiceImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Logger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.S3Client)),
    __metadata("design:paramtypes", [Logger_1.default,
        client_s3_1.S3Client])
], DownloadFileServiceImpl);
exports.default = DownloadFileServiceImpl;
