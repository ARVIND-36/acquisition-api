# Docker Quick Reference

## 🚀 Quick Start

### Development (with Neon Local)
```bash
npm run docker:dev
```

### Production (with Neon Cloud)
```bash
npm run docker:prod
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run docker:dev` | Start development environment |
| `npm run docker:dev:down` | Stop and remove dev containers & volumes |
| `npm run docker:prod` | Start production environment (detached) |
| `npm run docker:prod:down` | Stop production containers |
| `npm run docker:build:dev` | Rebuild development image |
| `npm run docker:build:prod` | Rebuild production image |
| `npm run docker:logs:dev` | View development logs |
| `npm run docker:logs:prod` | View production logs |

## 🛠️ Container Management

### Execute commands in running containers

```bash
# Development
docker exec acquisitions-app-dev npm run db:migrate
docker exec acquisitions-app-dev npm run db:studio

# Production
docker exec acquisitions-app-prod npm run db:migrate
docker exec acquisitions-app-prod npm run db:studio
```

## 📖 Full Documentation

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for complete setup instructions and troubleshooting.
