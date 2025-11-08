echo "🧠 Smart Docker Start: checking for dependency changes..."

# Detect changes in Dockerfile or package.json since last commit
if git diff --name-only HEAD~1 HEAD | grep -E "Dockerfile|package.json" > /dev/null; then
  echo "🔁 Changes detected in Dockerfile or dependencies. Rebuilding images..."
  docker compose -f docker-compose.dev.yml up --build
else
  echo "🚀 No dependency changes. Starting containers without rebuild..."
  docker compose -f docker-compose.dev.yml up
fi