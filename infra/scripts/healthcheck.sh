set -e

echo "🔍 Checking container health..."
services=("auth-service" "resume-service" "ai-service" "user-service" "nginx_gateway" "resumepro_mongo")

for service in "${services[@]}"; do
  status=$(docker inspect -f '{{.State.Health.Status}}' $service 2>/dev/null || echo "none")
  echo "$service → $status"
done
