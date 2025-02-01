import { faker } from '@faker-js/faker'

import { configuration } from "../../../infra/configuration"
import Logger from "../../../infra/logger/Logger"
import UpdateVideoUseCase from '../../../core/usecase/UpdateVideoUseCase'
import VideoRepositoryDynamoDB from '../../../application/repository/VideoRepositoryDynamoDB'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { VideoStatus } from '../../../core/entity/Video'

describe('UpdateVideoUseCase', () => {

    beforeAll(() => {
        jest.clearAllMocks()
    })

    it('should be update video', () => {
        const logger = new Logger()
        const client: DynamoDBClient = jest.mocked(new DynamoDBClient())
        const repository = jest.mocked(new VideoRepositoryDynamoDB(logger, client, configuration))

        var mockVideoUpdate = { 
            id: faker.string.uuid(),
            name: "teste nome upload",
            description: "teste upload",
            status: 'UPLOAD_COMPLETED',
            userId: faker.string.uuid(), 
        }
    
        repository.update = jest.fn().mockResolvedValue(mockVideoUpdate)



        const usecase = new UpdateVideoUseCase(logger, repository)
        usecase.execute({ id: faker.string.uuid() , userId: faker.string.uuid() , status:VideoStatus.UPLOAD_COMPLETED }).then(
            response => {
                expect(response.id).toBe(mockVideoUpdate.id)
            }
        )
    })
})