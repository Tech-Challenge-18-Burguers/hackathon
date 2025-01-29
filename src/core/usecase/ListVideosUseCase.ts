import Logger from "../../infra/logger/Logger";
import Video from "../entity/Video";
import VideoRepository from "../repository/VideoRepository";

export type ListVideosInput = {
    userId: string
}

export default class ListVideosUseCase {

    constructor(
        private readonly repository: VideoRepository,
        private readonly logger: Logger
    ) {}

    async execute(input: ListVideosInput): Promise<Array<Video>> {
        this.logger.info(`Find videos by userId: ${input.userId}`, { input })
        return this.repository.findAllByUserId(input.userId)
    }
}