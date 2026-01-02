# Score Board Backend API

Backend API for the Score Board application with JWT authentication and Prisma ORM.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/scoreboard?schema=public"

# JWT Secret (change this to a strong random string in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Port (optional, defaults to 3000)
PORT=3000
```

### 3. Set Up Database

1. Make sure PostgreSQL is running
2. Create a database (or use an existing one)
3. Update the `DATABASE_URL` in your `.env` file

### 4. Run Prisma Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create database tables
npm run prisma:migrate
```

### 5. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ username, email, password }`
  - Returns: `{ user, token }`

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ user, token }`

### Score Management

- `POST /api/score/update` - Update user score (Protected - requires JWT)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ action?: string }` (optional)
  - Returns: `{ user, message }`

- `GET /api/score/leaderboard` - Get top 10 users
  - Returns: `{ leaderboard: User[] }`

- `GET /api/score/me` - Get current user's score (Protected - requires JWT)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ user }`

### Health Check

- `GET /health` - Server health check
  - Returns: `{ status: "ok", message: "Server is running" }`

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The token is returned when registering or logging in and is valid for 7 days.

## Database Schema

- **User**: Stores user information, scores, and authentication data
- **ActionLog**: Logs all score update actions for audit purposes

