# Deployment Guide

This guide will help you deploy ANDYTUBE to production.

## Option 1: Vercel (Frontend) + Railway (Backend)

### Frontend - Vercel

1. Create a Vercel account at vercel.com
2. Connect your GitHub repository
3. Configure build settings:
   - Framework: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Add environment variable:
   - `REACT_APP_API_URL` = your-backend-url

### Backend - Railway

1. Create a Railway account at railway.app
2. Connect your repository
3. Add environment variables:
   - `MONGODB_URI` = your MongoDB connection string
   - `STRIPE_SECRET_KEY` = your Stripe key
   - `CLOUDINARY_URL` = your Cloudinary URL
   - `JWT_SECRET` = your JWT secret
   - `PORT` = 5000

## Option 2: Render

1. Create Render account
2. Create Web Service for backend
3. Connect GitHub repo
4. Add environment variables
5. Deploy!

## Option 3: Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create andytube-backend

# Set environment variables
heroku config:set MONGODB_URI=your_uri
heroku config:set STRIPE_SECRET_KEY=your_key

# Deploy
git push heroku main
```

## Database Setup

### MongoDB Atlas
1. Create account at mongodb.com/atlas
2. Create a free cluster
3. Create database user
4. Get connection string
5. Add to backend environment variables

### Cloudinary Setup
1. Create account at cloudinary.com
2. Get your cloud credentials
3. Add CLOUDINARY_URL to environment

## Stripe Setup
1. Create account at stripe.com
2. Get your API keys from dashboard
3. Add to backend environment variables

## Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test login flow
- [ ] Test video upload (admin)
- [ ] Test payment process
- [ ] Verify all API endpoints work
- [ ] Check mobile responsiveness

## Troubleshooting

### CORS Issues
Make sure your backend CORS is configured for your frontend domain.

### API Not Found
Check that your frontend is pointing to the correct backend URL.

### Payment Failures
Verify your Stripe keys are correct and in test/live mode as needed.

---

Good luck with your deployment! 🚀