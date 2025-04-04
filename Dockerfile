FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY wait-db.sh ./

RUN npm ci

ENV NODE_ENV production
COPY . .

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["sh", "./wait-db.sh"]
