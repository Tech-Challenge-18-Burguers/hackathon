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
const SplitVideoToFramesUseCase_1 = __importDefault(require("../core/usecase/SplitVideoToFramesUseCase"));
const TriggerVideoToProcessUseCase_1 = __importDefault(require("../core/usecase/TriggerVideoToProcessUseCase"));
const CreateVideoUseCase_1 = __importDefault(require("../core/usecase/CreateVideoUseCase"));
const UpdateVideoUseCase_1 = __importDefault(require("../core/usecase/UpdateVideoUseCase"));
const GeneratePreSignedUrlUseCase_1 = __importDefault(require("../core/usecase/GeneratePreSignedUrlUseCase"));
let VideoController = class VideoController {
    constructor(logger, downloadFileService, splitVideoFramesService, uploadFileService, configuration, triggerQueueService, compressQueueService, videoRepository, storageService) {
        this.logger = logger;
        this.downloadFileService = downloadFileService;
        this.splitVideoFramesService = splitVideoFramesService;
        this.uploadFileService = uploadFileService;
        this.configuration = configuration;
        this.triggerQueueService = triggerQueueService;
        this.compressQueueService = compressQueueService;
        this.videoRepository = videoRepository;
        this.storageService = storageService;
    }
    async trigger(input) {
        const usecase = new TriggerVideoToProcessUseCase_1.default(this.logger, this.triggerQueueService);
        return usecase.execute(input);
    }
    async process(input) {
        const usecase = new SplitVideoToFramesUseCase_1.default(this.downloadFileService, this.uploadFileService, this.splitVideoFramesService, this.compressQueueService, this.configuration, this.logger);
        return usecase.execute(input);
    }
    async create(input) {
        const usecase = new CreateVideoUseCase_1.default(this.logger, this.videoRepository);
        return usecase.execute(input);
    }
    async update(input) {
        const usecase = new UpdateVideoUseCase_1.default(this.logger, this.videoRepository);
        return usecase.execute(input);
    }
    async generatePresignUrl(input) {
        const usecase = new GeneratePreSignedUrlUseCase_1.default(this.logger, this.storageService, this.configuration);
        return usecase.execute(input);
    }
};
VideoController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.Logger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.DownloadFileService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.SplitVideoFramesService)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.UploadFileService)),
    __param(4, (0, inversify_1.inject)(types_1.TYPES.Configuration)),
    __param(5, (0, inversify_1.inject)(types_1.TYPES.TriggerQueueService)),
    __param(6, (0, inversify_1.inject)(types_1.TYPES.CompressQueueService)),
    __param(7, (0, inversify_1.inject)(types_1.TYPES.VideoRepository)),
    __param(8, (0, inversify_1.inject)(types_1.TYPES.StorageService)),
    __metadata("design:paramtypes", [Logger_1.default, Object, Object, Object, Object, Object, Object, Object, Object])
], VideoController);
exports.default = VideoController;
