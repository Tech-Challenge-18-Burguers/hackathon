import IdentityServiceImpl from "../../../application/service/IndentityServiceImpl"
import IdentityService from "../../../core/service/IdentityService"
import AuthenticateUseCase from "../../../core/usecase/AuthenticateUserCase"
import AwsCognitoClient from "../../../infra/aws/AwsCognitoClient"
import { configuration } from "../../../infra/configuration"
import Logger from "../../../infra/logger/Logger"

describe('AuthenticateUserCase', () => {

    beforeAll(() => {
        jest.clearAllMocks()
    })

    it('should be authenticate user', () => {
        const logger = new Logger()
        const client: AwsCognitoClient = jest.mocked(new AwsCognitoClient())
        const service = jest.mocked(new IdentityServiceImpl(client, logger, configuration))
    
        service.authenticate = jest.fn().mockResolvedValue({ token: 'eytlhsot', type: 'Bearer', expireIn: 3900 })

        const usecase = new AuthenticateUseCase(service, logger)
        const response = usecase.execute({ username: 'user@test.com', password: '123456' })
        expect(response).resolves.not.toBeNull()
    })
})