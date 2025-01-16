export enum GenerateUrlType {
    DOWNLOAD = 'DOWNLOAD',
    UPLOAD = 'UPLOAD'
}

export type GenerateUrlInput = {
    bucket: string
    key: string
    duration: number
    type: GenerateUrlType
}

export type GenerateUrlOutput = {
    url: string
}
