import {VideoStatus} from "../../../core/entity/Video";
import TriggerQueueService from "../../../core/service/TriggerQueueService";
import ChangeVideoStatusQueueService from "../../../core/service/ChangeVideoStatusQueueService";
import Logger from "../../../infra/logger/Logger";
import TriggerVideoToProcessUseCase, {TriggerVideoInput} from "../../../core/usecase/TriggerVideoToProcessUseCase";

describe('TriggerVideoToProcessUseCase', () => {
    let useCase: TriggerVideoToProcessUseCase;
    let loggerMock: jest.Mocked<Logger>;
    let queueServiceMock: jest.Mocked<TriggerQueueService>;
    let changeVideoStatusServiceMock: jest.Mocked<ChangeVideoStatusQueueService>;

    beforeEach(() => {
        loggerMock = { info: jest.fn() } as any;
        queueServiceMock = { send: jest.fn() } as any;
        changeVideoStatusServiceMock = { send: jest.fn() } as any;

        useCase = new TriggerVideoToProcessUseCase(
            loggerMock,
            queueServiceMock,
            changeVideoStatusServiceMock
        );
    });

    it('should update status and send to the queue', async () => {
        const input: TriggerVideoInput = { bucket: 'test-bucket', key: 'video-123/video.mp4' };

        await useCase.execute(input);

        expect(changeVideoStatusServiceMock.send).toHaveBeenCalledWith({
            id: 'video-123',
            status: VideoStatus.UPLOAD_COMPLETED
        });

        expect(queueServiceMock.send).toHaveBeenCalledWith({
            bucket: input.bucket,
            key: input.key,
            id: 'video-123'
        });

    });

    it('should correctly extract the video ID', () => {
        const result = (useCase as any).extractId('video-456/path/to/video.mp4');
        expect(result).toBe('video-456');
    });

    it('should throw error if fails to update status', async () => {
        const input: TriggerVideoInput = { bucket: 'test-bucket', key: 'video-123/video.mp4' };

        changeVideoStatusServiceMock.send.mockRejectedValue(new Error('Erro ao atualizar status'));

        await expect(useCase.execute(input)).rejects.toThrow('Erro ao atualizar status');
    });

    it('should throw error if fails to send to queue', async () => {
        const input: TriggerVideoInput = { bucket: 'test-bucket', key: 'video-123/video.mp4' };

        queueServiceMock.send.mockRejectedValue(new Error('Erro ao enviar para fila'));

        await expect(useCase.execute(input)).rejects.toThrow('Erro ao enviar para fila');
    });
});
