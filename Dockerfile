FROM node:8-alpine

WORKDIR /usr/src/app

RUN apk add yarn

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .
