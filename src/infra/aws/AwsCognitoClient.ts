import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { injectable } from "inversify";

@injectable()
export default class AwsCognitoClient extends CognitoIdentityProviderClient {
    constructor() {
        super({ region: process.env.AWS_REGION || 'us-east-1' })
    }
}