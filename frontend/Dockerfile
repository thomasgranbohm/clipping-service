# Dependencies
FROM node:16-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /home/node/app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /home/node/app
COPY . .
COPY --from=dependencies /home/node/app/node_modules ./node_modules

ENV NEXT_TELEMETRY_DISABLED 1
ENV SKIP_BUILD_STATIC_GENERATION 1
ENV NODE_ENV production
RUN npm run build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /home/node/app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /home/node/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /home/node/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /home/node/app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
