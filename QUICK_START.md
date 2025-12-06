# Quick Start - Vercel Deployment

## 🚀 Deploy in 5 Minutes

### Step 1: Get GitHub Token (2 min)

1. Visit: https://github.com/settings/tokens/new
2. Name: `GitHub Wrapped 2025`
3. Scopes: Check `public_repo` and `read:user`
4. Generate and **copy the token**

### Step 2: Deploy to Vercel (3 min)

#### Option A: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

Then add environment variable:

- `GITHUB_TOKEN` = your token from Step 1

#### Option B: Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variable
vercel env add GITHUB_TOKEN
# Paste your token

# Deploy to production
vercel --prod
```

### Step 3: Done! 🎉

Your app is live at `https://your-project.vercel.app`

## 📝 What Gets Deployed

- **Frontend**: React app from `client/` → Static site
- **Backend**: Serverless functions from `api/` → API routes
- **API Endpoints**:
  - `/api/profile/:username`
  - `/api/stats/:username`

## 🔧 Troubleshooting

**401 Error?**

- Check `GITHUB_TOKEN` is set in Vercel
- Verify token hasn't expired
- Redeploy after adding env vars

**Build Fails?**

- Check Vercel build logs
- Ensure all dependencies are in package.json
- Node version: Vercel uses 18.x by default

## 📚 More Info

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
