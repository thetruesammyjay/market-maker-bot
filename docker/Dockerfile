# Multi-stage build for production
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine as production

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./

# Install NGINX for production
RUN apk add --no-cache nginx && \
    mkdir -p /run/nginx

COPY docker/nginx/nginx.conf /etc/nginx/http.d/default.conf

EXPOSE 80 443
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost/health || exit 1

CMD ["sh", "-c", "nginx && node dist/main.js"]