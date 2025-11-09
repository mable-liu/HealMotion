# HealMotion Deployment Guide

This guide covers deploying HealMotion to Vercel, the recommended platform for Next.js applications.

## Prerequisites

- A GitHub account with the HealMotion repository
- A Vercel account ([Sign up free](https://vercel.com/signup))
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## Deployment Options

### Option 1: Deploy via Vercel Dashboard (Recommended)

This is the easiest method and provides automatic deployments on every push.

#### Step 1: Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your HealMotion repository from GitHub
4. Authorize Vercel to access your repository

#### Step 2: Configure Project

Vercel will automatically detect that this is a Next.js project. The default settings are:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

These should all be automatically configured. Click "Deploy" to continue.

#### Step 3: Add Environment Variables

Before the first deployment completes, you need to add environment variables:

1. In the project settings, navigate to "Environment Variables"
2. Add the following variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your actual Gemini API key
   - **Environments**: Select "Production", "Preview", and "Development"
3. Click "Save"

#### Step 4: Redeploy (if necessary)

If you added environment variables after the first deployment:

1. Go to "Deployments" tab
2. Click on the three dots next to the latest deployment
3. Select "Redeploy"

### Option 2: Deploy via Vercel CLI

For more control over the deployment process, use the Vercel CLI.

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

#### Step 3: Deploy to Preview

From the project root directory:

```bash
vercel
```

This creates a preview deployment. Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N**
- Project name? **HealMotion** (or your preferred name)
- In which directory is your code located? **./** (just press Enter)

#### Step 4: Add Environment Variables

```bash
vercel env add GEMINI_API_KEY
```

When prompted:
- Enter the value: Your Gemini API key
- Select environments: Production, Preview, Development (use Space to select, Enter to confirm)

#### Step 5: Deploy to Production

```bash
vercel --prod
```

## Post-Deployment Configuration

### Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS records as instructed by Vercel

### Environment Variables Management

To update environment variables:

**Via Dashboard:**
1. Go to Project Settings → Environment Variables
2. Edit or add variables
3. Redeploy for changes to take effect

**Via CLI:**
```bash
# Add a new variable
vercel env add VARIABLE_NAME

# Remove a variable
vercel env rm VARIABLE_NAME

# List all variables
vercel env ls
```

### Monitoring and Logs

**View Deployment Logs:**
1. Go to your project in Vercel Dashboard
2. Click on "Deployments"
3. Select a deployment to view logs

**Runtime Logs:**
1. Go to your project
2. Navigate to "Logs" tab
3. View real-time application logs

## Automatic Deployments

With GitHub integration, Vercel automatically:

- **Production Deployments**: Every push to the `main` branch creates a production deployment
- **Preview Deployments**: Every push to other branches or pull requests creates a preview deployment
- **Instant Rollbacks**: You can instantly rollback to any previous deployment

### Branch Configuration

Configure which branch deploys to production:

1. Go to Project Settings → Git
2. Under "Production Branch", set to `main` (or your preferred branch)

## Environment-Specific Configuration

### Production
- URL: `https://your-project.vercel.app`
- Optimized builds
- Full caching enabled

### Preview (Staging)
- URL: Unique URL for each deployment
- Test changes before merging to production
- Full functionality with preview environment variables

### Development
- Local development with `npm run dev`
- Uses `.env.local` for environment variables

## Vercel Settings Checklist

Recommended settings for HealMotion:

- [ ] **Framework**: Next.js (auto-detected)
- [ ] **Build Command**: `npm run build` (default)
- [ ] **Output Directory**: `.next` (default)
- [ ] **Node.js Version**: 20.x (default)
- [ ] **Environment Variables**: `GEMINI_API_KEY` added
- [ ] **Automatic Deployments**: Enabled
- [ ] **Production Branch**: `main`
- [ ] **Preview Deployments**: Enabled for all branches

## Troubleshooting

### Build Fails

**Issue**: Build fails with "Cannot find module" errors

**Solution**:
1. Ensure `package.json` is in the root directory
2. Check that all dependencies are listed in `package.json`
3. Verify the build command is correct: `npm run build`

### Environment Variables Not Working

**Issue**: API returns errors or features don't work

**Solution**:
1. Verify `GEMINI_API_KEY` is set in Vercel dashboard
2. Check that the environment is correctly selected (Production/Preview/Development)
3. Redeploy after adding environment variables
4. Check environment variable names match exactly (case-sensitive)

### 404 Errors on Routes

**Issue**: Direct navigation to routes returns 404

**Solution**:
- This should not happen with Next.js on Vercel
- Check that pages exist in the `app/` directory
- Verify deployment logs for any errors

### API Routes Failing

**Issue**: API routes return 500 or timeout errors

**Solution**:
1. Check runtime logs in Vercel Dashboard
2. Verify Gemini API key is valid
3. Check API rate limits on Google Cloud Console
4. Review function execution time (Vercel free tier has 10s limit)

### Cache Issues

**Issue**: Changes not appearing after deployment

**Solution**:
1. Hard refresh in browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. In Vercel, trigger a redeploy
4. Check that the latest commit is deployed

## Performance Optimization

### Recommended Vercel Settings

1. **Enable Analytics**: Monitor Core Web Vitals
   - Go to Project → Analytics
   - Enable Web Analytics

2. **Speed Insights**: Track real-user performance
   - Project → Speed Insights
   - Add `@vercel/speed-insights` package if desired

3. **Edge Functions**: For optimal performance
   - API routes run on Edge by default in Next.js 16
   - No additional configuration needed

### Caching Strategy

Vercel automatically handles caching for:
- Static pages (1 year cache)
- API routes (configurable via headers)
- Static assets (1 year cache)

## Security Best Practices

1. **Never commit `.env.local`**: Already in `.gitignore`
2. **Rotate API keys regularly**: Update in Vercel dashboard
3. **Use environment-specific keys**: Different keys for production/preview if needed
4. **Enable Vercel Authentication** (optional): Protect preview deployments
   - Project Settings → Deployment Protection

## Cost Considerations

### Vercel Free Tier Includes:
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless Function execution: 100 GB-hours
- Edge Functions: 500,000 requests

### Monitoring Usage:
- Dashboard → Account Settings → Usage
- Set up usage alerts to avoid overages

### Optimizing Costs:
1. Enable caching to reduce function invocations
2. Optimize images using Next.js Image component
3. Use ISR (Incremental Static Regeneration) where appropriate
4. Monitor Gemini API usage (billed separately by Google)

## CI/CD Integration

### GitHub Actions (Optional)

For additional CI/CD steps before deployment:

1. Create `.github/workflows/ci.yml`
2. Add linting, testing steps
3. Vercel will still handle deployment automatically

### Deploy Hooks

Trigger deployments programmatically:

1. Project Settings → Git → Deploy Hooks
2. Create a hook (e.g., for CMS updates)
3. POST to the webhook URL to trigger deployment

## Rollback Procedure

If a deployment introduces issues:

1. Go to Deployments tab
2. Find the last working deployment
3. Click three dots → "Promote to Production"
4. Previous deployment is instantly restored

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Support](https://vercel.com/support)
- [HealMotion Issues](https://github.com/yourusername/HealMotion/issues)

## Quick Reference Commands

```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Add environment variable
vercel env add GEMINI_API_KEY

# List deployments
vercel ls

# View project info
vercel inspect

# Pull environment variables to local
vercel env pull .env.local
```

## Post-Deployment Checklist

After deploying, verify:

- [ ] Application loads at Vercel URL
- [ ] All pages are accessible (Profile, Workout, Diet)
- [ ] API routes respond correctly
- [ ] Gemini AI integration works
- [ ] Styles load correctly
- [ ] No console errors
- [ ] Mobile responsive design works
- [ ] Environment variables are set
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled (optional)

---

**Congratulations!** Your HealMotion app is now deployed and accessible worldwide.

For questions or issues, check the [main README](./README.md) or open an issue on GitHub.
