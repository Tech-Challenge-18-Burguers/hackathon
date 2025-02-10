import * as fs from 'fs';
import * as path from 'path';

import { Configuration } from "../../../infra/configuration"
import DownloadFileService from "../../../core/service/DownloadFileService";
import {VideoStatus} from "../../../core/entity/Video";
import ChangeVideoStatusQueueService from "../../../core/service/ChangeVideoStatusQueueService";
import UploadFileService from "../../../core/service/UploadFileService";
import ListFilesByPrefixService from "../../../core/service/ListFilesByPrefixService";
import CompressService from "../../../core/service/CompressService";
import Logger from "../../../infra/logger/Logger";
import CompressFilesUseCase, {CompressFilesInput} from "../../../core/usecase/CompressFilesUseCase";

jest.mock('fs');

describe('CompressFilesUseCase', () => {
    let useCase: CompressFilesUseCase;
    let loggerMock: jest.Mocked<Logger>;
    let compressServiceMock: jest.Mocked<CompressService>;
    let downloadServiceMock: jest.Mocked<DownloadFileService>;
    let uploadServiceMock: jest.Mocked<UploadFileService>;
    let listFilesByPrefixServiceMock: jest.Mocked<ListFilesByPrefixService>;
    let changeVideoStatusServiceMock: jest.Mocked<ChangeVideoStatusQueueService>;
    let configurationMock: jest.Mocked<Configuration>;

    beforeEach(() => {
        loggerMock = { debug: jest.fn(), info: jest.fn() } as any;
        compressServiceMock = { compress: jest.fn() } as any;
        downloadServiceMock = { download: jest.fn() } as any;
        uploadServiceMock = { upload: jest.fn() } as any;
        listFilesByPrefixServiceMock = { list: jest.fn() } as any;
        changeVideoStatusServiceMock = { send: jest.fn() } as any;
        configurationMock = { TMP_DIR: '/tmp', DATA_BUCKET_NAME: 'test-bucket' } as any;

        useCase = new CompressFilesUseCase(
            loggerMock,
            compressServiceMock,
            downloadServiceMock,
            uploadServiceMock,
            listFilesByPrefixServiceMock,
            changeVideoStatusServiceMock,
            configurationMock
        );
    });

    it('should perform the compression and upload process correctly', async () => {
        const input: CompressFilesInput = { id: 'video-123', bucket: 'test-bucket' };
        const workdir = path.join(configurationMock.TMP_DIR, 'video-123-frames');
        const zipFilePath = path.join(configurationMock.TMP_DIR, 'video-123.zip');

        (fs.existsSync as jest.Mock).mockReturnValue(false);
        (fs.mkdirSync as jest.Mock).mockImplementation(() => {});

        listFilesByPrefixServiceMock.list.mockResolvedValue({
            bucket: 'test-bucket',
            keys: ['video-123/frames/frame1.jpg', 'video-123/frames/frame2.jpg']
        });

        downloadServiceMock.download.mockResolvedValue({
            baseDir: workdir,
            filename: 'frame1.jpg',
            path: path.join(workdir, 'video.mp4')
        });
        compressServiceMock.compress.mockResolvedValue({ filename: zipFilePath });
        uploadServiceMock.upload.mockResolvedValue({
            bucket: 'test-bucket',
            key: 'video-123/frames/frame1.jpg',
            status: VideoStatus.UPLOAD_COMPLETED
        });

        await useCase.execute(input);

        expect(changeVideoStatusServiceMock.send).toHaveBeenCalledTimes(2);
        expect(changeVideoStatusServiceMock.send).toHaveBeenNthCalledWith(1, { id: input.id, status: VideoStatus.COMPRESSING });
        expect(changeVideoStatusServiceMock.send).toHaveBeenNthCalledWith(2, { id: input.id, status: VideoStatus.DOWNLOAD_AVAILABLE });

        expect(fs.existsSync).toHaveBeenCalledWith(workdir);
        expect(fs.mkdirSync).toHaveBeenCalledWith(workdir);

        expect(listFilesByPrefixServiceMock.list).toHaveBeenCalledWith({ bucket: configurationMock.DATA_BUCKET_NAME, prefix: `${input.id}/frames` });

        expect(downloadServiceMock.download).toHaveBeenCalledTimes(2);
        expect(downloadServiceMock.download).toHaveBeenCalledWith({
            bucket: input.bucket,
            key: `${input.id}/frames/frame1.jpg`,
            filename: 'frame1.jpg',
            outputDir: workdir,
        });

        expect(compressServiceMock.compress).toHaveBeenCalledWith({ baseDir: workdir, outputFile: zipFilePath });

        expect(uploadServiceMock.upload).toHaveBeenCalledWith({
            bucket: input.bucket,
            key: `${input.id}/frames.zip`,
            filePath: zipFilePath
        });
    });

    it('should throw error if fails to fetch files', async () => {
        const input: CompressFilesInput = { id: 'video-123', bucket: 'test-bucket' };

        listFilesByPrefixServiceMock.list.mockRejectedValue(new Error('Erro ao listar arquivos'));

        await expect(useCase.execute(input)).rejects.toThrow('Erro ao listar arquivos');

        expect(changeVideoStatusServiceMock.send).toHaveBeenCalledWith({
            id: input.id,
            status: VideoStatus.COMPRESSING
        });
    });

    it('should throw an error if the download fails', async () => {
        const input: CompressFilesInput = { id: 'video-123', bucket: 'test-bucket' };

        listFilesByPrefixServiceMock.list.mockResolvedValue({
            bucket: 'test-bucket',
            keys: ['video-123/frames/frame1.jpg']
        });

        downloadServiceMock.download.mockRejectedValue(new Error('Erro no download'));

        await expect(useCase.execute(input)).rejects.toThrow('Erro no download');
    });

    it('should throw error if compression fails', async () => {
        const input: CompressFilesInput = { id: 'video-123', bucket: 'test-bucket' };

        listFilesByPrefixServiceMock.list.mockResolvedValue({
            bucket: 'test-bucket',
            keys: ['video-123/frames/frame1.jpg']
        });

        compressServiceMock.compress.mockRejectedValue(new Error('Erro na compressão'));

        await expect(useCase.execute(input)).rejects.toThrow('Erro na compressão');
    });

    it('should throw error if upload fails', async () => {
        const input: CompressFilesInput = { id: 'video-123', bucket: 'test-bucket' };

        listFilesByPrefixServiceMock.list.mockResolvedValue({
            bucket: 'test-bucket',
            keys: ['video-123/frames/frame1.jpg']
        });

        compressServiceMock.compress.mockResolvedValue({ filename: '/tmp/video-123.zip' });
        uploadServiceMock.upload.mockRejectedValue(new Error('Erro no upload'));

        await expect(useCase.execute(input)).rejects.toThrow('Erro no upload');
    });
});