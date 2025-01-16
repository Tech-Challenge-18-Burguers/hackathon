import Logger from "../../infra/logger/Logger";
import Video, { VideoUpdate } from "../entity/Video";
import VideoRepository from "../repository/VideoRepository";

export default class UpdateVideoUseCase {
    constructor(
        private readonly logger: Logger,
        private readonly repository: VideoRepository
    ) {}

    async execute(input: VideoUpdate): Promise<Video> {
        return this.repository.update({
            id: input.id, 
            status: input.status,
            userId: input.userId,
            name: "",
        })
    }
}