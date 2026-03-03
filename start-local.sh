#!/bin/bash

# ===========================================
# AdamGuard Pro - Local Development Script
# ===========================================
# Start local development environment with Docker

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check Docker
if ! command -v docker &> /dev/null; then
    log_error "Docker is not installed. Please install it first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose is not installed. Please install it first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    log_info "Creating .env file..."
    cat > .env << EOF
# Database
DATABASE_URL=postgresql://adamguard:adamguard123@postgres:5432/adamguard

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

# Environment
NODE_ENV=development
EOF
    log_success ".env file created!"
fi

# Create init-db.sql if it doesn't exist
if [ ! -f init-db.sql ]; then
    log_info "Creating database initialization script..."
    cat > init-db.sql << 'EOF'
-- AdamGuard Pro Database Initialization
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    tier VARCHAR(50) DEFAULT 'essential',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Threats table
CREATE TABLE IF NOT EXISTS threats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    severity VARCHAR(50),
    file_path TEXT,
    action_taken VARCHAR(100),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id)
);

-- Scans table
CREATE TABLE IF NOT EXISTS scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(100),
    status VARCHAR(50),
    files_scanned INTEGER DEFAULT 0,
    threats_found INTEGER DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    user_id UUID REFERENCES users(id)
);

-- Quarantine table
CREATE TABLE IF NOT EXISTS quarantine (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_path TEXT NOT NULL,
    threat_name VARCHAR(255),
    quarantined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    restored_at TIMESTAMP,
    user_id UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_threats_user_id ON threats(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id);
EOF
    log_success "Database initialization script created!"
fi

# Create nginx.conf if it doesn't exist
if [ ! -f nginx.conf ]; then
    log_info "Creating nginx configuration..."
    cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream adamguard {
        server adamguard-app:3000;
    }

    server {
        listen 80;
        server_name localhost;

        client_max_body_size 100M;

        location / {
            proxy_pass http://adamguard;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 300s;
            proxy_connect_timeout 75s;
        }

        location /api {
            proxy_pass http://adamguard;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF
    log_success "Nginx configuration created!"
fi

# Start services
log_info "Starting Docker services..."
docker-compose up -d postgres redis

log_info "Waiting for database to be ready..."
sleep 5

log_info "Running database migrations..."
docker-compose exec -T postgres psql -U adamguard -d adamguard -f /docker-entrypoint-initdb.d/init-db.sql 2>/dev/null || true

log_info "Building and starting application..."
docker-compose up -d --build adamguard-app

log_info "Waiting for application to start..."
sleep 10

# Health check
log_info "Checking application health..."
for i in {1..30}; do
    if curl -s http://localhost:3000/api > /dev/null 2>&1; then
        log_success "Application is healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        log_error "Application failed to start. Check logs with: docker-compose logs adamguard-app"
        exit 1
    fi
    sleep 2
done

echo ""
echo "=========================================="
echo "   AdamGuard Pro - Local Development"
echo "=========================================="
echo "Application: http://localhost:3000"
echo "PostgreSQL: localhost:5432"
echo "Redis: localhost:6379"
echo "Grafana: http://localhost:3001 (admin/admin123)"
echo "=========================================="
echo ""
echo "To stop services: docker-compose down"
echo "To view logs: docker-compose logs -f adamguard-app"
