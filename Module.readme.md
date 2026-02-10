# Modules Documentation

This file provides comprehensive documentation for all modules/packages used in this project. Each module is explained with its purpose, configuration, usage, and importance to the application.

## Table of Contents
- [Core Framework](#core-framework)
- [Database & ORM](#database--orm)
- [Security & Protection](#security--protection)
- [Authentication & Authorization](#authentication--authorization)
- [Validation](#validation)
- [Logging](#logging)
- [Utilities](#utilities)
- [Development Tools](#development-tools)

---

## Core Framework

### express (v5.2.1)
**Purpose**
- Production-ready web framework for Node.js that provides robust routing, middleware support, and HTTP utilities.

**Where it is used**
- Application initialization in [src/app.js](src/app.js)
- Route definitions across [src/routes/](src/routes/)
- Controller methods in [src/controllers/](src/controllers/)

**How it is configured here**
- JSON body parser: `express.json()` - parses incoming JSON payloads
- URL-encoded parser: `express.urlencoded({ extended: true })` - parses form data
- Static file serving (if needed)
- Custom error handlers for 404 and 500 errors

**Key Features Used**
- RESTful routing with route parameters
- Middleware chain for request processing
- Request/Response object enrichment
- HTTP method handlers (GET, POST, PUT, DELETE)

**Why it matters**
- Industry-standard framework with extensive ecosystem
- Provides the foundation for building scalable APIs
- Excellent middleware support for extensibility
- Well-documented with large community support

---

## Database & ORM

### @neondatabase/serverless (v0.10.5)
**Purpose**
- Serverless Postgres driver optimized for edge computing and serverless environments with HTTP-based connections.

**Where it is used**
- Database connection in [src/config/database.js](src/config/database.js)
- All database operations through Drizzle ORM

**How it is configured here**
```javascript
import { neon } from '@neondatabase/serverless';
import { neonConfig } from '@neondatabase/serverless';

// Development mode uses Neon Local
if (process.env.NODE_ENV === 'development') {
  neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
}

export const sql = neon(process.env.DATABASE_URL);
```

**Key Features**
- HTTP-based Postgres protocol (no TCP/WebSocket needed)
- Works in edge environments (Cloudflare Workers, Vercel Edge)
- Connection pooling managed by Neon
- Compatible with Neon Local for development

**Why it matters**
- Enables serverless deployment without cold start issues
- Automatic connection management
- High performance with global edge network
- Cost-effective scaling

### drizzle-orm (v0.45.1)
**Purpose**
- TypeScript-first ORM with SQL-like syntax, type safety, and excellent performance.

**Where it is used**
- Schema definitions in [src/models/user.model.js](src/models/user.model.js)
- Database queries in services: [src/services/auth.service.js](src/services/auth.service.js), [src/services/users.service.js](src/services/users.service.js)

**How it is configured here**
```javascript
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from './database.js';

export const db = drizzle(sql);
```

**Schema Example**
```javascript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
```

**Key Features Used**
- Type-safe queries with IntelliSense
- SQL-like syntax (select, insert, update, delete)
- Automatic TypeScript type inference
- Migration system with drizzle-kit
- Relations and joins support

**Why it matters**
- Zero runtime overhead (compiles to raw SQL)
- Full type safety prevents database errors
- Excellent developer experience with autocomplete
- Easy migrations and schema management

### drizzle-kit (v0.31.8)
**Purpose**
- CLI tool for Drizzle ORM to manage database migrations and schema changes.

**How it is configured here**
```javascript
// drizzle.config.js
export default {
  schema: './src/models/*.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL
  }
};
```

**Commands Used**
- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:migrate` - Apply migrations to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)

**Why it matters**
- Automates migration creation
- Keeps database schema in sync with code
- Version control for database changes

---

## Security & Protection

### @arcjet/node (Latest)
**Purpose**
- Security-as-code platform providing bot detection, rate limiting, email validation, and attack protection.

**Where it is used**
- Global security middleware in [src/middleware/security.middleware.js](src/middleware/security.middleware.js)
- Configuration in [src/config/arcjet.js](src/config/arcjet.js)
- Applied to all routes via [src/app.js](src/app.js)

**How it is configured here**
```javascript
import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/node";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["userId"],
  rules: [
    detectBot({ mode: "LIVE" }),
    shield({ mode: "LIVE" }),
    // Dynamic rate limiting based on user role
    slidingWindow({
      mode: "LIVE",
      interval: "1m",
      max: (req) => {
        if (req.user?.role === 'admin') return 20;
        if (req.user?.role === 'user') return 10;
        return 5; // guests
      }
    })
  ]
});
```

**Key Features Used**
- **Bot Detection**: Identifies and blocks automated traffic
- **Shield**: Protects against common attacks (SQL injection, XSS)
- **Rate Limiting**: Role-based sliding window (admin: 20/min, user: 10/min, guest: 5/min)
- **Request Fingerprinting**: Tracks users across requests

**Why it matters**
- Prevents abuse and DDoS attacks
- Reduces spam and fake accounts
- Protects API resources from overuse
- Zero configuration security rules

### helmet (v8.1.0)
**Purpose**
- Sets secure HTTP headers to protect against common web vulnerabilities.

**Where it is used**
- Global middleware in [src/app.js](src/app.js)

**How it is configured here**
```javascript
import helmet from 'helmet';
app.use(helmet());
```

**Headers Set**
- `Content-Security-Policy` - Prevents XSS attacks
- `X-Frame-Options` - Prevents clickjacking
- `X-Content-Type-Options` - Prevents MIME sniffing
- `Strict-Transport-Security` - Enforces HTTPS
- `X-DNS-Prefetch-Control` - Controls DNS prefetching

**Why it matters**
- Industry best practices for HTTP security
- Protects against OWASP Top 10 vulnerabilities
- One-line setup for comprehensive header security

### cors (v2.8.5)
**Purpose**
- Enables Cross-Origin Resource Sharing to allow frontend apps on different domains to access the API.

**Where it is used**
- Global middleware in [src/app.js](src/app.js)

**How it is configured here**
```javascript
import cors from 'cors';
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
```

**Key Options**
- `origin`: Allowed origins (configure for production)
- `credentials`: Allow cookies and authentication headers
- `methods`: Allowed HTTP methods
- `allowedHeaders`: Allowed request headers

**Why it matters**
- Required for frontend-backend separation
- Enables secure cross-domain communication
- Prevents unauthorized cross-origin requests

---

## Authentication & Authorization

### jsonwebtoken (v9.0.3)
**Purpose**
- Industry-standard JWT (JSON Web Token) implementation for stateless authentication.

**Where it is used**
- Token utilities in [src/utils/jwt.js](src/utils/jwt.js)
- Authentication controller in [src/controllers/auth.controller.js](src/controllers/auth.controller.js)
- Auth middleware in [src/middleware/auth.middleware.js](src/middleware/auth.middleware.js)

**How it is configured here**
```javascript
import jwt from 'jsonwebtoken';

export const jwttoken = {
  sign: (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  },
  verify: (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
};
```

**Token Payload Structure**
```javascript
{
  userId: user.id,
  email: user.email,
  role: user.role,
  iat: 1234567890,  // issued at
  exp: 1234567890   // expiration
}
```

**Why it matters**
- Stateless authentication (no session storage needed)
- Scalable across multiple servers
- Secure with cryptographic signatures
- Standard format supported by all platforms

### bcrypt (v6.0.0)
**Purpose**
- Cryptographic library for hashing and verifying passwords securely.

**Where it is used**
- Password hashing in [src/services/auth.service.js](src/services/auth.service.js)

**How it is configured here**
```javascript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
```

**Key Features**
- Adaptive hashing (slow by design)
- Salt generation and storage built-in
- 10 rounds = ~100ms on modern hardware
- Resistant to rainbow table attacks

**Why it matters**
- Industry standard for password storage
- Protects against brute force attacks
- Automatically handles salting
- Future-proof with adjustable rounds

### cookie-parser (v1.4.7)
**Purpose**
- Parses Cookie header and populates `req.cookies` with cookie name-value pairs.

**Where it is used**
- Global middleware in [src/app.js](src/app.js)
- Cookie utilities in [src/utils/cookies.js](src/utils/cookies.js)
- Auth middleware for token extraction

**How it is configured here**
```javascript
import cookieParser from 'cookie-parser';
app.use(cookieParser());

// Setting secure cookies
export const setCookie = (res, name, value, options = {}) => {
  return res.cookie(name, value, {
    httpOnly: true,      // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'strict',  // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    ...options
  });
};
```

**Why it matters**
- Secure token storage (httpOnly prevents XSS)
- Better than localStorage for sensitive data
- Automatic cookie parsing in requests
- CSRF protection with sameSite flag

---

## Validation

### zod (v4.3.6)
**Purpose**
- TypeScript-first schema validation library with excellent error messages and type inference.

**Where it is used**
- Request validation schemas in [src/validations/auth.validation.js](src/validations/auth.validation.js)
- User validation in [src/validations/users.validation.js](src/validations/users.validation.js)
- Controllers for request data validation

**How it is configured here**
```javascript
import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: z.string()
    .email('Invalid email format')
    .toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

// Usage in controller
try {
  const validated = signupSchema.parse(req.body);
} catch (error) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: formatValidationError(error)
    });
  }
}
```

**Key Features Used**
- Type inference (TypeScript types from schemas)
- Custom error messages
- Complex validation rules (regex, custom validators)
- Schema composition and transformation
- Async validation support

**Why it matters**
- Prevents invalid data from entering the system
- Type safety without manual type definitions
- Clear error messages for API consumers
- Runtime and compile-time validation

---

## Logging

### winston (v3.19.0)
**Purpose**
- Universal logging library with multiple transports, log levels, and formatting options.

**Where it is used**
- Logger configuration in [src/config/logger.js](src/config/logger.js)
- Used throughout the application for logging
- Morgan stream destination

**How it is configured here**
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

// Console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}
```

**Log Levels**
- `error` - Error messages (logged to error.log)
- `warn` - Warning messages
- `info` - General information (default)
- `http` - HTTP requests
- `debug` - Debug information
- `verbose` - Detailed information

**Why it matters**
- Centralized logging for debugging and monitoring
- Multiple outputs (files, console, external services)
- Structured logs (JSON format) for log aggregation
- Production-ready with log rotation support

### morgan (v1.10.1)
**Purpose**
- HTTP request logger middleware that logs incoming requests with customizable formats.

**Where it is used**
- Global middleware in [src/app.js](src/app.js)
- Streams to Winston logger

**How it is configured here**
```javascript
import morgan from 'morgan';
import { logger } from '#config/logger.js';

app.use(morgan('combined', {
  stream: {
    write: (message) => logger.http(message.trim())
  }
}));
```

**Log Format (combined)**
```
:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
```

**Why it matters**
- Automatic HTTP request/response logging
- Integration with Winston for unified log management
- Essential for debugging and monitoring API traffic
- Tracks response times and status codes

---

## Utilities

### dotenv (v16.4.7)
**Purpose**
- Loads environment variables from `.env` files into `process.env`.

**Where it is used**
- Application entry point in [src/server.js](src/server.js)

**How it is configured here**
```javascript
import dotenv from 'dotenv';

// Load environment-specific .env file
dotenv.config({
  path: process.env.NODE_ENV === 'production' 
    ? '.env.production' 
    : '.env.development'
});
```

**Environment Variables Used**
- `NODE_ENV` - Application environment (development/production)
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - Neon database connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - Token expiration time (default: 7d)
- `ARCJET_KEY` - Arcjet API key
- `CORS_ORIGIN` - Allowed CORS origins
- `LOG_LEVEL` - Winston log level

**Why it matters**
- Separates configuration from code
- Environment-specific settings
- Security (keeps secrets out of source control)
- 12-factor app methodology

---

## Development Tools

### nodemon (v3.1.9)
**Purpose**
- Automatically restarts Node.js application when file changes are detected.

**Where it is used**
- Development script: `npm run dev`

**How it is configured here**
```javascript
// package.json
{
  "scripts": {
    "dev": "NODE_ENV=development nodemon src/server.js",
    "start": "NODE_ENV=production node src/server.js"
  }
}
```

**Why it matters**
- Speeds up development workflow
- No manual server restarts needed
- Watches for file changes automatically

### eslint (v9.20.0)
**Purpose**
- JavaScript linter that identifies and reports code quality issues and enforces coding standards.

**Where it is used**
- Code quality checks via `npm run lint`

**How it is configured here**
```javascript
// eslint.config.js
import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: { 
      globals: globals.node 
    }
  },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off'
    }
  }
];
```

**Why it matters**
- Catches bugs before runtime
- Enforces consistent code style
- Improves code maintainability

### prettier (v3.4.2)
**Purpose**
- Opinionated code formatter that ensures consistent code style across the project.

**Why it matters**
- Eliminates style debates in code reviews
- Automatic code formatting
- Consistent codebase appearance

### jest (v29.7.0) + supertest (v7.0.0)
**Purpose**
- Jest: JavaScript testing framework
- SuperTest: HTTP assertion library for testing Express apps

**Where it is used**
- Test files in [tests/](tests/)
- Test script: `npm test`

**How it is configured here**
```javascript
// jest.config.mjs
export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^#config/(.*)$': '<rootDir>/src/config/$1',
    '^#services/(.*)$': '<rootDir>/src/services/$1',
    // ... other aliases
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js'
  ]
};
```

**Test Example**
```javascript
import request from 'supertest';
import app from '../src/app.js';

describe('GET /health', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});
```

**Why it matters**
- Ensures code correctness
- Prevents regressions
- Documentation through tests
- Test coverage reporting

---

## Package Manager & Runtime

### Node.js (v24.13.0)
**Purpose**
- JavaScript runtime built on Chrome's V8 engine.

**Key Features Used**
- ES Modules (`type: "module"` in package.json)
- Native `--watch` flag for hot reload
- Import aliases via `imports` field in package.json
- Async/await syntax
- Native fetch API

**Why it matters**
- Modern JavaScript features
- Excellent performance
- Large ecosystem (npm packages)
- Active development and security updates

### npm (v10.x)
**Purpose**
- Package manager for Node.js that manages dependencies and runs scripts.

**Key Scripts**
```json
{
  "dev": "NODE_ENV=development nodemon src/server.js",
  "start": "NODE_ENV=production node src/server.js",
  "test": "NODE_ENV=test jest",
  "lint": "eslint .",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio",
  "docker:dev": "docker compose -f docker-compose.dev.yml up",
  "docker:prod": "docker compose -f docker-compose.prod.yml up -d"
}
```

---

## Import Aliases Configuration

This project uses Node.js import aliases (defined in package.json) for clean import paths:

```javascript
// package.json
{
  "imports": {
    "#config/*": "./src/config/*.js",
    "#controllers/*": "./src/controllers/*.js",
    "#middleware/*": "./src/middleware/*.js",
    "#models/*": "./src/models/*.js",
    "#routes/*": "./src/routes/*.js",
    "#services/*": "./src/services/*.js",
    "#utils/*": "./src/utils/*.js",
    "#validations/*": "./src/validations/*.js"
  }
}
```

**Usage Example**
```javascript
// Instead of:
import { logger } from '../../../config/logger.js';

// Use:
import { logger } from '#config/logger.js';
```

**Benefits**
- Cleaner imports (no relative path hell)
- Easier refactoring
- Better IDE support
- Consistent import style

---

## Module Dependencies Graph

```
Application (src/server.js)
├── Express App (src/app.js)
│   ├── Security Middleware
│   │   ├── helmet (HTTP headers)
│   │   ├── cors (Cross-origin)
│   │   └── @arcjet/node (Bot detection, rate limiting)
│   ├── Body Parsers
│   │   ├── express.json()
│   │   └── express.urlencoded()
│   ├── Cookie Parser
│   │   └── cookie-parser
│   ├── Logging
│   │   ├── morgan (HTTP logs)
│   │   └── winston (App logs)
│   └── Routes
│       ├── auth.routes (Authentication)
│       │   ├── auth.controller
│       │   │   ├── auth.service
│       │   │   │   ├── bcrypt (Password hashing)
│       │   │   │   └── drizzle-orm (Database)
│       │   │   ├── jwt (Token generation)
│       │   │   └── zod (Validation)
│       │   └── auth.validation
│       └── users.routes (User Management)
│           ├── auth.middleware (JWT verification)
│           ├── users.controller
│           │   ├── users.service
│           │   │   └── drizzle-orm (Database)
│           │   └── zod (Validation)
│           └── users.validation
├── Database Layer
│   ├── @neondatabase/serverless (Connection)
│   ├── drizzle-orm (ORM)
│   └── drizzle-kit (Migrations)
└── Configuration
    ├── dotenv (Environment variables)
    └── logger (Winston configuration)
```

---

## Production Dependencies vs Dev Dependencies

### Production Dependencies (Required at Runtime)
- `express` - Web framework
- `@neondatabase/serverless` - Database driver
- `drizzle-orm` - ORM
- `@arcjet/node` - Security
- `helmet` - HTTP headers
- `cors` - Cross-origin
- `cookie-parser` - Cookie handling
- `morgan` - HTTP logging
- `winston` - Application logging
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `zod` - Validation
- `dotenv` - Environment variables

### Dev Dependencies (Development Only)
- `nodemon` - Auto-restart
- `drizzle-kit` - Database migrations
- `eslint` - Linting
- `prettier` - Code formatting
- `jest` - Testing
- `supertest` - HTTP testing

---

## Summary

This project uses a carefully selected stack of modern, production-ready modules:

**Core Architecture**
- Express.js 5 for high-performance web serving
- Neon Postgres with Drizzle ORM for type-safe database operations
- ES Modules with import aliases for clean code organization

**Security First**
- Arcjet for bot detection and rate limiting
- JWT + httpOnly cookies for secure authentication
- Bcrypt for password hashing
- Helmet for HTTP security headers

**Developer Experience**
- Zod for runtime validation with TypeScript-like safety
- Winston + Morgan for comprehensive logging
- Jest + SuperTest for reliable testing
- ESLint + Prettier for code quality

**Production Ready**
- Docker support for consistent deployments
- Environment-based configuration
- Scalable architecture with service layer pattern
- Health checks and monitoring built-in

All modules are kept up-to-date and follow security best practices.
