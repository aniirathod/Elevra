# STAGE 1: PRUNE
FROM node:20-alpine AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .

RUN turbo prune --scope=@elevra/backend --docker

# STAGE 2: DEV & INSTALLER
# This stage installs all deps (dev + prod) and is used for local development
FROM node:20-alpine AS dev
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy lockfile and package.json from the prune stage
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./

# Install ALL dependencies (needed for NestJS build & hot reload)
RUN npm install

# Copy source code
COPY --from=pruner /app/out/full/ .

# Generate Prisma Client (if you use Prisma)
# RUN npx prisma generate

# STAGE 3: BUILDER
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=dev /app/ .
ENV NODE_ENV production
RUN npm run build --filter=backend

# STAGE 4: PROD RUNNER
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Copy the built app
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/package.json ./package.json

EXPOSE 4000
ENV PORT 4000

# Node-based Healthcheck (No curl needed)
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "dist/main.js"]