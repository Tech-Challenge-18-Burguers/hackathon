
export interface Configuration {
    TMP_DIR: string
    PROCESS_VIDEO_QUEUE_NAME: string
    COMPRESS_VIDEO_QUEUE_NAME: string
    DATA_BUCKET_NAME: string
    STATUS_QUEUE_NAME: string
}

export const configuration: Configuration = {
    TMP_DIR: process.env.TMP_DIR || '/tmp',
    PROCESS_VIDEO_QUEUE_NAME: process.env.PROCESS_VIDEO_QUEUE_NAME || 'process-video-queue',
    COMPRESS_VIDEO_QUEUE_NAME: process.env.COMPRESS_VIDEO_QUEUE_NAME || 'compress-video-queue',
    STATUS_QUEUE_NAME: process.env.STATUS_QUEUE_NAME || 'status-video-queue',
    DATA_BUCKET_NAME: process.env.DATA_BUCKET_NAME || '674940554881-video-process-222',
}