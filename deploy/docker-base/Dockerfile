FROM node:16.14 as base

WORKDIR /app/web

COPY package*.json /app/web/

RUN npm install -g npm \
		&& npm install -g pnpm \
		&& pnpm install

COPY . /app/web/

RUN npm run build