# Railway Deployment Guide for TranslateB

This guide explains how to deploy the TranslateB React PWA application to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. GitHub repository with your code
3. Railway CLI installed (optional, but recommended)

## Deployment Methods

### Method 1: GitHub Integration (Recommended)

1. **Connect GitHub Repository**
   - Go to [railway.app](https://railway.app) and sign in
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `TranslateB` repository
   - Railway will automatically detect it's a Node.js project

2. **Configure Environment Variables** (if needed)
   - Go to your project dashboard
   - Click on "Variables" tab
   - Add any environment variables (none required for basic deployment)

3. **Deploy**
   - Railway will automatically build and deploy your app
   - The build process uses the `nixpacks.toml` configuration
   - Your app will be available at a Railway-provided URL

### Method 2: Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   railway init
   ```

4. **Deploy**
   ```bash
   railway up
   ```

## Configuration Files Included

- `railway.json` - Railway-specific configuration
- `nixpacks.toml` - Build configuration for Nixpacks
- `Dockerfile` - Docker configuration (alternative)
- `Procfile` - Process configuration
- `.dockerignore` - Docker ignore file

## Build Process

Railway will:
1. Install dependencies with `npm ci`
2. Build the React app with `npm run build`
3. Serve the built app using `serve` package
4. Automatically assign a port via `$PORT` environment variable

## Environment Variables

Railway automatically provides:
- `PORT` - The port your app should listen on
- `RAILWAY_ENVIRONMENT` - Current environment (production/staging)
- `RAILWAY_PROJECT_NAME` - Your project name

## Custom Domain (Optional)

1. Go to your Railway project dashboard
2. Click on "Settings" tab
3. Scroll to "Domains" section
4. Click "Generate Domain" for a railway.app subdomain
5. Or add your custom domain

## Monitoring

Railway provides:
- Real-time logs in the dashboard
- Metrics and analytics
- Deployment history
- Health checks

## Troubleshooting

### Build Failures
- Check the build logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Runtime Issues
- Check application logs
- Verify environment variables
- Ensure `$PORT` is being used correctly

### Performance
- Railway automatically scales based on traffic
- Monitor resource usage in dashboard
- Consider upgrading plan for high-traffic apps

## Cost Optimization

- Railway offers a free tier with generous limits
- Production apps may require paid plans
- Monitor usage in the dashboard
- Set up usage alerts

## CI/CD

Railway automatically:
- Deploys on every push to main branch
- Runs build process
- Provides deployment previews for PRs (on paid plans)

## Next Steps

After deployment:
1. Test all features on the live URL
2. Set up custom domain (optional)
3. Configure monitoring and alerts
4. Plan for database integration (future)
5. Set up environment-specific configurations

Your TranslateB app should now be live and accessible via Railway!
