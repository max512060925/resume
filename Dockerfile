FROM keymetrics/pm2
FROM node:18

WORKDIR /app
COPY . .
RUN pnpm i && pnpm build 

# 暴露端口
EXPOSE 8181

CMD ["pm2-runtime", "ecosystem.config.js"]