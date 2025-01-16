const fs = require('fs')
const path = require('path')
const sqsEvent = require('./aws/sqs.json')
const apiGatewayProxyEvent = require('./aws/api-gateway-proxy.json')
const modelProcess = require('./model/process.json')
const modelCompress = require('./model/compress.json')
const modelCreate = require('./model/create.json')
const modelUpdate = require('./model/update.json')
const modelPresignUrl = require('./model/presignurl.json')

function setBody(event, body) {
    event.Records[0].body = JSON.stringify(body)
    return JSON.stringify(event)
}

function setBodyProxy(event, body) {
    event.body = JSON.stringify(body)
    return JSON.stringify(event)
}

const workdir = path.join(__dirname, '.data')
if(!fs.existsSync(workdir)) {
    fs.mkdirSync(workdir)
}


fs.writeFileSync(path.join(workdir, 'process.json'), setBody(sqsEvent, modelProcess))
fs.writeFileSync(path.join(workdir, 'compress.json'), setBody(sqsEvent, modelCompress))
fs.writeFileSync(path.join(workdir, 'update.json'), setBody(sqsEvent, modelUpdate))
fs.writeFileSync(path.join(workdir, 'create.json'), setBodyProxy(apiGatewayProxyEvent, modelCreate))
fs.writeFileSync(path.join(workdir, 'presignurl.json'), setBodyProxy(apiGatewayProxyEvent, modelPresignUrl))