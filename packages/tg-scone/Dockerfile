FROM node:16-alpine3.15

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENTRYPOINT [ "node", "/app/dist/app.js"]