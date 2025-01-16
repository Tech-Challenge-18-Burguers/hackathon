
export type ListFilesByPrefixInput = {
    prefix: string
    bucket: string
}

export type ListFilesByPrefixOutput = {
    bucket: string
    keys: Array<string>
}

export default interface ListFilesByPrefixService {
    list(input: ListFilesByPrefixInput): Promise<ListFilesByPrefixOutput>
}