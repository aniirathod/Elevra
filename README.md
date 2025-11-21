# Elevra - Production-Ready Turborepo Monorepo

A fully containerized, production-grade monorepo featuring Next.js 15, Nest.js 10, shared packages, and complete CI/CD pipelines.

![CI Status](https://github.com/aniirathod/Elevra/workflows/CI%20Pipeline/badge.svg)
![Deploy Status](https://github.com/aniirathod/Elevra/workflows/Deploy%20to%20Production/badge.svg)

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15, React 18, TailwindCSS, TypeScript
- **Backend**: Nest.js 10, Prisma ORM, PostgreSQL
- **Monorepo**: Turborepo, npm workspaces
- **Container**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Reverse Proxy**: Nginx
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

### Project Structure

```
elevra/
├── apps/
│   ├── frontend/          # Next.js application
│   └── backend/           # Nest.js API
├── packages/
│   ├── ui/                # Shared React components
│   ├── utils/             # Shared utilities
│   └── eslint-config/     # Shared ESLint config
├── infra/
│   └── nginx/             # Reverse proxy configuration
├── .github/workflows/     # CI/CD pipelines
└── scripts/               # Deployment & setup scripts
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **npm** 11.2.0 or higher
- **Docker** & **Docker Compose** (for containerized development)
- **Git**

### Installation

1.                                             **Clone the repository**

    ```bash
    git clone <repository-url>
    cd elevra
    ```

2.  **Run setup script**

    ```bash
    chmod +x scripts/setup.sh
    ./scripts/setup.sh
    ```

3.  **Configure environment variables**

    ```bash
    cp .env.example .env
    # Edit .env with your configuration
    ```

4.  **Start development**

    ```bash
    # Option 1: Local development
    npm run dev

    # Option 2: Docker development
    npm run docker:dev
    ```

## 💻 Development

### Local Development (without Docker)

```bash
# Install all dependencies
npm install

# Start all apps in development mode
npm run dev

# Run specific workspace
npm run dev:frontend
npm run dev:backend

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format
```

**Services will be available at:**

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

### Docker Development

```bash
# Start all services with hot reload only backend
npm run docker:dev

# View logs
docker compose logs -f

# Stop services
npm run docker:down

# Rebuild services
docker compose -f docker-compose.dev.yml up --build
```

**Services available at:**

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- PostgreSQL: localhost:5432

### Database Management

```bash
# Generate Prisma client
cd apps/backend
npx prisma generate

# Create migration
npx prisma migrate dev --name your_migration_name

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio
```

## 🏗️ Building for Production

### Build all applications

```bash
npm run build
```

### Build specific workspace

```bash
npm run build:frontend
npm run build:backend
```

### Test production build locally

```bash
# Build and start with Docker
npm run docker:prod

# Health check
npm run health-check
```

## 🚢 Production Deployment

### Prerequisites for Production

1. **Server Requirements**
   - Ubuntu 20.04+ or similar Linux distribution
   - Docker & Docker Compose installed
   - Domain name configured
   - SSL certificates (Let's Encrypt recommended)

2. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update all production values
   - Generate strong `JWT_SECRET` (min 32 characters)
   - Configure `DATABASE_URL` with production credentials
   - Set `CORS_ORIGINS` to your production domains

### Manual Deployment

```bash
# Make deploy script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh
```

### Automated Deployment (GitHub Actions)

1. **Configure GitHub Secrets**

   Navigate to: `Settings → Secrets and variables → Actions`

   Add the following secrets:
   - `DEPLOY_HOST`: Your production server IP/domain
   - `DEPLOY_USER`: SSH username
   - `DEPLOY_SSH_KEY`: Private SSH key for deployment
   - `PRODUCTION_URL`: Your production URL (for health checks)

2. **Push to main branch**

   ```bash
   git push origin main
   ```

   This will automatically:
   - Run CI checks (lint, type-check, build, test)
   - Build Docker images
   - Push to GitHub Container Registry
   - Deploy to production server
   - Run health checks

### Post-Deployment

```bash
# Check service status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Run health checks
./scripts/health-check.sh
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests for specific workspace
npm run test --workspace=@elevra/backend

# Run tests with coverage
npm run test:cov --workspace=@elevra/backend

# Watch mode
npm run test:watch --workspace=@elevra/backend
```

## 📏 Code Quality

### ESLint Configuration

The project uses a strict ESLint configuration with:

- TypeScript recommended rules
- Strict type checking
- No explicit `any` types
- Unused variable detection

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Prettier Configuration

Consistent code formatting with Prettier:

```bash
# Check formatting
npm run format:check

# Format all files
npm run format
```

### Pre-commit Hooks

Git hooks are automatically set up to:

- Run linter and fix issues
- Format code with Prettier
- Ensure code quality before commits

## 📦 Monorepo Structure

### Turborepo Pipeline

The `turbo.json` defines task dependencies and caching:

- **build**: Depends on dependencies being built first, caches outputs
- **dev**: No caching, persistent for development
- **lint**: Can run in parallel
- **type-check**: Validates TypeScript types
- **test**: Runs after build, caches coverage

### Adding New Packages

```bash
# Create package directory
mkdir packages/new-package
cd packages/new-package

# Initialize package
npm init -y

# Add to workspace
# Package is automatically recognized due to workspace configuration

# Create tsconfig.json extending base
cat > tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
EOF

# Install in other packages
cd ../ui
npm install @elevra/new-package@*
```

## 🐳 Docker Architecture

### Multi-stage Builds

All Dockerfiles use multi-stage builds for:

- **deps**: Install production dependencies
- **builder**: Build the application
- **runner**: Minimal runtime image

Benefits:

- Smaller image sizes
- Faster builds with layer caching
- Secure production images (no dev dependencies)

### Development vs Production

**Development** (`docker-compose.dev.yml`):

- Hot reload with volume mounts
- Source code mounted for instant updates
- Exposed ports for debugging
- Development environment variables

**Production** (`docker-compose.prod.yml`):

- Optimized production builds
- No volume mounts (immutable containers)
- Nginx reverse proxy
- Health checks enabled
- Automatic restarts

## 🔒 Security Best Practices

This monorepo follows security best practices:

### Application Security

- ✅ No `any` types in TypeScript
- ✅ Strict TypeScript configuration
- ✅ Input validation with class-validator
- ✅ CORS properly configured
- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ Rate limiting in Nginx
- ✅ Environment variable validation

### Container Security

- ✅ Non-root user in containers
- ✅ Multi-stage builds
- ✅ Minimal base images (Alpine)
- ✅ No secrets in images
- ✅ Health checks enabled

### Production Checklist

- [ ] Update all default passwords
- [ ] Generate strong JWT_SECRET (min 32 chars)
- [ ] Configure SSL certificates
- [ ] Set up proper CORS origins
- [ ] Enable firewall rules
- [ ] Configure backup strategy
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Review and update rate limits

## 📊 Monitoring & Logging

### Application Logs

```bash
# View all logs
docker compose logs -f

# View specific service
docker compose logs -f backend
docker compose logs -f frontend

# Follow last 100 lines
docker compose logs -f --tail=100
```

### Health Checks

```bash
# Backend health
curl http://localhost:4000/health

# Frontend health
curl http://localhost:3000

# Automated health check
./scripts/health-check.sh
```

### Log Levels

Configure via `LOG_LEVEL` environment variable:

- `debug`: All logs
- `info`: Info, warnings, errors
- `warn`: Warnings and errors
- `error`: Errors only

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000
lsof -i :4000
lsof -i :5432

# Kill process
kill -9
```

### Docker Issues

```bash
# Remove all containers and volumes
docker compose down --volumes --remove-orphans

# Rebuild without cache
docker compose build --no-cache

# Prune Docker system
docker system prune -a
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker compose ps postgres

# Check database logs
docker compose logs postgres

# Connect to database
docker compose exec postgres psql -U dev -d elevra_dev
```

### Node Modules Issues

```bash
# Clean install
npm run clean
rm -rf node_modules package-lock.json
npm install

# Or clean specific workspace
npm run clean --workspace=@elevra/frontend
```

## 🤝 Contributing

### Branch Strategy

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Emergency production fixes

### Commit Convention

Follow conventional commits:

```
feat: add user authentication
fix: resolve CORS issue in production
docs: update deployment guide
chore: upgrade dependencies
refactor: improve error handling
test: add unit tests for utils
```

### Pull Request Process

1. Create feature branch from `main`
2. Make changes and commit
3. Push branch and create PR
4. Ensure CI passes
5. Request code review
6. Merge after approval

## 📚 Additional Resources

### Documentation Links

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Nest.js Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Documentation](https://docs.docker.com)

### Useful Commands

```bash
# Package management
npm install                     # Install in root
npm install  -w @elevra/frontend # Install in workspace

# Workspace commands
npm run  --workspace=      # Run script in workspace
npm run  --workspaces            # Run in all workspaces

# Docker commands
docker compose up -d                     # Start in background
docker compose restart          # Restart service
docker compose exec  sh         # Access container shell

# Database commands
npx prisma studio                        # Open Prisma Studio
npx prisma db push                       # Push schema changes
npx prisma db seed                       # Seed database
```

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

- **Maintainer**: Aniket Rathod
- **Email**: aniketnr5023@gmail.com
- **Repository**: https://github.com/aniirathod/Elevra.git

---

**Built with ❤️**
