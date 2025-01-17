import { VideoStatus } from "../entity/Video"

export type ChangeVideoStatus = {
    id: string,
    status: VideoStatus
}

export default interface ChangeVideoStatusQueueService {
    send(input: ChangeVideoStatus): Promise<void>
}