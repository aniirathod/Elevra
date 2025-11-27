# -----------------------------------------------------------------------------
# STAGE 1: PRUNE
# -----------------------------------------------------------------------------
FROM node:20-alpine AS pruner
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .

RUN turbo prune --scope=@elevra/backend --docker

# -----------------------------------------------------------------------------
# STAGE 2: DEV & INSTALLER
# -----------------------------------------------------------------------------
FROM node:20-alpine AS dev

RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy lockfile and package.json from the prune stage
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./

RUN npm install

# Copy source code
COPY --from=pruner /app/out/full/ .

RUN npx prisma generate --schema=apps/backend/prisma/schema.prisma

# -----------------------------------------------------------------------------
# STAGE 3: BUILDER
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=dev /app/ .

RUN npx turbo run build --filter=@elevra/backend


RUN npm prune --production

# -----------------------------------------------------------------------------
# STAGE 4: PROD RUNNER
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN apk add --no-cache openssl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Copy the built app
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/dist ./dist
# Copy PROD-ONLY node_modules from builder
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
# Copy package.json
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/package.json ./package.json
# ✅ ADDED: Copy Prisma Schema
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/backend/prisma.config.ts ./prisma.config.ts

EXPOSE 4000
ENV PORT 4000

# Node-based Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# ✅ UPDATED: Run migrations first, then start the app
CMD ["/bin/sh", "-c", "npx prisma migrate deploy --schema=./prisma/schema.prisma && node dist/main.js"]