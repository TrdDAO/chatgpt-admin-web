FROM node:16.14-alpine

WORKDIR /usr/src/app

COPY package*.json /usr/src/app
COPY .npmrc /usr/src/app

RUN npm install -g pnpm 
RUN pnpm install

# 复制代码
COPY . /usr/src/app/

RUN npm run build

# 暴露内部端口号
EXPOSE 5000

# 起服务
ENTRYPOINT ["npm", "run"]
CMD ["server"]