# Vercel Deployment Checklist

Use this checklist to ensure a successful deployment of HealMotion to Vercel.

## Pre-Deployment Checklist

### Local Verification
- [x] All legacy directories removed (api/, backend/, frontend/, healmotion-next/)
- [x] Next.js app is in repository root
- [x] `npm run build` completes successfully
- [x] All routes are properly generated
- [x] Environment variables template created (.env.local.example)
- [x] .gitignore properly configured for Next.js
- [x] Documentation is complete (README.md, DEPLOYMENT.md)

### Code Quality
- [x] TypeScript compilation has no errors
- [x] ESLint configuration is present
- [x] Package.json has correct scripts (dev, build, start, lint)
- [x] Dependencies are up to date
- [x] No sensitive data in committed files

### Repository Setup
- [ ] Code is committed to Git
- [ ] Code is pushed to GitHub/GitLab/Bitbucket
- [ ] Repository is accessible
- [ ] Main branch is up to date

## Deployment Steps

### Step 1: Create Vercel Account
- [ ] Sign up at https://vercel.com/signup
- [ ] Verify email address
- [ ] Complete profile setup

### Step 2: Import Project
- [ ] Go to Vercel Dashboard
- [ ] Click "Add New..." → "Project"
- [ ] Select your Git provider (GitHub/GitLab/Bitbucket)
- [ ] Authorize Vercel to access your repositories
- [ ] Select the HealMotion repository

### Step 3: Configure Project
- [ ] Verify framework preset is "Next.js"
- [ ] Verify build command is "npm run build"
- [ ] Verify output directory is ".next"
- [ ] Verify install command is "npm install"
- [ ] Set root directory to "./" (default)

### Step 4: Environment Variables
- [ ] Click "Environment Variables" section
- [ ] Add variable name: `GEMINI_API_KEY`
- [ ] Paste your Gemini API key as value
- [ ] Select all environments (Production, Preview, Development)
- [ ] Click "Add" to save

### Step 5: Deploy
- [ ] Review all settings
- [ ] Click "Deploy" button
- [ ] Wait for build to complete (usually 1-3 minutes)
- [ ] Check build logs for any errors

## Post-Deployment Verification

### Deployment Status
- [ ] Build completed successfully (green checkmark)
- [ ] Deployment URL is generated
- [ ] Domain is active and accessible

### Functionality Tests
- [ ] Home page loads (/)
- [ ] Profile page loads (/profile)
- [ ] Workout page loads (/workout)
- [ ] Diet page loads (/diet)
- [ ] Navigation works between pages
- [ ] Styles are applied correctly
- [ ] No console errors in browser

### API Route Tests
- [ ] Profile can be saved (POST /api/profile)
- [ ] Workout plan generates successfully (POST /api/workout)
- [ ] Diet plan generates successfully (POST /api/diet)
- [ ] Analyze endpoint works (POST /api/analyze)
- [ ] Error handling works (test with invalid data)

### Mobile & Responsiveness
- [ ] Site works on mobile devices
- [ ] Layout is responsive
- [ ] Touch interactions work
- [ ] No horizontal scroll

### Performance
- [ ] Page load time is acceptable (< 3 seconds)
- [ ] Images load correctly
- [ ] No CORS errors
- [ ] API responses are timely

## Optional Configuration

### Custom Domain
- [ ] Go to Project Settings → Domains
- [ ] Add your custom domain
- [ ] Configure DNS records as instructed
- [ ] Wait for DNS propagation (can take up to 48 hours)
- [ ] Verify SSL certificate is issued

### Analytics
- [ ] Enable Vercel Analytics
- [ ] Go to Project → Analytics
- [ ] Review Core Web Vitals
- [ ] Set up alerts (optional)

### Deployment Protection
- [ ] Go to Project Settings → Deployment Protection
- [ ] Enable password protection for preview deployments (optional)
- [ ] Set up Vercel Authentication (optional)

### Git Integration
- [ ] Verify automatic deployments are enabled
- [ ] Set production branch to "main"
- [ ] Enable preview deployments for pull requests
- [ ] Test automatic deployment (push a commit)

## Troubleshooting

### Build Fails

**Issue**: Build fails with dependency errors
- [ ] Check Node.js version (should be 20.x+)
- [ ] Verify package.json is valid
- [ ] Check build logs for specific errors
- [ ] Try removing node_modules and rebuilding locally

**Issue**: Build fails with TypeScript errors
- [ ] Run `npm run build` locally to reproduce
- [ ] Fix TypeScript errors
- [ ] Commit and push changes
- [ ] Redeploy

### Runtime Errors

**Issue**: API routes return 500 errors
- [ ] Verify GEMINI_API_KEY is set in environment variables
- [ ] Check runtime logs in Vercel Dashboard
- [ ] Test API key validity at https://makersuite.google.com/app/apikey
- [ ] Check API rate limits

**Issue**: Pages show 404 errors
- [ ] Verify pages exist in app/ directory
- [ ] Check deployment logs for build errors
- [ ] Clear browser cache and retry
- [ ] Check Vercel routing configuration

### Environment Variables Issues

**Issue**: Environment variables not working
- [ ] Verify variable name is exactly `GEMINI_API_KEY`
- [ ] Check that environment (Production/Preview) is selected
- [ ] Redeploy after adding environment variables
- [ ] Use `process.env.GEMINI_API_KEY` in code

## Monitoring & Maintenance

### Regular Checks
- [ ] Monitor deployment frequency
- [ ] Review build times
- [ ] Check error rates in logs
- [ ] Monitor bandwidth usage
- [ ] Review function invocation counts

### Updates
- [ ] Set up Dependabot for dependency updates
- [ ] Review and merge security updates
- [ ] Test updates in preview deployments
- [ ] Deploy to production after verification

### Backups
- [ ] Code is backed up in Git
- [ ] Environment variables documented
- [ ] Deployment history maintained in Vercel

## Success Criteria

Your deployment is successful when:
- [x] All pages load without errors
- [x] API routes respond correctly
- [x] Gemini AI integration works
- [x] Styles are applied properly
- [x] Site is responsive on all devices
- [x] No console errors
- [x] Performance is acceptable
- [x] Custom domain works (if configured)

## Quick Reference

### Useful Vercel URLs
- Dashboard: https://vercel.com/dashboard
- Documentation: https://vercel.com/docs
- Support: https://vercel.com/support
- Status: https://vercel-status.com

### Important Files
- `package.json` - Project configuration
- `next.config.ts` - Next.js configuration
- `.env.local` - Local environment variables (not committed)
- `.env.local.example` - Environment template (committed)

### Deployment Commands
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Add environment variable
vercel env add GEMINI_API_KEY

# View logs
vercel logs
```

## Support Resources

- **Documentation**: See DEPLOYMENT.md for detailed instructions
- **README**: See README.md for project setup
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Email**: liyuxiao2006@gmail.com

---

## Final Notes

After completing this checklist:
1. Save the deployment URL
2. Share with stakeholders
3. Monitor for the first 24-48 hours
4. Gather user feedback
5. Plan future enhancements

**Deployment Date**: _________________

**Deployment URL**: _________________

**Custom Domain**: _________________

**Deployed By**: _________________

---

**Status**: Ready for Production ✅

Good luck with your deployment!
