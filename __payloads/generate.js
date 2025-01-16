const fs = require('fs')
const path = require('path')
const sqsEvent = require('./aws/sqs.json')
const apiGatewayProxyEvent = require('./aws/api-gateway-proxy.json')
const modelProcess = require('./model/process.json')
const modelCompress = require('./model/compress.json')
const modelCreate = require('./model/create.json')
const modelUpdate = require('./model/update.json')

function setBody(event, body) {
    event.Records[0].body = JSON.stringify(body)
    return JSON.stringify(event)
}

function setBodyProxy(event, body) {
    event.body = JSON.stringify(body)
    return JSON.stringify(event)
}

fs.writeFileSync(path.join(__dirname, 'process.json'), setBody(sqsEvent, modelProcess))
fs.writeFileSync(path.join(__dirname, 'compress.json'), setBody(sqsEvent, modelCompress))
fs.writeFileSync(path.join(__dirname, 'update.json'), setBody(sqsEvent, modelUpdate))
fs.writeFileSync(path.join(__dirname, 'create.json'), setBodyProxy(apiGatewayProxyEvent, modelCreate))