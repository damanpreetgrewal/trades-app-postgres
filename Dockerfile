FROM node:18.9.1-alpine

WORKDIR /app

COPY package.json .

RUN npm install

ARG PORT 

COPY . ./

EXPOSE $PORT

CMD ["npm","run","dev"]