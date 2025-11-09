#!/bin/sh
set -e

echo "========================================"
echo "🚀 Starting Resume AI Platform Backend"
echo "========================================"

# Validate required environment variables
required_vars="MONGO_URI JWT_ACCESS_SECRET JWT_REFRESH_SECRET OPENAI_API_KEY"
for var in $required_vars; do
  if [ -z "$(eval echo \$$var)" ]; then
    echo "❌ ERROR: Required environment variable $var is not set"
    exit 1
  fi
done

echo "✅ Environment variables validated"

# Start NGINX
echo "▶️  Starting NGINX..."
nginx -t  # Test configuration
nginx -g 'daemon off;' &
NGINX_PID=$!
echo "✅ NGINX started (PID: $NGINX_PID)"

# Wait for NGINX to be ready
sleep 3

# Check if NGINX is running
if ! kill -0 $NGINX_PID 2>/dev/null; then
  echo "❌ NGINX failed to start"
  exit 1
fi

# Start microservices with PM2
echo "▶️  Starting microservices with PM2..."
pm2-runtime start ecosystem.config.js

# If PM2 exits, stop NGINX
kill $NGINX_PID
echo "🛑 All services stopped"