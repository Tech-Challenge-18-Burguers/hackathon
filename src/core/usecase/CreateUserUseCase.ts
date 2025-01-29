import Logger from "../../infra/logger/Logger";
import IdentityService from "../service/IdentityService";

export type CreateUserInput = {
    name: string
    username: string
    password: string
}

export type CreateUserOutput = {
    userId: string
}

export default class CreateUserUseCase {
    constructor(
        private readonly identityService: IdentityService,
        private readonly logger: Logger
    ) {}

    async execute(input: CreateUserInput): Promise<CreateUserOutput> {
        this.logger.debug(`Create user: ${input.username}`)

        const response = await this.identityService.createUser(input)
        this.logger.info(`Create user with username: ${input.username}`)
        
        await this.identityService.setPermanentPassword({ username: response.userId, password: input.password })
        this.logger.info(`Set permanent password to user: ${response.userId}`)
        
        return response
    }
}