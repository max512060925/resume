FROM node:18
FROM keymetrics/pm2

RUN pnpm install --registry=https://registry.npm.taobao.org/
RUN pnpm run build

WORKDIR /app
COPY ./.output ./.output

# 暴露端口
EXPOSE 8181

CMD ["pm2-runtime", "ecosystem.config.js"]