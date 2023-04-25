FROM keymetrics/pm2

WORKDIR /app
COPY .output /app/.output
COPY ecosystem.config.js /app/ecosystem.config.js

# 暴露端口
EXPOSE 8181

CMD ["pm2-runtime", "ecosystem.config.js"]