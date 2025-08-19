import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use proxy in dev to avoid CORS (frontend -> Vite -> remote backend)
const REMOTE_API = 'https://vn-tour-travels-4smw.vercel.app';

export default defineConfig(() => ({
  plugins: [react()],
  optimizeDeps: { exclude: ['lucide-react'] },
  server: {
    proxy: {
      // When VITE_API_BASE_URL is /api (dev), forward to remote backend
      '/api': {
        target: REMOTE_API,
        changeOrigin: true,
        secure: true,
        // Strip nothing; keep /api prefix because backend expects it
      },
    },
  },
}));
