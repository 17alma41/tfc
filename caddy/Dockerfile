FROM node:18-alpine AS builder
WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

FROM caddy:2-alpine

COPY --from=builder /app/dist /var/www/html
COPY caddy/Caddyfile /etc/caddy/Caddyfile
