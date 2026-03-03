# AdamGuard Pro - Production Dockerfile with SQLite
# Fixed for proper static file serving

# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npx prisma generate
RUN npm run build

# Debug: show build output structure
RUN echo "=== Build output ===" && \
    ls -la .next/ && \
    echo "=== Standalone ===" && \
    ls -la .next/standalone/ && \
    echo "=== Static ===" && \
    ls -la .next/static/ && \
    echo "=== Standalone .next ===" && \
    ls -la .next/standalone/.next/ 2>/dev/null || echo "No .next in standalone"

# Stage 3: Production
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl curl sqlite

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="file:/app/data/adamguard.db"

# Create data directory
RUN mkdir -p /app/data

# Copy standalone build - this includes server.js and needed node_modules
COPY --from=builder /app/.next/standalone ./

# Copy static files to the correct location for standalone
# Standalone expects static files at ./.next/static
COPY --from=builder /app/.next/static ./.next/static

# Copy public folder
COPY --from=builder /app/public ./public

# Copy Prisma for database operations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Debug: verify file structure
RUN echo "=== Final structure ===" && \
    ls -la && \
    echo "=== .next folder ===" && \
    ls -la .next/ && \
    echo "=== .next/static folder ===" && \
    ls -la .next/static/ | head -10 && \
    echo "=== public folder ===" && \
    ls -la public/

# Initialize database
RUN npx prisma db push --skip-generate 2>/dev/null || echo "Database will be created on first run"

EXPOSE 3000

# Health check with longer timeout
HEALTHCHECK --interval=60s --timeout=30s --start-period=120s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
