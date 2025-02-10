# Projeto de Upload de Imagens para S3 a partir de Vídeos

Este projeto utiliza AWS Lambda e outros serviços da AWS para extrair imagens de um vídeo e armazená-las em um bucket S3. Ele utiliza Amazon SQS para gerenciar a fila de processamento e API Gateway para expor uma interface HTTP. Além disso, conta com autenticação utilizando Amazon Cognito.

## Tecnologias Utilizadas

- AWS Lambda
- Amazon S3
- Amazon SQS
- Amazon API Gateway
- Amazon Cognito
- Node.js

## Funcionamento

1. **Autenticação**: O usuário deve se autenticar através do Amazon Cognito antes de fazer o upload do vídeo.
2. **Upload de Vídeo**: Após a autenticação, o usuário envia um vídeo através do endpoint API Gateway.
3. **Processamento do Vídeo**: O vídeo enviado é colocado em uma fila SQS para ser processado por uma função Lambda.
4. **Extração de Imagens**: A função Lambda processa o vídeo, extrai as imagens e as armazena em um bucket S3.
5. **Acompanhamento**: O status do processamento pode ser monitorado por meio de logs do CloudWatch.

## Configuração do Ambiente

### Pré-Requisitos

- Conta na AWS
- AWS CLI instalado
- Node.js e npm instalados

### Passo a Passo

1. **Clone o repositório**:

   ```bash
   git clone https://github.com/Tech-Challenge-18-Burguers/hackathon   
   cd hackaton
