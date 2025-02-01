import UnauthorizedException from "../../../core/exception/UnauthorizedException";
import Video, {VideoStatus} from "../../../core/entity/Video";
import {GenerateUrlOutput, GenerateUrlType} from "../../../core/entity/Storage";
import {Configuration} from "../../../infra/configuration";
import ChangeVideoStatusQueueService from "../../../core/service/ChangeVideoStatusQueueService";
import VideoRepository from "../../../core/repository/VideoRepository";
import StorageService from '../../../core/service/StorageService';
import Logger from "../../../infra/logger/Logger";
import GeneratePreSignedUrlUseCase, {PreSignUrlInput} from "../../../core/usecase/GeneratePreSignedUrlUseCase";

describe('GeneratePreSignedUrlUseCase', () => {
    let useCase: GeneratePreSignedUrlUseCase;
    let loggerMock: jest.Mocked<Logger>;
    let storageServiceMock: jest.Mocked<StorageService>;
    let videoRepositoryMock: jest.Mocked<VideoRepository>;
    let changeVideoStatusServiceMock: jest.Mocked<ChangeVideoStatusQueueService>;
    let configurationMock: jest.Mocked<Configuration>;

    beforeEach(() => {
        loggerMock = { debug: jest.fn(), info: jest.fn() } as any;
        storageServiceMock = { generateUrl: jest.fn() } as any;
        videoRepositoryMock = { findById: jest.fn() } as any;
        changeVideoStatusServiceMock = { send: jest.fn() } as any;
        configurationMock = { DATA_BUCKET_NAME: 'test-bucket' } as any;

        useCase = new GeneratePreSignedUrlUseCase(
            loggerMock,
            storageServiceMock,
            videoRepositoryMock,
            changeVideoStatusServiceMock,
            configurationMock
        );
    });

    it('should generate a download URL', async () => {
        const input: PreSignUrlInput = { id: 'video-123', userId: 'user-1', type: GenerateUrlType.DOWNLOAD };
        const video: Video = { id: 'video-123', name: 'test', userId: 'user-1', status: VideoStatus.DOWNLOAD_AVAILABLE };
        const expectedUrl: GenerateUrlOutput = { url: 'https://example.com/presigned-url' };

        videoRepositoryMock.findById.mockResolvedValue(video);
        storageServiceMock.generateUrl.mockResolvedValue(expectedUrl);

        const result = await useCase.execute(input);

        expect(videoRepositoryMock.findById).toHaveBeenCalledWith(input.id);
        expect(storageServiceMock.generateUrl).toHaveBeenCalledWith({
            bucket: configurationMock.DATA_BUCKET_NAME,
            key: 'video-123/frames.zip',
            type: input.type,
            duration: 20,
        });
        expect(result).toEqual(expectedUrl);
    });

    it('should generate a URL for uploading and updating video status', async () => {
        const input: PreSignUrlInput = { id: 'video-123', userId: 'user-1', type: GenerateUrlType.UPLOAD };
        const video: Video = { id: 'video-123', name: 'test', userId: 'user-1', status: VideoStatus.CREATED };
        const expectedUrl: GenerateUrlOutput = { url: 'https://example.com/upload-url' };

        videoRepositoryMock.findById.mockResolvedValue(video);
        storageServiceMock.generateUrl.mockResolvedValue(expectedUrl);

        const result = await useCase.execute(input);

        expect(changeVideoStatusServiceMock.send).toHaveBeenCalledWith({
            id: input.id,
            status: VideoStatus.WAITING_UPLOAD,
        });
        expect(storageServiceMock.generateUrl).toHaveBeenCalledWith({
            bucket: configurationMock.DATA_BUCKET_NAME,
            key: 'video-123/video.mp4',
            type: input.type,
            duration: 20,
        });
        expect(result).toEqual(expectedUrl);
    });

    it('should throw UnauthorizedException if the user is not the owner of the video', async () => {
        const input: PreSignUrlInput = { id: 'video-123', userId: 'user-1', type: GenerateUrlType.UPLOAD };
        const video: Video = { id: 'video-123', name: 'test', userId: 'user-2', status: VideoStatus.CREATED };

        videoRepositoryMock.findById.mockResolvedValue(video);

        await expect(useCase.execute(input)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw error if video status does not allow action', async () => {
        const input: PreSignUrlInput = { id: 'video-123', userId: 'user-1', type: GenerateUrlType.UPLOAD };
        const video: Video = { id: 'video-123', name: 'test', userId: 'user-1', status: VideoStatus.DOWNLOAD_AVAILABLE };

        videoRepositoryMock.findById.mockResolvedValue(video);

        await expect(useCase.execute(input)).rejects.toThrowError('Action not permied');
    });

    it('should not update status if it is a download', async () => {
        const input: PreSignUrlInput = { id: 'video-123', userId: 'user-1', type: GenerateUrlType.DOWNLOAD };
        const video: Video = { id: 'video-123', name: 'test', userId: 'user-1', status: VideoStatus.DOWNLOAD_AVAILABLE };
        const expectedUrl: GenerateUrlOutput = { url: 'https://example.com/presigned-url' };

        videoRepositoryMock.findById.mockResolvedValue(video);
        storageServiceMock.generateUrl.mockResolvedValue(expectedUrl);

        await useCase.execute(input);

        expect(changeVideoStatusServiceMock.send).not.toHaveBeenCalled();
    });
});