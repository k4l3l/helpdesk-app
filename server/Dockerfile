# Define Base
FROM node:14-buster-slim AS base

# install dependency (openssl) for Prisma
FROM base as base-with-dep
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
COPY ["prisma", "prisma"]
COPY ["src", "src"]

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]