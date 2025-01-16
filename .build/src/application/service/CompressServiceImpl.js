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
const fs = __importStar(require("fs/promises"));
const fs_1 = require("fs");
const archiver_1 = __importDefault(require("archiver"));
const path = __importStar(require("path"));
const inversify_1 = require("inversify");
const types_1 = require("../../types");
const Logger_1 = __importDefault(require("../../infra/logger/Logger"));
let CompressServiceImpl = class CompressServiceImpl {
    constructor(logger) {
        this.logger = logger;
    }
    async compress(input) {
        this.logger.info(`Start compress files`, { input });
        const fileNames = await fs.readdir(input.baseDir);
        const files = fileNames.map(file => path.join(input.baseDir, file));
        await this.createZip(input.outputFile, files, input.baseDir);
        this.logger.info(`End of compress files`, { input });
        return {
            filename: input.outputFile
        };
    }
    async createZip(outputFile, files, baseDir) {
        const output = (0, fs_1.createWriteStream)(outputFile);
        const archive = (0, archiver_1.default)('zip', { zlib: { level: 9 } });
        return new Promise((resolve, reject) => {
            output.on('close', () => {
                this.logger.info(`ZIP file created successfully: ${outputFile} (${archive.pointer()} bytes)`);
                resolve();
            });
            output.on('error', (err) => {
                this.logger.error('Error on try write to zip file:', err);
                reject(err);
            });
            archive.on('error', (err) => {
                this.logger.error('Error on try create ZIP:', err);
                reject(err);
            });
            archive.pipe(output);
            files.forEach((file) => {
                if ((0, fs_1.existsSync)(file)) {
                    archive.file(file, { name: file.replace(baseDir, '') });
                }
                else {
                    this.logger.warn(`File not found: ${file}`);
                }
            });
            archive.finalize();
        });
    }
};
CompressServiceImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Logger)),
    __metadata("design:paramtypes", [Logger_1.default])
], CompressServiceImpl);
exports.default = CompressServiceImpl;
