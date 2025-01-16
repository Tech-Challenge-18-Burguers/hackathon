export default function parseRecordBody(messageBody: any) {
    const body = JSON.parse(messageBody)
    if(typeof body === 'object') {
        return body
    } else {
        return parseRecordBody(body)
    }
}