# Docker Express Postgres RESTful API

A Simple Trade REST API using typescript/node/express/postgres/express-validator/docker/docker-compose

## Requirements

1. Node.js
2. Docker
3. Docker compose

## Start the Containers

run the following command:

npm run docker:up

or

docker-compose up --build

## Stop the Containers

run the following command:

npm run docker:down

or

docker-compose down -v

## url

    http://localhost:8000/

## API Request

| Endpoint          | HTTP Method |     Description     |
| ----------------- | :---------: | :-----------------: |
| `/api/trades`     |    `GET`    |  `Get All Trades`   |
| `/api/trades/:id` |    `GET`    | `Get Single Trade`  |
| `/api/trades`     |   `POST`    | `Post a new Trade`  |
| `/api/trades/:id` |    `PUT`    |  `Update a Trade`   |
| `/api/trades/:id` |  `DELETE`   |  `Delete a Trade`   |
| `/api/query `     |   `POST`    | `Get Trade Summary` |
| `/api/users`      |    `GET`    |   `Get All Users`   |
| `/api/users`      |   `POST`    |    `Post a User`    |

## Sample API Request JSON Body

## POST a Trade

{

    "ticker": "HELO",
    "amount": 200.10,
    "price": 155.99,
    "executionType": "sell",
    "executionDate": "2023-01-31 00:00:00",
    "userId": 1

}

## Update a Trade - Need to check if the User ID of the user who created the trade is passed in the request body
## Trades that have executionDate in the past cannot be updated 

{

    "ticker": "ABCD",
    "amount": 400.99,
    "price": 190.65,
    "executionType": "buy",
    "executionDate": "2022-01-31 00:00:00",
    "userId": 1

}

## Delete a Trade - Need to check if the User ID of the user who created the trade is passed in the request body
## Trades that have executionDate in the past cannot be deleted

{

    "userId": 2

}

## /api/query End Point - POST Request - Get Trade Summary with optional Parameters in the Request Body

{

    "userId": 1,
    "executionType": "sell",
    "executionStartDate" : "2022-09-06 00:00:00",
    "executionEndDate" : "2023-12-31 00:00:00"

}

## Post a User

{

    "name": "Alexander John"

}
