# 🔗 URL Shortener API

Enterprise-grade, highly scalable, and performant URL Shortener API built with **NestJS**. This project demonstrates the practical implementation of **Clean Architecture**, **Domain-Driven Design (DDD)**, and **Modular Monolith** principles.

## ✨ Key Features

- **URL Shortening & Redirection:** Generate unique, collision-resistant short codes (Base62/NanoID) and rapidly redirect users to original URLs.
- **Authentication & Authorization:** Secure JWT-based authentication with a robust Refresh Token mechanism backed by Redis (Blacklisting/Whitelisting).
- **High Performance (Read-Heavy Optimized):** Implements the **Cache-Aside Pattern** using Redis to serve redirects in milliseconds without hitting the primary database.
- **Event-Driven Analytics:** Asynchronous click tracking and IP geolocation gathering using `EventEmitter` to decouple the core redirection logic from analytics.
- **Concurrency Safe:** Utilizes Redis atomic operations (`INCR`) to handle high-traffic click counting, completely preventing race conditions.
- **Security:** Global and route-specific Rate Limiting (ThrottlerGuard) to prevent spam and abuse.
- **Robust Testing:** Comprehensive test suite including Unit Tests for core Use Cases (100% coverage on shortening logic) and E2E Tests for API endpoints.
- **Containerized:** Fully dockerized with a multi-stage build and `docker-compose` for seamless local deployment.

## 🏛️ Architecture & Principles

The application is structured as a **Modular Monolith**, divided into clearly defined Bounded Contexts (`Auth`, `User`, `Url`, `Click`). Inside each context, the codebase strictly adheres to **Clean Architecture**:

1.  **Domain Layer:** Contains enterprise business rules, Entities (Aggregate Roots), Value Objects (e.g., `EmailVO`, `UrlVO`), and Domain Exceptions. Pure TypeScript, zero framework dependencies.
2.  **Application Layer:** Contains application-specific business rules (Use Cases), Commands, and caching strategies.
3.  **Infrastructure Layer:** Contains external agency integrations (NestJS Controllers, Prisma ORM, Redis Keyv, IP Geolocation HTTP Services).

## 🛠️ Tech Stack

- **Framework:** NestJS (Node.js / TypeScript)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Caching & Atomic Counters:** Redis (via `cache-manager` & custom generic implementations)
- **Authentication:** Passport.js, JWT, Bcrypt
- **Testing:** Jest, Supertest
- **DevOps:** Docker, Docker Compose
- **API Documentation:** Swagger / OpenAPI
- **Validation:** `class-validator` & `class-transformer`

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Redis
- Docker & Docker Compose (Optional, for containerized setup)

### Option 1: Docker Setup (Recommended)

The easiest way to run the application along with its database and cache is via Docker Compose.

1. Clone the repository and navigate to the directory:
   ```bash
   git clone [https://github.com/mehmetext/url-shortener.git](https://github.com/mehmetext/url-shortener.git)
   cd url-shortener
   ```

````

2. Start the services:
```bash
docker compose up -d --build

````

_This command will build the API image, start PostgreSQL and Redis, and run the migrations automatically._

### Option 2: Manual Local Setup

1. Clone the repository:

```bash
git clone [https://github.com/mehmetext/url-shortener.git](https://github.com/mehmetext/url-shortener.git)
cd url-shortener

```

2. Install dependencies:

```bash
npm install

```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add the following:

```env
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/url_shortener?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secrets
ACCESS_TOKEN_SECRET="your-super-secret-access-key"
REFRESH_TOKEN_SECRET="your-super-secret-refresh-key"

```

4. Run Database Migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate

```

5. Start the Application:

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod

```

## 🧪 Testing

The project includes a robust testing environment isolated via mocks for unit tests and a live database connection for E2E testing.

```bash
# Run isolated Unit Tests
npm run test

# Run Unit Tests and generate a Coverage Report
npm run test:cov

# Run End-to-End (E2E) Tests
npm run test:e2e

```

## 📚 API Documentation

Once the application is running, the interactive **Swagger API documentation** is available at:
👉 `http://localhost:3000/api`

### Core Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive JWT & Refresh Token
- `POST /urls/shorten` - Shorten a URL (Requires Auth)
- `POST /urls/p-shorten` - Shorten a URL as a guest
- `GET /urls/:shortCode` - Redirect to the original URL
- `GET /urls/details/:id` - Get comprehensive analytics (clicks, geolocation) for a URL

## 📂 Project Structure

```text
src/
├── app.module.ts
├── main.ts
├── shared/                         # Global building blocks
│   ├── constants/
│   ├── decorators/
│   ├── errors/
│   ├── filters/
│   ├── interceptors/
│   ├── modules/                    # Shared infrastructure modules (Prisma, IpLocation)
│   └── services/                   # Generic services (CacheCount)
│
└── modules/                        # Bounded Contexts
    ├── auth/
    ├── click/
    ├── url/
    └── user/
        ├── domain/                 # Core business logic & rules
        ├── application/            # Use cases & DTOs
        └── infra/                  # NestJS Controllers, Repositories (Prisma/Redis)

```

## 📄 License

This project is licensed under the MIT License.
