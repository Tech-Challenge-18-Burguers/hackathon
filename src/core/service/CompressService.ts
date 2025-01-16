export type CompressOutput = {
    filename: string
}

export type CompressInput = {
    baseDir: string
    outputFile: string
} 

export default interface CompressService {
    compress(input: CompressInput): Promise<CompressOutput>
}