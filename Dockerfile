# syntax=docker/dockerfile:1                                                                       

# ---- deps: install with the lockfile so builds are reproducible ----
FROM node:22-alpine AS deps
# Upgraded to pnpm@latest to resolve Next.js 15+ trace mapping race conditions
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

# ---- build: produce the standalone Next.js bundle ----
FROM node:22-alpine AS build
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Safely carry over node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy project files over
COPY . .

# Setting proper production environmental context
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# ---- runtime: only what the server needs, running as a non-root user ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Standalone bundles everything into .next/standalone, but public assets and static configurations 
# must be mapped to their proper runtime paths alongside server.js
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

