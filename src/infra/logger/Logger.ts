import { Logger as AwsLogger, LogLevel } from '@aws-lambda-powertools/logger'

export default class Logger extends AwsLogger {

    constructor() {
        const configuredLogLevel = process.env.LOG_LEVEL || 'DEBUG'
        const logLevel: any = Object.keys(LogLevel).includes(configuredLogLevel || '') ? configuredLogLevel : 'INFO'
        super({ serviceName: 'hackaton-service', logLevel })
    }
}