# ANDYTUBE Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB account (https://www.mongodb.com)
- Stripe account (https://stripe.com)
- Cloudinary account (https://cloudinary.com) - optional, for video storage

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/andytube
   STRIPE_SECRET_KEY=sk_test_your_key
   STRIPE_PUBLIC_KEY=pk_test_your_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

4. Start the backend:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file:
   ```
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_STRIPE_KEY=pk_test_your_stripe_public_key
   ```

4. Start the frontend:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## Creating Admin User

1. Register a new user through the app
2. Manually update the user in MongoDB to set `isAdmin: true`

Or in MongoDB terminal:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { isAdmin: true } }
)
```

## Getting Stripe Keys

1. Go to https://dashboard.stripe.com
2. Navigate to "Developers" → "API keys"
3. Copy your publishable and secret keys
4. Add them to your `.env` files

## Getting MongoDB URI

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Click "Connect" and select "Connect your application"
4. Copy the connection string and add your password

## Testing

1. Create an account and login
2. If admin, upload a test video from the admin panel
3. Try purchasing and watching a video as another user
4. Check Stripe dashboard for transactions

## Deployment

For production deployment:
- Use MongoDB Atlas for database
- Deploy backend to Heroku, Vercel, or similar
- Deploy frontend to Vercel, Netlify, or similar
- Update environment variables in production
- Set `NODE_ENV=production` on backend

---

For more help, check the main README.md
