import Logger from "../../infra/logger/Logger";
import Video, { VideoInput, VideoStatus } from "../entity/Video";
import VideoRepository from "../repository/VideoRepository";
import { randomUUID } from 'node:crypto'

export default class CreateVideoUseCase {
    constructor(
        private readonly logger: Logger,
        private readonly repository: VideoRepository
    ) {}

    async execute(input: VideoInput): Promise<Video> {
        const video = { ...input, id: randomUUID(), status: VideoStatus.CREATED }
        this.logger.info(`Convert input to entity`, { input, video })
        return this.repository.save(video)
    }
}