# Vercel Deployment Guide

This guide will help you deploy GitHub Wrapped 2025 to Vercel.

## Quick Start

### 1. Get a GitHub Token

1. Go to https://github.com/settings/tokens/new
2. Create a token with `public_repo` and `read:user` scopes
3. Copy the token (you won't see it again!)

### 2. Deploy to Vercel

#### Using Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Add Environment Variable:
   - Key: `GITHUB_TOKEN`
   - Value: Your GitHub token from step 1
6. Click "Deploy"

**Note**: If auto-detection doesn't work, manually configure:

- **Framework Preset**: Vite
- **Root Directory**: Leave empty
- **Build Command**: `cd client && npm install && npm run build`
- **Output Directory**: `client/dist`

#### Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variable
vercel env add GITHUB_TOKEN
# Paste your token when prompted

# Redeploy with new env var
vercel --prod
```

## Project Structure

The project is configured as a monorepo:

- `client/` - Frontend React app (deployed as static site)
- `api/` - Serverless functions (handles API routes)
- `server/` - Shared backend code (used by API functions)

**Important**: The API functions require dependencies from `server/`. Vercel will automatically install dependencies from:

- Root `package.json`
- `server/package.json` (for server dependencies like axios)
- `client/package.json` (for frontend dependencies)

## Environment Variables

Required in Vercel:

- `GITHUB_TOKEN` - Your GitHub Personal Access Token

Optional:

- `VITE_API_BASE_URL` - API base URL (defaults to `/api` in production)

## API Routes

After deployment, these endpoints are available:

- `GET /api/profile/:username` - Get GitHub user profile
- `GET /api/stats/:username` - Get GitHub user stats

## Local Development

For local development, you can still use the Express server:

```bash
# Terminal 1: Backend
cd server
npm install
# Create .env with GITHUB_TOKEN
npm run dev

# Terminal 2: Frontend
cd client
npm install
npm run dev
```

The frontend will automatically use `http://localhost:3000/api` in development mode.

## Troubleshooting

### API returns 401

- Verify `GITHUB_TOKEN` is set in Vercel
- Check token hasn't expired
- Redeploy after adding env vars

### CORS errors

- API functions include CORS headers
- Check browser console for specific errors

### Build fails

- Ensure all dependencies are in package.json
- Check Node.js version (Vercel uses Node 18.x by default)
- Review build logs in Vercel dashboard

## Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL

## Monitoring

- View deployment logs in Vercel dashboard
- Check function logs for API errors
- Monitor API usage in Vercel Analytics
