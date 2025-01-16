import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { SQSEvent } from 'aws-lambda'

export const handler = async (event: SQSEvent) => {

    console.log(event)

    const client = new S3Client({ region: 'us-east-1' })

    const command = new GetObjectCommand({ 
        Bucket: 'serverless-framework-deployments-us-east-1-5232e58e-dd98',
        Key: 'teste.json'
    })

    const response = await client.send(command)
    console.log(response.$metadata)
    if(response.$metadata.httpStatusCode != 200) {
        throw new Error('Erro ao tentar ler arquivo')
    }

    const body = await response.Body?.transformToString()

    return {
        statusCode: 200,
        body: body
    }
}