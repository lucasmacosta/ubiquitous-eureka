FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

RUN rm -rf node_modules

RUN npm install --omit=dev

EXPOSE 3000

CMD [ "npm", "start" ]
