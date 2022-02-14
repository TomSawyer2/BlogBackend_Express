FROM keymetrics/pm2:latest-alpine

RUN mkdir -p /home/Service
WORKDIR /home/Service
COPY . /home/Service

RUN npm install

# 暴露端口
EXPOSE 4000

# 运行命令
CMD [ "pm2-docker", "start", "main.js" ]