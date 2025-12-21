# Database Setup Guide

This directory contains database schema, migrations, and connection utilities for the AI Learning Lab project.

## Quick Start

### 1. Install PostgreSQL

**macOS (using Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**macOS (using Postgres.app):**
Download from https://postgresapp.com/ and start the app.

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE ai_learning_lab;

# Create user (optional, if not using default postgres user)
CREATE USER your_username WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ai_learning_lab TO your_username;

# Exit
\q
```

### 3. Configure Environment

Update your `.env` file with your actual database credentials:

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/ai_learning_lab?schema=public"
```

Replace `postgres` and `password` with your actual username and password.

### 4. Run Migrations

```bash
# Generate Prisma client and run migrations
npm run migrate

# Or manually:
npx prisma migrate dev --name init
```

### 5. Verify Setup

```bash
# Check database connection
npx prisma studio
```

This will open Prisma Studio in your browser where you can view your database schema and data.

## Database Schema

The database schema includes 7 core entities:

1. **UserProfile** - Stores confirmed learning contract inputs from questionnaire
2. **LearningStrategy** - Derived decisions used to assemble daily plans
3. **Topic** - Allows multiple technical topics (e.g., Docker, Kubernetes)
4. **Concept** - Single concept node for sequencing and daily slicing
5. **DailyPlan** - Stores upcoming daily schedule for a user
6. **MemoryEntry** - System of record for learning and application
7. **EvidenceItem** - Makes memory proof-backed with GitHub links, screenshots, etc.

See `schema.sql` for the complete SQL schema with comments.

## Connection Utility

The `connection.ts` file provides a singleton Prisma client instance:

```typescript
import { prisma } from '@/database/connection';

// Example usage
const users = await prisma.userProfile.findMany();
```

## Development Commands

```bash
# Generate Prisma client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Validate schema
npx prisma validate

# Check database connectivity
npx prisma db pull
```

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL is running: `brew services list` (macOS) or `sudo systemctl status postgresql` (Linux)
- Check if the port 5432 is correct
- Verify credentials in `.env` file

### Authentication Failed
- Check username and password in `DATABASE_URL`
- Ensure the user has proper privileges

### Database Does Not Exist
- Create the database manually using `psql` or a GUI tool
- Ensure the database name matches the one in `DATABASE_URL`

### Migration Errors
- Check Prisma schema syntax: `npx prisma validate`
- Review migration files in `prisma/migrations/`
- Consider resetting: `npx prisma migrate reset` (development only)

## Performance Considerations

### Indexes
All frequently queried fields have indexes:
- `userId` on all user-related tables
- `topicId` on topic-related tables
- `createdAt` on memory entries
- `tags` (GIN index) on memory entries for array searches

### Query Optimization
- Use Prisma's query optimization features
- Monitor slow queries in development with logging enabled
- Consider connection pooling for production (PgBouncer)

## Security Notes

1. Never commit `.env` file (already in `.gitignore`)
2. Use strong passwords for production databases
3. Enable SSL for production connections
4. Regularly backup your database
5. Follow principle of least privilege for database users

## Next Steps

After setting up the database:
1. Generate Prisma client: `npx prisma generate`
2. Run migrations: `npx prisma migrate dev`
3. Verify connection: Test with a simple query in Next.js API route
4. Set up database seeding for development (optional)
