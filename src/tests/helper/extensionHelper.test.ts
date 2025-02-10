import { getExtension, removeExtension } from "../../helper/extensionHelper"

describe('extensionHelper', () => {
    it('should be get extension from filename', () => {
        const extension = getExtension("folder/file.mp4")
        expect(extension).toBe('.mp4')
    })

    it('should be remove extension from filename', () => {
        const filename = removeExtension("file.mp4")
        expect(filename).toBe('file')
    })
})