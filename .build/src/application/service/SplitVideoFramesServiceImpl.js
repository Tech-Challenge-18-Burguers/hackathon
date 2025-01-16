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
const path_1 = require("path");
const fs_1 = require("fs");
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const child_process_1 = require("child_process");
const inversify_1 = require("inversify");
const types_1 = require("../../types");
const Logger_1 = __importDefault(require("../../infra/logger/Logger"));
let SplitVideoFramesServiceImpl = class SplitVideoFramesServiceImpl {
    constructor(logger) {
        this.logger = logger;
    }
    async split(input) {
        this.logger.info(`Start split video`, { input });
        if (!(0, fs_1.existsSync)(input.outputDir)) {
            this.logger.warn(`Directory ${input.outputDir} not found, create ${input.outputDir} directory`);
            (0, fs_1.mkdirSync)(input.outputDir);
        }
        const outputPattern = (0, path_1.join)(input.outputDir, 'frame-%03d.jpg');
        const fps = 1; // Frames por segundo
        const command = `${ffmpeg_static_1.default} -i ${input.filePath} -vf fps=${fps} ${outputPattern}`;
        this.logger.debug(`Convert command: ${command}`);
        await this.generateFrames(command);
        const files = await new Promise((resolve, reject) => {
            (0, fs_1.readdir)(input.outputDir, (error, files) => {
                if (error) {
                    reject(error);
                }
                resolve(files);
            });
        });
        return {
            outputDir: input.outputDir,
            filenames: files
        };
    }
    async generateFrames(command) {
        this.logger.debug(`Generate frames with command ${command}`);
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(command, (error, stdout, stderr) => {
                if (error) {
                    this.logger.error(`Error on try divide video into frames: ${error.message}`, { error, stdout, stderr });
                    reject();
                }
                this.logger.debug(`Generated frames with successfully`, { stdout, stderr });
                resolve();
            });
        });
    }
};
SplitVideoFramesServiceImpl = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Logger)),
    __metadata("design:paramtypes", [Logger_1.default])
], SplitVideoFramesServiceImpl);
exports.default = SplitVideoFramesServiceImpl;
