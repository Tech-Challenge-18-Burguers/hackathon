const fs = require('fs')
const path = require('path')
const sqsEvent = require('./aws/sqs.json')
const modelProcess = require('./model/process.json')
const modelCompress = require('./model/compress.json')

function setBody(event, body) {
    event.Records[0].body = JSON.stringify(body)
    return JSON.stringify(event)
}

fs.writeFileSync(path.join(__dirname, 'process.json'), setBody(sqsEvent, modelProcess))
fs.writeFileSync(path.join(__dirname, 'compress.json'), setBody(sqsEvent, modelCompress))