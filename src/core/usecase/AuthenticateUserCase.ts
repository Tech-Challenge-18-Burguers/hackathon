import Logger from "../../infra/logger/Logger";
import IdentityService from "../service/IdentityService";

export type AuthenticateInput = {
    username: string
    password: string
}

export type AuthenticateOutput = {
    token: string
    type: string
    expireIn?: number
}

export default class AuthenticateUseCase {
    
    constructor(
        private readonly identityService: IdentityService,
        private readonly logger: Logger
    ) {}

    async execute(input: AuthenticateInput): Promise<AuthenticateOutput> {
        this.logger.debug(`Authenticate start`)
        return this.identityService.authenticate(input)
    } 
}