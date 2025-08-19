# VN Tour Travels Backend

## Gateway Server: `src/server.js`

This is the **main entry point and gateway** for the entire backend API. All requests are routed through this Express server.

## Available Endpoints

### Health Check
- `GET /api/health` - Server status, mode (mongo/memory), and available routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Core Services
- `GET /api/models` - Tour packages/listings
- `POST /api/bookings` - Create bookings
- `GET /api/bookings/mine` - User's bookings
- `POST /api/bookings/:id/cancel` - Cancel booking
- `GET /api/hotels/:id/availability` - Hotel availability
- `GET /api/contact-info` - Contact information
- `POST /api/contacts` - Contact form submissions

### Admin Protected
- `/api/admin/*` - Admin operations
- `/api/profile/*` - User profile management
- `/api/notifications/*` - User notifications

## Deployment

The `vercel.json` configuration routes all traffic to `src/server.js`, which acts as the central gateway handling:
- Database connection (MongoDB with fallback to JSON persistence)
- Authentication & sessions
- Route protection & CORS
- Admin user seeding
- All API endpoints

**Health Check URL after deployment:** `https://your-vercel-domain.vercel.app/api/health`
