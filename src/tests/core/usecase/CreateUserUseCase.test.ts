import { faker } from '@faker-js/faker'

import IdentityServiceImpl from "../../../application/service/IndentityServiceImpl"
import AwsCognitoClient from "../../../infra/aws/AwsCognitoClient"
import { configuration } from "../../../infra/configuration"
import Logger from "../../../infra/logger/Logger"
import CreateUserUseCase from '../../../core/usecase/CreateUserUseCase'

describe('CreateUserUseCase', () => {

    beforeAll(() => {
        jest.clearAllMocks()
    })

    it('should be create user', () => {
        const logger = new Logger()
        const client: AwsCognitoClient = jest.mocked(new AwsCognitoClient())
        const service = jest.mocked(new IdentityServiceImpl(client, logger, configuration))
    
        service.authenticate = jest.fn().mockResolvedValue({ 
            userId: faker.string.uuid(), 
        })

        const usecase = new CreateUserUseCase(service, logger)
        const response = usecase.execute({ name: faker.person.fullName(), username: faker.string.uuid() , password: faker.internet.password() })
        expect(response).resolves.not.toBeNull()
    })
})