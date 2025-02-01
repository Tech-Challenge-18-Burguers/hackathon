import { faker } from '@faker-js/faker'

import { configuration } from "../../../infra/configuration"
import Logger from "../../../infra/logger/Logger"
import VideoRepositoryDynamoDB from '../../../application/repository/VideoRepositoryDynamoDB'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import CreateVideoUseCase from '../../../core/usecase/CreateVideoUseCase'
import { VideoStatus } from '../../../core/entity/Video'

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

        repository.save = jest.fn().mockResolvedValue({ 
            id: idVideoMock,
            name: 'teste name video',
            description: 'teste description',
            status: 'DOWNLOAD_AVAILABLE'
        })

        const usecase = new CreateVideoUseCase(logger, repository)
        usecase.execute({ userId: userIdMock, status: VideoStatus.COMPRESSING, name: 'nome video' }).then(
            response => {
                expect(response.id).toBe(idVideoMock)
            }
        )
    })
})