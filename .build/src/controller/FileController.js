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
const types_1 = require("../types");
const Logger_1 = __importDefault(require("../infra/logger/Logger"));
const CompressFilesUseCase_1 = __importDefault(require("../core/usecase/CompressFilesUseCase"));
let FileController = class FileController {
    constructor(logger, downloadFileService, uploadFileService, configuration, listFilesByPrefixService, compressService) {
        this.logger = logger;
        this.downloadFileService = downloadFileService;
        this.uploadFileService = uploadFileService;
        this.configuration = configuration;
        this.listFilesByPrefixService = listFilesByPrefixService;
        this.compressService = compressService;
    }
    async compress(input) {
        const usecase = new CompressFilesUseCase_1.default(this.logger, this.compressService, this.downloadFileService, this.uploadFileService, this.listFilesByPrefixService, this.configuration);
        return usecase.execute(input);
    }
};
FileController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Logger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.DownloadFileService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.UploadFileService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.Configuration)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.ListFilesByPrefixService)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.CompressService)),
    __metadata("design:paramtypes", [Logger_1.default, Object, Object, Object, Object, Object])
], FileController);
exports.default = FileController;
