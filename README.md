# Acquisitions API

A modern, production-ready Node.js REST API built with Express.js, featuring full Docker containerization, role-based authentication, and enterprise-grade security.

## 🎯 Project Overview

This API demonstrates modern backend development practices with a focus on:
- **ES Modules** - Using native JavaScript modules with `import/export` syntax
- **Docker Containerization** - Complete development and production Docker setup
- **Serverless Database** - Neon Postgres with local development proxy
- **Type-Safe Validation** - Runtime type checking with Zod
- **Security First** - Arcjet bot protection, rate limiting, and JWT authentication

## ⚡ Tech Stack

### Core Technologies
- **Node.js 18+** - JavaScript runtime with native ES modules support
- **Express.js 5** - Fast, minimalist web framework
- **Neon Postgres** - Serverless PostgreSQL database
- **Drizzle ORM** - TypeScript-first ORM with migrations
- **Docker** - Container platform for consistent deployments

### Development Tools
- **ES Modules** - Modern JavaScript module system (`type: "module"`)
- **Import Aliases** - Clean imports using `#` prefix (`#config/*`, `#services/*`)
- **ESLint + Prettier** - Code quality and formatting
- **Jest + SuperTest** - Testing framework
- **Winston** - Structured logging

### Security & Validation
- **Arcjet** - Bot detection, rate limiting, and security middleware
- **Zod** - Runtime schema validation
- **bcrypt** - Password hashing
- **JWT** - Token-based authentication

## 🐳 Docker

Short version:
- Dev: `npm run docker:dev`
- Prod: `npm run docker:prod`

Full details and troubleshooting:
- [DOCKER_SETUP.md](DOCKER_SETUP.md)
- [DOCKER.md](DOCKER.md)

## 📦 Modules

Module usage and configuration details live here:
- [Module.readme.md](Module.readme.md)

## 📦 ES Modules Architecture

This project uses native **ECMAScript Modules** (ESM) with import aliases for clean code organization:

### Package Configuration
```json
{
  "type": "module",
  "imports": {
    "#config/*": "./src/config/*",
    "#controllers/*": "./src/controllers/*",
    "#middleware/*": "./src/middleware/*",
    "#models/*": "./src/models/*",
    "#routes/*": "./src/routes/*",
    "#services/*": "./src/services/*",
    "#utils/*": "./src/utils/*",
    "#validations/*": "./src/validations/*"
  }
}
```

### Import Examples
```javascript
// Instead of relative paths
import logger from '../../../config/logger.js';

// Use clean aliases
import logger from '#config/logger.js';
import { createUser } from '#services/auth.service.js';
import { signupSchema } from '#validations/auth.validation.js';
```

## 🚀 Features

✅ **User Authentication**
- JWT-based authentication with httpOnly cookies
- Password hashing with bcrypt
- Signup, signin, and signout endpoints

✅ **Role-Based Access Control**
- Admin and user roles
- Protected routes with middleware
- Permission-based operations

✅ **User Management**
- CRUD operations for users
- Admin-only user deletion
- User profile updates

✅ **Security**
- Arcjet bot detection
- Rate limiting (role-based)
- Request validation with Zod
- Helmet for security headers
- CORS configuration

✅ **Database**
- PostgreSQL with Drizzle ORM
- Schema migrations
- Drizzle Studio GUI
- Neon Local for development

✅ **Logging & Monitoring**
- Winston structured logging
- Request logging with Morgan
- Health check endpoint
- Error tracking

## 📁 Project Structure

```
acquisitions-api/
├── src/
│   ├── config/          # Database, logger, Arcjet configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, security middleware
│   ├── models/          # Drizzle ORM schemas
│   ├── routes/          # Express route definitions
│   ├── services/        # Business logic layer
│   ├── utils/           # Helper functions (JWT, cookies, formatting)
│   ├── validations/     # Zod validation schemas
│   ├── app.js           # Express app configuration
│   ├── server.js        # Server startup
│   └── index.js         # Entry point
├── drizzle/             # Database migrations
├── logs/                # Application logs
├── tests/               # Jest test files
├── scripts/             # Shell scripts for Docker
├── Dockerfile           # Multi-stage Docker build
├── docker-compose.dev.yml    # Development compose
├── docker-compose.prod.yml   # Production compose
├── .env.development     # Dev environment variables
├── .env.production      # Prod environment variables
└── package.json         # Dependencies & scripts
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Neon account (for database)
- Arcjet account (for security)

### Local Development (without Docker)

1. **Clone and install**
```bash
git clone <repository-url>
cd acquisitions-api
npm install
```

2. **Configure environment**
Create `.env` file:
```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
ARCJET_KEY=your-arcjet-key
```

3. **Run migrations**
```bash
npm run db:migrate
```

4. **Start development server**
```bash
npm run dev
```

### Docker Development

1. **Update `.env.development`** with your credentials

2. **Start containers**
```bash
npm run docker:dev
```

3. **Access the application**
- API: http://localhost:3000
- Health: http://localhost:3000/health
- Drizzle Studio: http://localhost:4983

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/sign-up    # Register new user
POST   /api/auth/sign-in    # Login
POST   /api/auth/sign-out   # Logout
```

### Users (Protected)
```
GET    /api/users           # Get all users (authenticated)
GET    /api/users/:id       # Get user by ID (authenticated)
PUT    /api/users/:id       # Update user (authenticated, own profile or admin)
DELETE /api/users/:id       # Delete user (admin only)
```

### Health
```
GET    /health              # Health check endpoint
GET    /api                 # API status
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev                 # Start with hot-reload
npm start                   # Start production server

# Database
npm run db:generate         # Generate migrations
npm run db:migrate          # Apply migrations
npm run db:studio           # Open Drizzle Studio

# Code Quality
npm run lint                # Run ESLint
npm run lint:fix            # Fix linting issues
npm run format              # Format with Prettier
npm run format:check        # Check formatting

# Testing
npm test                    # Run tests

# Docker
npm run docker:dev          # Start dev environment
npm run docker:prod         # Start production
```

## 🔐 Environment Variables

### Development (.env.development)
```env
# Neon Local
NEON_API_KEY=your_neon_api_key
NEON_PROJECT_ID=your_project_id
PARENT_BRANCH_ID=main

# Application
DATABASE_URL=postgresql://neon:neon@neon-local:5432/neondb
JWT_SECRET=dev-secret-key
ARCJET_KEY=your_arcjet_key
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
```

### Production (.env.production)
```env
# Neon Cloud
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Application
JWT_SECRET=strong-production-secret
ARCJET_KEY=your_arcjet_key
PORT=3000
NODE_ENV=production
LOG_LEVEL=info
CORS_ORIGIN=https://yourdomain.com
```

## 🏗️ Architecture Highlights

### Layered Architecture
1. **Routes** - Define endpoints and HTTP methods
2. **Controllers** - Handle requests, validate input, format responses
3. **Services** - Business logic and database operations
4. **Models** - Drizzle ORM table definitions
5. **Middleware** - Authentication, security, logging

### Database Connection (Development)
```javascript
// src/config/database.js
if (process.env.NODE_ENV === 'development') {
  neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}
```

### Security Middleware
```javascript
// Arcjet protection with role-based rate limiting
const securityMiddleware = async (req, res, next) => {
  const role = req.user?.role || 'guest';
  const limit = role === 'admin' ? 20 : role === 'user' ? 10 : 5;
  
  const client = aj.withRule(
    slidingWindow({ max: limit, interval: '1m' })
  );
  
  const decision = await client.protect(req);
  // Bot detection, rate limiting, shield protection
};
```

## 📚 Learning Resources

- [Node.js ES Modules](https://nodejs.org/api/esm.html)
- [Docker Documentation](https://docs.docker.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Neon Postgres](https://neon.tech/docs)
- [Arcjet Security](https://docs.arcjet.com/)


