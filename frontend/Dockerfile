FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /app/dist
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
EXPOSE 5173

# Use envsubst to replace variables in nginx config
RUN apk add --no-cache gettext

CMD ["sh", "-c", "envsubst '\\$BACKEND_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]