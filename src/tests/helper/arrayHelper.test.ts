import { splitArrayIntoChunks } from "../../helper/arrayHelper"

describe('arrayHelper', () => {
    it('should be split array into chunck', () => {
        const array = [1, 2, 3, 4, 5, 6]
        const response = splitArrayIntoChunks(array, 3)
        expect(response.length).toBe(2)
    })
})