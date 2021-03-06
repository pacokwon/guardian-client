FROM node:15-alpine AS builder
WORKDIR /usr/src/app
ARG VUE_APP_API_URL
ENV VUE_APP_API_URL=$VUE_APP_API_URL
COPY package* ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/guardian
COPY --from=builder /usr/src/app/dist .
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
