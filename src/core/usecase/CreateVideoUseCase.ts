import Logger from "../../infra/logger/Logger";
import Video, { VideoInput, VideoOutput, VideoStatus } from "../entity/Video";
import VideoRepository from "../repository/VideoRepository";
import { randomUUID } from 'node:crypto'

export default class CreateVideoUseCase {
    constructor(
        private readonly logger: Logger,
        private readonly repository: VideoRepository
    ) {}

    async execute(input: VideoInput): Promise<VideoOutput> {
        const video = { ...input, id: randomUUID(), status: VideoStatus.CREATED }
        this.logger.info(`Convert input to entity`, { input, video })
        const response = await this.repository.save(video)
        return {
            id: response.id,
            name: response.name,
            status: response.status,
            description: response.description
        }
    }
}