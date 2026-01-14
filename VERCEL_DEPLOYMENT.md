# Frontend Deployment Guide - Vercel

This guide will help you deploy the frontend of your Score Board Website to Vercel.

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- Your Railway backend URL (where you deployed the backend)
- Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done)

   ```bash
   git add .
   git commit -m "Prepare frontend for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard**

   - Visit https://vercel.com/new
   - Click "Add New Project"
   - Import your Git repository

3. **Configure the Project**

   - **Framework Preset**: Select "Vite"
   - **Root Directory**: Set to `frontend`
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `dist` (should be auto-detected)
   - **Install Command**: `npm install` (should be auto-detected)

4. **Set Environment Variables**

   - Click "Environment Variables"
   - Add the following:
     - **Name**: `VITE_API_URL`
     - **Value**: Your Railway backend URL (e.g., `https://your-app.railway.app`)
     - Make sure it's set for all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be available at `https://your-app.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

3. **Login to Vercel**

   ```bash
   vercel login
   ```

4. **Deploy**

   ```bash
   vercel
   ```

   Follow the prompts:

   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - What's your project's name? Enter your project name
   - In which directory is your code located? `./`
   - Want to modify these settings? `N`

5. **Add Environment Variable**

   ```bash
   vercel env add VITE_API_URL
   ```

   When prompted:

   - Enter the value: Your Railway backend URL
   - Select environments: Choose all (Production, Preview, Development)

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Important Configuration

### Environment Variables

The frontend needs the following environment variable:

| Variable       | Description                  | Example                            |
| -------------- | ---------------------------- | ---------------------------------- |
| `VITE_API_URL` | Backend API URL from Railway | `https://your-backend.railway.app` |

### CORS Configuration

Make sure your Railway backend allows requests from your Vercel domain. Update your backend CORS settings:

```typescript
// In your backend App.ts or server configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development
      "https://your-app.vercel.app", // Production Vercel URL
      "https://*.vercel.app", // All Vercel preview deployments
    ],
    credentials: true,
  })
);
```

## Automatic Deployments

Once set up, Vercel will automatically:

- Deploy to production on every push to your `main` branch
- Create preview deployments for pull requests
- Provide unique URLs for each deployment

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Environment Variables Management

To update environment variables after deployment:

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add/Edit variables
4. Redeploy for changes to take effect

Or via CLI:

```bash
vercel env add VITE_API_URL production
vercel env add VITE_API_URL preview
vercel env add VITE_API_URL development
```

## Troubleshooting

### Build Fails

- Check that `package.json` has all required dependencies
- Verify Node.js version compatibility
- Check build logs in Vercel Dashboard

### API Connection Issues

- Verify `VITE_API_URL` is set correctly
- Ensure backend CORS allows Vercel domain
- Check Railway backend is running
- Test API endpoint directly in browser

### Routing Issues (404 on refresh)

- The `vercel.json` file should handle this with rewrites
- If issues persist, check that `vercel.json` is in the frontend folder

## Testing

After deployment:

1. Visit your Vercel URL
2. Test login/register functionality
3. Verify API calls work correctly
4. Check browser console for any errors

## Links

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Documentation: https://vercel.com/docs
- Vite Documentation: https://vitejs.dev/guide/

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables
3. Test backend API separately
4. Check browser developer console
