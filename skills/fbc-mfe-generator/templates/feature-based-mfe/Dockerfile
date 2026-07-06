FROM node:17-alpine3.15 AS appbuild
WORKDIR /usr/src/app
ARG FAL_NPM_TOKEN
ENV FAL_NPM_TOKEN=$FAL_NPM_TOKEN
COPY package.json .npmrc .babelrc ./
RUN yarn --network-timeout 300000
COPY ./src ./src
COPY webpack.config.js ./webpack.config.js
RUN yarn build:dev

FROM node:17-alpine3.15
WORKDIR /usr/src/app
ARG FAL_NPM_TOKEN
ENV FAL_NPM_TOKEN=$FAL_NPM_TOKEN
COPY package.json .npmrc .babelrc ./
RUN yarn --network-timeout 300000
COPY --from=appbuild /usr/src/app/dist ./dist
CMD yarn serve
