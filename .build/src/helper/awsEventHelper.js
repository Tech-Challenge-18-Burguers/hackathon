"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = parseRecordBody;
function parseRecordBody(messageBody) {
    const body = JSON.parse(messageBody);
    if (typeof body === 'object') {
        return body;
    }
    else {
        return parseRecordBody(body);
    }
}
