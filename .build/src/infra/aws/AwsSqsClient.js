"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_sqs_1 = require("@aws-sdk/client-sqs");
const inversify_1 = require("inversify");
let AwsSqsClient = class AwsSqsClient extends client_sqs_1.SQSClient {
    constructor() {
        super({ region: process.env.AWS_REGION || 'us-east-1' });
    }
};
AwsSqsClient = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], AwsSqsClient);
exports.default = AwsSqsClient;
