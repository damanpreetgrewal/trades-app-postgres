# Docker Express Postgres RESTful API

A Simple Trade REST API using typescript/node/express/postgres/express-validator/docker/docker-compose

## Requirements

1. Node.js >= 16
2. Docker
3. Docker compose

## Getting started

run the following command:

npm run docker:up  

or

docker-compose up --build


## Stop the Containers

run the following command:

npm run docker:down 

or

docker-compose down -v

## API Request

| Endpoint                 | HTTP Method |     Description     |
| ------------------------ | :---------: | :-----------------: |
| `/api/trades`            |    `GET`    |  `Get All Trades`   |
| `/api/trades`            |   `POST`    |  `Post a new Trade` |
| `/api/trades/:id`        |   `PUT`     | `Update a Trade`    |
| `/api/trades/:id`        |   `DELETE`  | `Delete a Trade`    |
| `/api/query     `        |   `POST`    | `Get Trade Summary` |
