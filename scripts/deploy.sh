#!/bin/bash

set -e

echo "🚀 Deploying Elevra to Production..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Check if .env exists
if [ ! -f .env ]; then
  echo -e "${RED}❌ .env file not found!${NC}"
  exit 1
fi

# Load environment variables
source .env

# Verify required variables
required_vars=("DATABASE_URL" "JWT_SECRET" "NEXT_PUBLIC_API_URL")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo -e "${RED}❌ $var is not set in .env${NC}"
    exit 1
  fi
done

# Build Docker images
echo -e "${BLUE}🐳 Building Docker images...${NC}"
docker compose -f docker-compose.prod.yml build

# Stop existing containers
echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
docker compose -f docker-compose.prod.yml down

# Start new containers
echo -e "${BLUE}🚀 Starting new containers...${NC}"
docker compose -f docker-compose.prod.yml up -d

# Run database migrations
echo -e "${BLUE}📊 Running database migrations...${NC}"
docker compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy

# Wait for services to be healthy
echo -e "${BLUE}⏳ Waiting for services to be healthy...${NC}"
sleep 30

# Health checks
echo -e "${BLUE}🏥 Running health checks...${NC}"
bash scripts/health-check.sh

echo -e "${GREEN}✅ Deployment complete!${NC}"