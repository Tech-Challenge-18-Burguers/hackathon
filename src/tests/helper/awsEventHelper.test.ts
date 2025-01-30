import parseRecordBody from "../../helper/awsEventHelper"

describe('awsEventHelper', () => {
    
    it('should be convert', () => {
        const payload = "{ \"name\": \"value\" }"
        const response = parseRecordBody(payload)
        expect(response).not.toBeNull()
    })
})