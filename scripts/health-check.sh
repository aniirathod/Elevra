#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

check_service() {
  local service=$1
  local url=$2
  local max_attempts=10
  local attempt=1

  echo -e "${BLUE}Checking $service...${NC}"
  
  while [ $attempt -le $max_attempts ]; do
    if curl -f -s -o /dev/null "$url"; then
      echo -e "${GREEN}✓ $service is healthy${NC}"
      return 0
    fi
    echo "  Attempt $attempt/$max_attempts failed, retrying..."
    sleep 3
    ((attempt++))
  done
  
  echo -e "${RED}✗ $service health check failed${NC}"
  return 1
}

# Check backend
check_service "Backend" "http://localhost:4000/health"

# Check frontend
check_service "Frontend" "http://localhost:3000"

# Check database connection (via backend)
echo -e "${BLUE}Checking database connection...${NC}"
if docker compose exec -T postgres pg_isready > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Database is healthy${NC}"
else
  echo -e "${RED}✗ Database check failed${NC}"
  exit 1
fi

echo -e "${GREEN}✅ All health checks passed!${NC}"