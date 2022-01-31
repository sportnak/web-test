# base image
FROM node:erbium-alpine

WORKDIR /app

COPY ./frontend /app

RUN yarn add global @vue/cli
RUN yarn
RUN yarn build


EXPOSE 8080

CMD ["yarn", "serve"]
