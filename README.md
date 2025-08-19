# VN Tour Travels

A full-stack travel booking application optimized for **one-click deployment**.

## 🚀 Quick Deploy

**See [DEPLOY.md](./DEPLOY.md) for one-click Vercel deployment buttons!**

## Project Structure

```
VN_TOUR_TRAVELS/
├── frontend/          # React + Vite SPA
│   ├── src/           # Components, pages, API client
│   ├── vercel.json    # Frontend deployment config
│   └── package.json
├── backend/           # Express.js API
│   ├── src/server.js  # Gateway server + all routes
│   ├── vercel.json    # Serverless deployment config
│   └── package.json
├── DEPLOY.md          # One-click deployment guide
└── README.md
```

## 🛠️ Local Development

```bash
# Install & run backend
cd backend
npm install
npm start    # http://localhost:5000

# Install & run frontend (new terminal)
cd frontend
npm install
npm run dev  # http://localhost:5173
```

## 🌐 Features

- **Multi-service booking** (tours, hotels, rentals)
- **Real-time status tracking** with cancellation
- **Admin approval workflow** with notifications
- **WhatsApp integration** for driver/school enquiries
- **Responsive design** with Tailwind CSS
- **Serverless ready** for scalable deployment

## 🔒 Security

- JWT authentication with secure secrets
- Password hashing with bcrypt
- Rate limiting and CORS protection
- Environment-based configuration
