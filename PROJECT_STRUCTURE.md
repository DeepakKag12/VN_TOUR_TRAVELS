# Project Structure Overview

```
VN_TOUR_TRAVELS/
├── .git/              # Git repository metadata
├── .gitignore         # Git ignore rules
├── README.md          # Project overview
├── DEPLOY.md          # Deployment instructions
├── backend/           # Express.js API Server
│   ├── src/           # Source code
│   ├── package.json   # Backend dependencies
│   ├── vercel.json    # Backend deployment config
│   └── .env           # Backend environment variables
└── frontend/          # React + Vite SPA
    ├── src/           # Source code
    ├── package.json   # Frontend dependencies
    ├── vercel.json    # Frontend deployment config
    └── .env.example   # Frontend environment template
```

## ✅ Clean & Organized:
- **No duplicate files** outside frontend/backend
- **No unnecessary artifacts** (node_modules, build files)
- **Each service is independent** with its own dependencies
- **Clear separation** of frontend and backend concerns
- **Deployment ready** with proper configuration files

## 🚀 Ready for:
- Independent service deployment
- Easy development setup
- One-click Vercel deployment via DEPLOY.md
