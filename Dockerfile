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

# Build the application
# The build command already copies static and public to standalone folder
RUN npm run build

# Verify build output
RUN echo "=== Checking build output ===" && \
    ls -la .next/standalone/ && \
    echo "=== Checking .next in standalone ===" && \
    ls -la .next/standalone/.next/ && \
    echo "=== Checking static in standalone ===" && \
    ls -la .next/standalone/.next/static/ && \
    echo "=== Checking public in standalone ===" && \
    ls -la .next/standalone/public/

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

# Copy entire standalone build (includes server.js, .next, public, node_modules)
COPY --from=builder /app/.next/standalone ./

# Verify files are in place
RUN echo "=== Verifying final structure ===" && \
    ls -la && \
    echo "=== .next folder ===" && \
    ls -la .next/ && \
    echo "=== .next/static folder ===" && \
    ls -la .next/static/ | head -5 && \
    echo "=== .next/static/chunks folder ===" && \
    ls -la .next/static/chunks/ | head -10 && \
    echo "=== public folder ===" && \
    ls -la public/

# Copy Prisma for database operations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Initialize database
RUN npx prisma db push --skip-generate 2>/dev/null || echo "Database will be created on first run"

EXPOSE 3000

# Health check with longer timeout
HEALTHCHECK --interval=60s --timeout=30s --start-period=120s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
