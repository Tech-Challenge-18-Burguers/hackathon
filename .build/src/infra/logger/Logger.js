"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@aws-lambda-powertools/logger");
class Logger extends logger_1.Logger {
    constructor() {
        const configuredLogLevel = process.env.LOG_LEVEL || 'DEBUG';
        const logLevel = Object.keys(logger_1.LogLevel).includes(configuredLogLevel || '') ? configuredLogLevel : 'INFO';
        super({ serviceName: 'hackaton-service', logLevel });
    }
}
exports.default = Logger;
