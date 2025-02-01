import * as fs from 'fs';
import * as path from 'path';

import {VideoStatus} from "../../../core/entity/Video";
import Logger from "../../../infra/logger/Logger";
import {Configuration} from "../../../infra/configuration";
import ChangeVideoStatusQueueService from "../../../core/service/ChangeVideoStatusQueueService";
import CompressQueueService from "../../../core/service/CompressQueueService";
import SplitVideoFramesService from "../../../core/service/SplitVideoFramesService";
import UploadFileService from "../../../core/service/UploadFileService";
import DownloadFileService from "../../../core/service/DownloadFileService";
import SplitVideoToFramesUseCase, {SplitVideoToFramesInput, SplitVideoToFramesOutput} from "../../../core/usecase/SplitVideoToFramesUseCase";


jest.mock('fs');

describe('SplitVideoToFramesUseCase', () => {
    let useCase: SplitVideoToFramesUseCase;
    let downloadFileServiceMock: jest.Mocked<DownloadFileService>;
    let uploadFileServiceMock: jest.Mocked<UploadFileService>;
    let splitVideoServiceMock: jest.Mocked<SplitVideoFramesService>;
    let compressQueueServiceMock: jest.Mocked<CompressQueueService>;
    let changeVideoStatusServiceMock: jest.Mocked<ChangeVideoStatusQueueService>;
    let configurationMock: jest.Mocked<Configuration>;
    let loggerMock: jest.Mocked<Logger>;

    beforeEach(() => {
        downloadFileServiceMock = { download: jest.fn() } as any;
        uploadFileServiceMock = { upload: jest.fn() } as any;
        splitVideoServiceMock = { split: jest.fn() } as any;
        compressQueueServiceMock = { send: jest.fn() } as any;
        changeVideoStatusServiceMock = { send: jest.fn() } as any;
        configurationMock = { TMP_DIR: '/tmp' } as any;
        loggerMock = { debug: jest.fn(), info: jest.fn() } as any;

        useCase = new SplitVideoToFramesUseCase(
            downloadFileServiceMock,
            uploadFileServiceMock,
            splitVideoServiceMock,
            compressQueueServiceMock,
            changeVideoStatusServiceMock,
            configurationMock,
            loggerMock
        );
    });

    it('should process a video and divide into frames correctly', async () => {
        const input: SplitVideoToFramesInput = { id: 'video-123', bucket: 'test-bucket', key: 'videos/video.mp4' };
        const workdir = path.join(configurationMock.TMP_DIR, 'video-123');
        const framesWorkdir = path.join(workdir, 'frames');

        (fs.existsSync as jest.Mock).mockReturnValue(false);
        (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

        downloadFileServiceMock.download.mockResolvedValue({
            baseDir: workdir,
            filename: 'frame1.jpg',
            path: path.join(workdir, 'video.mp4')
        });
        splitVideoServiceMock.split.mockResolvedValue({
            filenames: ['frame1.jpg', 'frame2.jpg'],
            outputDir: framesWorkdir
        });

        uploadFileServiceMock.upload.mockResolvedValueOnce({
            bucket: input.bucket,
            key: 'video-123/frames/frame1.jpg',
            status: VideoStatus.UPLOAD_COMPLETED
        });
        uploadFileServiceMock.upload.mockResolvedValueOnce({
            bucket: input.bucket,
            key: 'video-123/frames/frame2.jpg',
            status: VideoStatus.UPLOAD_COMPLETED
        });

        const result: SplitVideoToFramesOutput = await useCase.execute(input);

        expect(fs.existsSync).toHaveBeenCalledWith(workdir);
        expect(fs.mkdirSync).toHaveBeenCalledWith(workdir);
        expect(changeVideoStatusServiceMock.send).toHaveBeenCalledWith({
            id: input.id,
            status: VideoStatus.PROCESSING,
        });
        expect(downloadFileServiceMock.download).toHaveBeenCalledWith({
            bucket: input.bucket,
            key: input.key,
            filename: 'video.mp4',
            outputDir: workdir,
        });
        expect(splitVideoServiceMock.split).toHaveBeenCalledWith({
            filePath: path.join(workdir, 'video.mp4'),
            outputDir: framesWorkdir,
        });
        expect(uploadFileServiceMock.upload).toHaveBeenCalledTimes(2);
        expect(compressQueueServiceMock.send).toHaveBeenCalledWith({ bucket: input.bucket, id: input.id });

        expect(result).toEqual({
            filenames: ['frame1.jpg', 'frame2.jpg'],
            keyPrefix: 'video-123/frames/',
            keys: ['video-123/frames/frame1.jpg', 'video-123/frames/frame2.jpg'],
        });
    });

    it('should create working directory if it doesnt exist', async () => {
        const input: SplitVideoToFramesInput = { id: 'video-123', bucket: 'test-bucket', key: 'videos/video.mp4' };
        const workdir = path.join(configurationMock.TMP_DIR, 'video-123');

        (fs.existsSync as jest.Mock).mockReturnValue(false);
        (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

        downloadFileServiceMock.download.mockResolvedValue({
            baseDir: workdir,
            filename: 'frame1.jpg',
            path: path.join(configurationMock.TMP_DIR, 'video-123')
        });
        splitVideoServiceMock.split.mockResolvedValue({ filenames: [], outputDir: '' });

        await useCase.execute(input);

        expect(fs.existsSync).toHaveBeenCalledWith(workdir);
        expect(fs.mkdirSync).toHaveBeenCalledWith(workdir);
    });

    it('should not recreate the directory if it already exists', async () => {
        const input: SplitVideoToFramesInput = { id: 'video-123', bucket: 'test-bucket', key: 'videos/video.mp4' };
        const workdir = path.join(configurationMock.TMP_DIR, 'video-123');

        (fs.existsSync as jest.Mock).mockReturnValue(true);

        downloadFileServiceMock.download.mockResolvedValue({
            baseDir: workdir,
            filename: 'frame1.jpg',
            path: path.join(configurationMock.TMP_DIR, 'teste')
        });
        splitVideoServiceMock.split.mockResolvedValue({ filenames: [], outputDir: '' });

        await useCase.execute(input);

        expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    it('should throw error if download fails', async () => {
        const input: SplitVideoToFramesInput = { id: 'video-123', bucket: 'test-bucket', key: 'videos/video.mp4' };

        downloadFileServiceMock.download.mockRejectedValue(new Error('Erro no download'));

        await expect(useCase.execute(input)).rejects.toThrow('Erro no download');
    });

    it('should throw error if split fails', async () => {
        const input: SplitVideoToFramesInput = { id: 'video-123', bucket: 'test-bucket', key: 'videos/video.mp4' };
        const workdir = path.join(configurationMock.TMP_DIR, 'video-123');

        downloadFileServiceMock.download.mockResolvedValue({
            baseDir: workdir,
            filename: 'frame1.jpg',
            path: path.join(configurationMock.TMP_DIR, 'video-123')
        });
        splitVideoServiceMock.split.mockRejectedValue(new Error('Erro no split'));

        await expect(useCase.execute(input)).rejects.toThrow('Erro no split');
    });

});