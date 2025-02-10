export enum VideoStatus {
    CREATED = 'CREATED',
    WAITING_UPLOAD = 'WAITING_UPLOAD',
    UPLOAD_COMPLETED = 'UPLOAD_COMPLETED',
    PROCESSING = 'PROCESSING',
    COMPRESSING = 'COMPRESSING',
    DOWNLOAD_AVAILABLE = 'DOWNLOAD_AVAILABLE'
}

export default interface Video {
    id: string
    name: string
    description?: string
    status: VideoStatus
    userId: string
}

export interface VideoInput {
    name: string
    description?: string
    status: VideoStatus
    userId: string
}

export interface VideoOutput {
    id: string
    name: string
    description?: string
    status: VideoStatus
} 

export interface VideoUpdate {
    id: string
    status: VideoStatus
    userId: string
}