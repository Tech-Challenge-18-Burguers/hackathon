import Video from "../entity/Video";

export default interface VideoRepository {
 
    save(video: Video): Promise<Video>

    update(video: Video): Promise<Video>

    findById(id: string): Promise<Video>

    findAllByUserId(userId: string): Promise<Array<Video>>
}