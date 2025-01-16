"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
exports.configuration = {
    TMP_DIR: process.env.TMP_DIR || '/tmp',
    PROCESS_VIDEO_QUEUE_NAME: process.env.PROCESS_VIDEO_QUEUE_NAME || 'process-video-queue',
    COMPRESS_VIDEO_QUEUE_NAME: process.env.COMPRESS_VIDEO_QUEUE_NAME || 'compress-video-queue',
    STATUS_QUEUE_NAME: process.env.STATUS_QUEUE_NAME || 'status-video-queue',
    DATA_BUCKET_NAME: process.env.DATA_BUCKET_NAME || '674940554881-video-process-222',
    VIDEO_TABLE: 'videos'
};
