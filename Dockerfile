FROM node:18

WORKDIR /app
COPY . .
# 开启pnpm支持
RUN corepack enable
RUN pnpm i
RUN pnpm build 

# 安装pm2
RUN pnpm add pm2
# 暴露端口
EXPOSE 8181

CMD ["pnpm", "pm2-runtime", "ecosystem.config.js"]