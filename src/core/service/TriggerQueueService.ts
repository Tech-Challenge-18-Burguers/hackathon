export type TriggerQueueInput = {
    bucket: string
    key: string
    id: string
}

export default interface TriggerQueueService {
    send(input: TriggerQueueInput): Promise<void>
}