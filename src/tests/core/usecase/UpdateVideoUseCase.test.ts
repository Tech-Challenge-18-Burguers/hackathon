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

    it('should be create user', () => {
        const logger = new Logger()
        const client: DynamoDBClient = jest.mocked(new DynamoDBClient())
        const repository = jest.mocked(new VideoRepositoryDynamoDB(logger, client, configuration))
    
        repository.update = jest.fn().mockResolvedValue({ 
            id: faker.string.uuid(),
            name: "teste nome upload",
            description: "teste upload",
            status: 'UPLOAD_COMPLETED',
            userId: faker.string.uuid(), 
        })



        const usecase = new UpdateVideoUseCase(logger, repository)
        const response = usecase.execute({ id: faker.string.uuid() , userId: faker.string.uuid() , status:VideoStatus.UPLOAD_COMPLETED })
        expect(response).resolves.not.toBeNull()
    })
})