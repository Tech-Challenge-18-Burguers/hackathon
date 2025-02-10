import Logger from "../../infra/logger/Logger";
import Video from "../entity/Video";
import VideoRepository from "../repository/VideoRepository";

export type GetVideoByIdInput = {
    id: string
    userId: string
}

export default class GetVideoByIdUseCase {
    constructor(
        private readonly repository: VideoRepository,
        private readonly logger: Logger
    ) {}

    async execute(input: GetVideoByIdInput): Promise<Video> {
        this.logger.info(`Find video by Id`, { input })
        const video = await this.repository.findById(input.id)
        if(video.userId !== input.userId) {
            throw new Error('NotAuthorized')
        }
        return video
    }
}