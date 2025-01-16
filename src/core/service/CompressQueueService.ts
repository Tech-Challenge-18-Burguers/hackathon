export type CompressQueueInput = {
    bucket: string
    id: string
}

export default interface CompressQueueService {
    send(input: CompressQueueInput): Promise<void>
}