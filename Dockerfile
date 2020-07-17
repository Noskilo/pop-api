FROM node:12.14-alpine3.9

RUN mkdir -p /pop-api
WORKDIR /pop-api

COPY ./package.json /pop-api
RUN npm install --production

COPY ./dist /pop-api/dist

CMD ["npm", "start"]