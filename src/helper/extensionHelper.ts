export function removeExtension(filename: string) {
    return filename.substring(0, filename.lastIndexOf('.') - 1)
}

export function getExtension(filename: string) {
    return filename.substring(filename.lastIndexOf('.'), filename.length)
}