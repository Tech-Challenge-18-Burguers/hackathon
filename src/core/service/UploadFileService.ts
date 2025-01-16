export type UploadFileInput = {
    filePath: string
    bucket: string
    key: string
}

export type UploadFileOutput = {
    bucket: string
    key: string,
    status: string
}

export default interface UploadFileService {
    upload(input: UploadFileInput): Promise<UploadFileOutput>
}