import { faker } from '@faker-js/faker'

import { configuration } from "../../../infra/configuration"
import Logger from "../../../infra/logger/Logger"
import VideoRepositoryDynamoDB from '../../../application/repository/VideoRepositoryDynamoDB'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import GetVideoByIdUseCase from '../../../core/usecase/GetVideoByIdUseCase'

describe('GetVideoByIdUseCase', () => {

    beforeAll(() => {
        jest.clearAllMocks()
    })

    it('should return video', () => {
        const logger = new Logger()
        const client: DynamoDBClient = jest.mocked(new DynamoDBClient())
        const repository = jest.mocked(new VideoRepositoryDynamoDB(logger, client, configuration))
    
        var userIdMock = faker.string.uuid()
        var idVideoMock = faker.string.uuid()

        repository.findAllByUserId = jest.fn().mockResolvedValue({ 
            userId: userIdMock,
            id: idVideoMock,
            name: 'teste name video',
            description: 'teste description',
            status: 'DOWNLOAD_AVAILABLE'
        })

        const usecase = new GetVideoByIdUseCase(repository, logger)
        usecase.execute({ userId: userIdMock, id: idVideoMock }).then(
            response => {
                expect(response.id).toBe(idVideoMock)
            }
        )
    })
})