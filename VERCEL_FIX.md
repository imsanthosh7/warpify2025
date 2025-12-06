# Fixing Vercel Build Error

If you're getting the error:
```
Error: Command "npm install && cd client && npm install" exited with 1
```

## Solution 1: Clear Vercel Cache (Recommended)

1. Go to your Vercel project dashboard
2. Go to **Settings** → **General**
3. Scroll down to **Clear Build Cache**
4. Click **Clear Build Cache**
5. Redeploy your project

## Solution 2: Update Vercel Project Settings

1. Go to your Vercel project dashboard
2. Go to **Settings** → **General**
3. Under **Build & Development Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: Leave empty (or set to `.` for root)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `client/dist`
   - **Install Command**: Leave empty (let Vercel auto-detect)
4. Save and redeploy

## Solution 3: Use Client Directory as Root

If the above doesn't work, configure Vercel to use `client` as the root:

1. Go to **Settings** → **General**
2. Set **Root Directory** to `client`
3. Set **Build Command** to `npm run build`
4. Set **Output Directory** to `dist`
5. Remove any custom **Install Command**

**Note**: If using this approach, you'll need to update API routes to work from the client root, or deploy API functions separately.

## Solution 4: Manual Configuration

If automatic detection isn't working:

1. Delete `vercel.json` temporarily
2. Deploy and let Vercel auto-detect
3. Once working, add back `vercel.json` with minimal config

## Current Configuration

The project is configured with:
- **Build Command**: `npm run vercel-build` (installs root deps, then client deps, then builds)
- **Output Directory**: `client/dist`
- **No Install Command**: Vercel will auto-detect and install dependencies

## Verify Locally

Test the build command locally:
```bash
npm run vercel-build
```

If this works locally but fails on Vercel, it's likely a caching issue - use Solution 1.

