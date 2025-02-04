import { AdminCreateUserCommand, AdminSetUserPasswordCommand, CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import IdentityService, { AuthenticationInput, AuthenticationOutput, CreateUserInput, CreateUserOutput, PermanentPasswordInput } from "../../core/service/IdentityService";
import Logger from "../../infra/logger/Logger";
import { Configuration } from "../../infra/configuration";
import { inject, injectable } from "inversify";
import { TYPES } from "../../types";
import { randomUUID } from "node:crypto";

@injectable()
export default class IdentityServiceImpl implements IdentityService {
    
    constructor(
        @inject(TYPES.CognitoClient) private readonly client: CognitoIdentityProviderClient,
        @inject(TYPES.Logger) private readonly logger: Logger,
        @inject(TYPES.Configuration) private readonly configuration: Configuration
    ) {}
    
    async createUser(input: CreateUserInput): Promise<CreateUserOutput> {
        const command = new AdminCreateUserCommand({
            UserPoolId: this.configuration.COGNITO_POOL_ID,
            Username: randomUUID(),
            UserAttributes: [
                { Name: 'name', Value: input.name },
                { Name: 'email', Value: input.username },
                { Name: 'email_verified', Value: 'true' }
            ],
            TemporaryPassword: input.password,
            MessageAction: 'SUPPRESS'
        })

        const response = await this.client.send(command)
        if(response.$metadata.httpStatusCode !== 200) {
            throw new Error('CreateUserFailed')
        }
        this.logger.info(`Response to cognito`, { response })
        if(response.User?.Username) {
            this.logger.debug(`Create user successfully`, { response })
            return { userId: response.User.Username }
        }
        throw new Error('UsernameNotFound')
    }

    async authenticate(input: AuthenticationInput): Promise<AuthenticationOutput> {
        const command = new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH",
            ClientId: this.configuration.COGNITO_CLIENT_ID,
            AuthParameters: {
                USERNAME: input.username,
                PASSWORD: input.password
            }
        })

        const response = await this.client.send(command)
        if(response.$metadata.httpStatusCode !== 200) {
            throw new Error('AuthenticationFailed')
        }

        const token = response.AuthenticationResult?.IdToken
        if(!token) {
            throw new Error('TokenNotFound')
        }

        this.logger.debug(`Authenticate with success`, { response })
        return { token, type: 'Bearer', expireIn: response.AuthenticationResult?.ExpiresIn }
    }

    async setPermanentPassword(input: PermanentPasswordInput): Promise<void> {
        const command = new AdminSetUserPasswordCommand({
            UserPoolId: this.configuration.COGNITO_POOL_ID,
            Username: input.username,
            Password: input.password,
            Permanent: true
        })

        const response = await this.client.send(command)
        if(response.$metadata.httpStatusCode !== 200) {
            throw new Error('SetPasswordFailed')
        }
        this.logger.debug('Password defined successfully', { username: input.username, response })
    }

}