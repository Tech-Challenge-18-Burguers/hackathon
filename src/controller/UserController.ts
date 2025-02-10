import { inject, injectable } from "inversify";
import IdentityService from "../core/service/IdentityService";
import AuthenticateUseCase, { AuthenticateInput } from "../core/usecase/AuthenticateUserCase";
import CreateUserUseCase, { CreateUserInput } from "../core/usecase/CreateUserUseCase";
import Logger from "../infra/logger/Logger";
import { TYPES } from "../types";

@injectable()
export default class UserController {
    
    constructor(
        @inject(TYPES.IdentityService) private readonly identityService: IdentityService,
        @inject(TYPES.Logger) private readonly logger: Logger
    ) {}

    async createUser(input: CreateUserInput) {
        const usecase = new CreateUserUseCase(this.identityService, this.logger)
        return usecase.execute(input)
    }

    async authenticate(input: AuthenticateInput) {
        const usecase = new AuthenticateUseCase(this.identityService, this.logger)
        return usecase.execute(input)
    }
}