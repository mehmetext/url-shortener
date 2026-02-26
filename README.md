# 🔗 URL Shortener API

Enterprise-grade, highly scalable, and performant URL Shortener API built with **NestJS**. This project demonstrates the practical implementation of **Clean Architecture**, **Domain-Driven Design (DDD)**, and **Modular Monolith** principles.

## ✨ Key Features

- **URL Shortening & Redirection:** Generate unique, collision-resistant short codes (Base62/NanoID) and rapidly redirect users to original URLs.
- **Authentication & Authorization:** Secure JWT-based authentication with a robust Refresh Token mechanism backed by Redis (Blacklisting/Whitelisting).
- **High Performance (Read-Heavy Optimized):** Implements the **Cache-Aside Pattern** using Redis to serve redirects in milliseconds without hitting the primary database.
- **Event-Driven Analytics:** Asynchronous click tracking and IP geolocation gathering using `EventEmitter` to decouple the core redirection logic from analytics.
- **Concurrency Safe:** Utilizes Redis atomic operations (`INCR`) to handle high-traffic click counting, completely preventing race conditions.
- **Security:** Global and route-specific Rate Limiting (ThrottlerGuard) to prevent spam and abuse.

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
- **API Documentation:** Swagger / OpenAPI
- **Validation:** `class-validator` & `class-transformer`

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Redis

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   ```
