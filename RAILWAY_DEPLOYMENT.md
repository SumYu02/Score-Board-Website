# Railway Deployment Guide

This guide will help you deploy the Score Board Website to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. A GitHub account (if deploying from a repository)

## Deployment Steps

### Option 1: Deploy as a Single Service (Recommended)

This option deploys both backend and frontend together, where the backend serves the frontend static files.

#### Step 1: Connect Your Repository

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

#### Step 2: Configure Environment Variables

In Railway, go to your service → Variables tab and add:

```
DATABASE_URL=postgresql://... (Railway will auto-generate this if you add a PostgreSQL service)
JWT_SECRET=your-strong-secret-key-here (generate a strong random string)
NODE_ENV=production
PORT=3000 (Railway sets this automatically, but you can override)
```

**Important:** 
- Railway automatically provides a `DATABASE_URL` when you add a PostgreSQL database service
- Generate a strong `JWT_SECRET` (you can use: `openssl rand -base64 32`)

#### Step 3: Add PostgreSQL Database

1. In your Railway project, click "New" → "Database" → "Add PostgreSQL"
2. Railway will automatically create a `DATABASE_URL` environment variable
3. The database will be automatically connected to your service

#### Step 4: Run Database Migrations

After deployment, you need to run Prisma migrations. You can do this by:

1. **Option A: Using Railway CLI**
   ```bash
   railway run cd backend && npx prisma migrate deploy
   ```

2. **Option B: Using Railway's Deploy Logs**
   - Add a one-time command in Railway's settings to run migrations
   - Or use Railway's shell feature to run: `cd backend && npx prisma migrate deploy`

3. **Option C: Add to build process** (modify `nixpacks.toml` to include migration)

#### Step 5: Deploy

Railway will automatically detect the `nixpacks.toml` file and build your application. The build process will:

1. Install dependencies for both backend and frontend
2. Generate Prisma client
3. Build the backend TypeScript code
4. Build the frontend React application
5. Start the backend server (which serves the frontend in production)

### Option 2: Deploy as Separate Services

If you prefer to deploy backend and frontend separately:

#### Backend Service

1. Create a new service in Railway
2. Set the **Root Directory** to `backend`
3. Add environment variables (same as above)
4. Railway will auto-detect Node.js and build

#### Frontend Service

1. Create a new service in Railway
2. Set the **Root Directory** to `frontend`
3. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-service.railway.app
   ```
4. Use a static site service or configure the build to serve static files

## Post-Deployment

### Run Database Migrations

After your first deployment, connect to your service and run:

```bash
cd backend
npx prisma migrate deploy
```

This will apply all database migrations.

### Seed Database (Optional)

If you want to seed your database with initial data:

```bash
cd backend
npm run prisma:seed
```

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT token signing | Yes | - |
| `NODE_ENV` | Environment mode | No | `production` |
| `PORT` | Server port | No | `3000` (Railway sets this automatically) |
| `VITE_API_URL` | Frontend API URL (only if deploying separately) | No | `http://localhost:3000` |

## Troubleshooting

### Build Fails

- Check that all dependencies are listed in `package.json`
- Ensure `nixpacks.toml` is in the root directory
- Check Railway build logs for specific errors

### Database Connection Issues

- Verify `DATABASE_URL` is set correctly
- Ensure PostgreSQL service is running
- Check that migrations have been run

### Frontend Not Loading

- Verify `NODE_ENV=production` is set
- Check that frontend build completed successfully
- Ensure backend is serving static files (check `backend/App.ts`)

### API Calls Failing

- If deploying as single service, `VITE_API_URL` should be empty or the same domain
- Check CORS settings in backend
- Verify backend routes are working via `/health` endpoint

## Custom Domain

To add a custom domain:

1. Go to your service settings in Railway
2. Click "Settings" → "Networking"
3. Add your custom domain
4. Railway will provide DNS instructions

## Monitoring

Railway provides:
- Real-time logs
- Metrics and monitoring
- Automatic deployments on git push (if connected to GitHub)

## Support

For Railway-specific issues, check:
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
