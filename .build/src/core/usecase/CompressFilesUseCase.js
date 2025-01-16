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
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const arrayHelper_1 = require("../../helper/arrayHelper");
class CompressFilesUseCase {
    constructor(logger, compressService, downloadService, uploadService, listFilesByPrefixService, configuration) {
        this.logger = logger;
        this.compressService = compressService;
        this.downloadService = downloadService;
        this.uploadService = uploadService;
        this.listFilesByPrefixService = listFilesByPrefixService;
        this.configuration = configuration;
    }
    async execute(input) {
        const prefix = `${input.id}/frames`;
        const workdir = path.join(this.configuration.TMP_DIR, `${input.id}-frames`);
        if (!fs.existsSync(workdir)) {
            this.logger.debug(`Create a workdir ${workdir}`);
            fs.mkdirSync(workdir);
        }
        const objects = await this.listFilesByPrefixService
            .list({ bucket: this.configuration.DATA_BUCKET_NAME, prefix });
        const filesMetadata = objects.keys.map(key => ({
            bucket: objects.bucket,
            key,
            filename: this.extractFileName(key),
            outputDir: workdir
        }));
        const chunks = (0, arrayHelper_1.splitArrayIntoChunks)(filesMetadata, 10);
        for (const chunk of chunks) {
            const response = await Promise.all(chunk.map((item) => this.downloadService.download(item)));
            this.logger.debug(`Response to download chunk`, { chunk, response });
        }
        this.logger.info(`Download of frames sucessfully`);
        const zipFilePath = path.join(this.configuration.TMP_DIR, `${input.id}.zip`);
        const compressResponse = await this.compressService.compress({ baseDir: workdir, outputFile: zipFilePath });
        const uploadResponse = await this.uploadService
            .upload({ bucket: input.bucket, key: `${input.id}/frames.zip`, filePath: compressResponse.filename });
        this.logger.info(`Upload successfully`, { uploadResponse });
    }
    extractFileName(key) {
        return key.split('/').slice(-1)[0];
    }
}
exports.default = CompressFilesUseCase;
