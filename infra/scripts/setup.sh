echo "🧩 Checking system setup..."

# Check for Docker
if ! command -v docker &> /dev/null
then
    echo "❌ Docker not found. Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
else
    echo "✅ Docker installed"
fi

# Check for Node
if ! command -v node &> /dev/null
then
    echo "❌ Node.js not found. Please install Node 20+: https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node -v)
    echo "✅ Node.js detected ($NODE_VERSION)"
fi

# Check for npm
if ! command -v npm &> /dev/null
then
    echo "❌ npm not found. Please install Node/npm properly."
    exit 1
else
    echo "✅ npm detected"
fi

# Check for turbo
if ! command -v turbo &> /dev/null
then
    echo "⚙️ Installing TurboRepo CLI globally..."
    npm install -g turbo
else
    echo "✅ TurboRepo installed"
fi

echo "🚀 All set! Run 'npm run dev' or 'npm run dev:docker' to start development."
