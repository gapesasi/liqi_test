# Sistema de Processamento de Transações Financeiras

Este projeto é um sistema de processamento de transações financeiras desenvolvido para o desafio técnico da vaga de Desenvolvedor Backend Pleno. O sistema foi implementado utilizando Node.js com TypeScript, seguindo princípios de arquitetura orientada a eventos, e demonstrando habilidades com AWS (ou simulação local), filas e bancos de dados NoSQL.

## Visão Geral do Desafio

O objetivo é criar um sistema que:

- Exponha uma API REST para receber e consultar transações financeiras.
- Utilize processamento assíncrono com filas (AWS SQS).
- Armazene transações em um banco de dados NoSQL (DynamoDB).
- Aplique práticas de código limpo, SOLID e tratamento adequado de erros.

## Tecnologias Utilizadas

- **Backend:** Node.js com TypeScript
- **Framework:** Express
- **Fila:** AWS SQS (utilizando Localstack)
- **Banco de Dados:** DynamoDB
- **ORM:** Dyamoose
- **Documentação da API:** Swagger/OpenAPI
- **Containerização:** Docker

## Como Executar o Projeto

### Pré-requisitos

- Docker

### Instalação

1. Clone o repositório:

    ```shell
    git clone https://github.com/gapesasi/liqi_test.git
    cd liqi_test
    ```

2. Crie o arquivo `.env` baseado no arquivo `.env.example` e configure as variáveis de ambiente necessárias:

    ```dotenv
    AWS_SQS_QUEUE_URL=seu_queue_url
    DYNAMODB_TABLE_NAME=nome_da_tabela
    NODE_ENV=development
    PORT=3000
    ```

3. Inicie os contêineres Docker para simulação local do AWS SQS/DynamoDB e iniciar a aplicação:

    ```shell
    npm run docker
    ```

## Endpoints da API

**Obs.:** Após rodar a API, os endpoints disponíveis serão listados na documentação swagger.
Para acessá-la: `http://localhost:3000/docs`.

### **1. Criar uma conta**

#### POST /account

Adiciona uma nova conta no sistema.

##### Corpo da Requisição (JSON)

```json
{
  "name": "Nome do Usuário",
  "email": "usuario@email.com"
}
```

##### Resposta de Sucesso

```json
{
  "message": "Account Added",
  "statusCode": 200
}
```

---

### **2. Listar contas**

#### GET /account

Retorna todas as contas cadastradas.

##### Resposta de Sucesso

```json
{
  "accounts": [
    { "id": "1", "name": "Nome do Usuário", "email": "usuario@email.com" }
  ]
}
```

---

### **3. Criar uma transação**

#### POST /transaction

Cria uma nova transação financeira e a envia para processamento assíncrono.

##### Corpo da Requisição (JSON)

```json
{
  "value": 100.00,
  "type": "credit",
  "origin": "conta_origem",
  "target": "conta_destino"
}
```

##### Resposta de Sucesso

```json
{
  "message": "Transaction Added",
  "statusCode": 200
}
```

---

### **4. Consultar transação por ID**

#### GET /transaction/{id}

Obtém detalhes de uma transação específica.

##### Resposta de Sucesso

```json
{
  "id": "1234",
  "value": 100.00,
  "type": "credit",
  "origin": "conta_origem",
  "target": "conta_destino",
  "timestamp": "2023-04-01T12:00:00Z",
  "status": "completed"
}
```

---

### **5. Listar transações dentro de um período**

#### GET /transaction

Obtém uma lista de transações dentro de um período especificado.

##### Parâmetros da Query

- `startPeriod` (obrigatório): Data de início no formato `YYYY-MM-DD`.
- `endPeriod` (opcional): Data de fim no formato `YYYY-MM-DD`.

##### Resposta de Sucesso

```json
[
  {
    "id": "1234",
    "value": 100.00,
    "type": "credit",
    "origin": "conta_origem",
    "target": "conta_destino",
    "timestamp": "2023-04-01T12:00:00Z",
    "status": "completed"
  }
]
```

---

### **6. Consultar status de uma transação**

#### GET /transaction/{id}/status

Obtém o status de processamento de uma transação específica.

##### Resposta de Sucesso

```json
{
  "id": "1234",
  "status": "processing"
}
```

## Testes

### Para executar os testes

  ```shell
    npm test
  ```

## Melhorias Futuras

- Implementação de autenticação e autorização.
- Implementar testes unitários e de integração.
- Validações mais robustas para os endpoints.
- Monitoramento e logging para rastreamento de erros.
