# Dependencies stage
FROM node:16-alpine AS dependencies

RUN apk add --no-cache libc6-compat
WORKDIR /home/node/app

COPY package.json package-lock.json ./

RUN npm ci

# Build stage
FROM node:16-alpine AS build

WORKDIR /home/node/app
COPY package.json package-lock.json tsconfig.json ./
COPY src/ ./src
COPY --from=dependencies /home/node/app/node_modules ./node_modules

ENV NODE_ENV production

RUN npm run build
RUN npm ci --production

# Start stage
FROM node:16-alpine AS run
WORKDIR /home/node/app

ENV NODE_ENV production

COPY --from=build /home/node/app/dist ./dist/
COPY --from=build /home/node/app/node_modules ./node_modules/
COPY --from=build /home/node/app/package.json ./package.json
COPY --from=build /home/node/app/public ./public/

USER node

EXPOSE 1337

HEALTHCHECK  --interval=1m --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:1337/health-check || exit 1

CMD ["npm", "start"]
