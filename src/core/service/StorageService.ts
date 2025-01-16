import { GenerateUrlInput, GenerateUrlOutput } from "../entity/Storage"

export default interface StorageInterface {
    generateUrl(input: GenerateUrlInput): Promise<GenerateUrlOutput>
}