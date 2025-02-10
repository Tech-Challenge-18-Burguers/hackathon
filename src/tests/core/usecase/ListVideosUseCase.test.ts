import { faker } from '@faker-js/faker'

import { configuration } from "../../../infra/configuration"
import Logger from "../../../infra/logger/Logger"
import VideoRepositoryDynamoDB from '../../../application/repository/VideoRepositoryDynamoDB'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import ListVideosUseCase from '../../../core/usecase/ListVideosUseCase'

describe('ListVideosUseCase', () => {

    beforeAll(() => {
        jest.clearAllMocks()
    })

    it('should list videos for user', () => {
        const logger = new Logger()
        const client: DynamoDBClient = jest.mocked(new DynamoDBClient())
        const repository = jest.mocked(new VideoRepositoryDynamoDB(logger, client, configuration))
    
        var userIdMock = faker.string.uuid()

        repository.findAllByUserId = jest.fn().mockResolvedValue([{ 
            userId: userIdMock,
            id: faker.string.uuid,
            name: 'teste name video',
            description: 'teste description',
            status: 'DOWNLOAD_AVAILABLE'
        }])

        const usecase = new ListVideosUseCase(repository, logger)
        usecase.execute({ userId: userIdMock }).then(
            response => {
                expect(response[0].userId).toBe(userIdMock)
            }
        )
    })
})