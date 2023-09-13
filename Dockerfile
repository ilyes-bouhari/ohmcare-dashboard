FROM node:18-alpine as build

WORKDIR /app
COPY . /app

COPY package.json ./
COPY yarn.lock ./
RUN rm -rf node_modules && yarn install --frozen-lockfile && yarn cache clean
RUN yarn build

FROM ubuntu
RUN apt-get update
RUN apt-get install nginx -y
COPY --from=build /app/dist /var/www/html/
EXPOSE 80
CMD ["nginx","-g","daemon off;"]