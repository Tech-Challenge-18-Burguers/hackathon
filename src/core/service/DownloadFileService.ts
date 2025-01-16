export type DownloadFileInput = {
    bucket: string
    key: string
    filename: string
    outputDir: string
}

export type DownloadFileOutput = {
    baseDir: string
    filename: string
    path: string
}

export default interface DownloadFileService {
    download(input: DownloadFileInput): Promise<DownloadFileOutput>
}