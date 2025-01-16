
export type SplitVideoInput = {
    outputDir: string
    filePath: string
}

export type SplitVideoOutput = {
    outputDir: string
    filenames: Array<string>
}

export default interface SplitVideoFramesService {
    split(input: SplitVideoInput): Promise<SplitVideoOutput>
}