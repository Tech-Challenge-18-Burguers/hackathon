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
Object.defineProperty(exports, "__esModule", { value: true });
const extensionHelper_1 = require("../../helper/extensionHelper");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const arrayHelper_1 = require("../../helper/arrayHelper");
class SplitVideoToFramesUseCase {
    constructor(downloadFileService, uploadFileService, splitVideoService, compressQueueService, configuration, logger) {
        this.downloadFileService = downloadFileService;
        this.uploadFileService = uploadFileService;
        this.splitVideoService = splitVideoService;
        this.compressQueueService = compressQueueService;
        this.configuration = configuration;
        this.logger = logger;
    }
    async execute(input) {
        const workdir = path.join(this.configuration.TMP_DIR, input.id);
        if (!fs.existsSync(workdir)) {
            this.logger.debug(`Create a workdir ${workdir}`);
            fs.mkdirSync(workdir);
        }
        const downloadMetadata = {
            bucket: input.bucket,
            key: input.key,
            filename: `video${(0, extensionHelper_1.getExtension)(input.key)}`,
            outputDir: workdir
        };
        const videoFile = await this.downloadFileService.download(downloadMetadata);
        this.logger.info(`Download video successfully`, { videoFile });
        const framesWorkdir = path.join(workdir, 'frames');
        this.logger.debug(`Defined frames workdir ${framesWorkdir}`);
        const framesOutput = await this.splitVideoService.split({ filePath: videoFile.path, outputDir: framesWorkdir });
        this.logger.info(`Split video successfully`, { framesOutput });
        const uploadFiles = framesOutput.filenames
            .map(item => ({
            bucket: input.bucket,
            key: `${input.id}/frames/${item}`,
            filePath: path.join(framesOutput.outputDir, item)
        }));
        this.logger.info(`Files to be upload`, { uploadFiles });
        const framesPool = (0, arrayHelper_1.splitArrayIntoChunks)(uploadFiles, 10);
        const keys = [];
        for (const frames of framesPool) {
            const response = await Promise
                .all(frames.map((frame) => this.uploadFileService.upload(frame)));
            this.logger.debug(`Response to upload chunck`, { response });
            const partial = response.map(item => item.key);
            keys.push(...partial);
        }
        await this.compressQueueService.send({ bucket: input.bucket, id: input.id });
        return {
            filenames: framesOutput.filenames,
            keyPrefix: `${input.id}/frames/`,
            keys
        };
    }
}
exports.default = SplitVideoToFramesUseCase;
