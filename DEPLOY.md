# VN Tour Travels - One-Click Deployment Guide

## 🚀 Super Easy Deployment (2 Steps)

### Step 1: Deploy Backend (API)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDeepakKag12%2FVN_TOUR_TRAVELS&project-name=vn-travels-backend&root-directory=backend)

**Environment Variables to Set in Vercel:**
```
MONGO_URI=mongodb+srv://your-mongo-connection
JWT_SECRET=your-generated-secret-from-crypto
SESSION_SECRET=another-random-secret
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123
FRONTEND_ORIGIN=https://your-frontend-domain.vercel.app
```

**Copy your deployed backend URL** (e.g., `https://vn-travels-backend.vercel.app`)

### Step 2: Deploy Frontend
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDeepakKag12%2FVN_TOUR_TRAVELS&project-name=vn-travels-frontend&root-directory=frontend)

**Set this Environment Variable:**
```
VITE_API_BASE_URL=https://your-backend-from-step1.vercel.app
```

## ✅ That's It! 

Your travel booking site is live at both URLs.

## 🔧 Local Development (Optional)

```bash
# Backend
cd backend && npm install && npm start

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

## 🏥 Health Check
After deployment, visit: `https://your-backend-url.vercel.app/api/health`

---

### Generate JWT Secret (for Step 1):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
