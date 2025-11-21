# 1. Base Stage (Build tools)
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN npm install turbo --global

# 2. Prune Stage
FROM base AS deps
WORKDIR /app
COPY . .
RUN turbo prune --scope=@elevra/frontend --docker

# 3. Installer/Builder Stage
FROM base AS installer
WORKDIR /app

# Install dependencies
COPY --from=deps /app/out/json/ .
COPY --from=deps /app/out/package-lock.json ./package-lock.json
RUN npm ci

# Build the project
COPY --from=deps /app/out/full/ .
COPY turbo.json turbo.json

# ARG needed for Next.js if you use ENV vars during build
# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN turbo run build --filter=@elevra/frontend...

# ---------------------------------------------------------
# 4. RUNNER STAGE
# ---------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=installer /app/apps/frontend/next.config.js .
COPY --from=installer /app/apps/frontend/package.json .

# Copy the standalone build (This includes node_modules)
COPY --from=installer --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/frontend/public ./apps/frontend/public

USER nextjs

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# The standalone output puts the server at the root of the copied structure
CMD ["node", "apps/frontend/server.js"]