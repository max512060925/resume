FROM keymetrics/pm2

WORKDIR /app
COPY ./.output ./.output
COPY ./ecosystem.config.js ./ecosystem.config.js

# 暴露端口
EXPOSE 8181

CMD ["pm2-runtime", "ecosystem.config.js"]