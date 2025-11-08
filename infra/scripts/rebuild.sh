echo "🔁 Rebuilding all images from scratch..."
docker compose -f docker-compose.dev.yml build --no-cache
