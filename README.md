# GitHub Wrapped 2025

A modern, bento-style GitHub Wrapped generator for 2025.

## Features
- 📊 **Comprehensive Stats**: Total contributions, top languages, most active repo, and more.
- 🎨 **Modern Design**: Dark mode, beautiful gradients, and bento-grid layout.
- 🖼️ **Image Export**: Generate and download a high-quality PNG of your stats.
- 📱 **Responsive**: Works great on mobile and desktop.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express, GitHub GraphQL API

## Getting Started

### Backend
1. `cd server`
2. `npm install`
3. Create `.env` file with `GITHUB_TOKEN=your_token`
4. `npm run dev`

### Frontend
1. `cd client`
2. `npm install`
3. `npm run dev`

## Deployment to Vercel

### Prerequisites
1. A GitHub account
2. A Vercel account (sign up at [vercel.com](https://vercel.com))
3. A GitHub Personal Access Token

### Step 1: Prepare Your Repository
1. Push your code to a GitHub repository
2. Make sure all files are committed

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client` (for frontend)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `GITHUB_TOKEN`: Your GitHub Personal Access Token
   - `VITE_API_BASE_URL`: Leave empty (will use `/api` automatically)
6. Click "Deploy"

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? github-wrapped-2025
# - Directory? ./
# - Override settings? No
```

### Step 3: Configure Environment Variables
1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add the following:
   - `GITHUB_TOKEN`: Your GitHub Personal Access Token
     - Get one at: https://github.com/settings/tokens
     - Required scopes: `public_repo`, `read:user`

### Step 4: Redeploy
After adding environment variables, trigger a new deployment:
- Go to "Deployments" tab
- Click "Redeploy" on the latest deployment

### Project Structure for Vercel
```
├── api/                    # Serverless functions
│   ├── profile/[username].js
│   └── stats/[username].js
├── client/                 # Frontend (React/Vite)
│   ├── src/
│   ├── package.json
│   └── vercel.json
├── server/                 # Backend code (used by API functions)
│   ├── services/
│   └── routes/
└── vercel.json            # Root Vercel configuration
```

### API Endpoints
After deployment, your API will be available at:
- `https://your-project.vercel.app/api/profile/:username`
- `https://your-project.vercel.app/api/stats/:username`

### Troubleshooting

**Issue: API returns 401 Unauthorized**
- Check that `GITHUB_TOKEN` is set in Vercel environment variables
- Verify the token is valid and has correct scopes
- Redeploy after adding/updating environment variables

**Issue: Frontend can't connect to API**
- Ensure `VITE_API_BASE_URL` is not set (or set to empty) to use relative paths
- Check that API routes are accessible at `/api/*`

**Issue: Build fails**
- Make sure all dependencies are in `package.json`
- Check that `client/package.json` has a `build` script
- Review build logs in Vercel dashboard

## License
MIT
