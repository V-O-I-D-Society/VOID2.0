import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // listen on all interfaces
    port: 5173, 
    // allow Cloudflare Tunnel host
    allowedHosts: [
      'permit-veteran-mysimon-played.trycloudflare.com '
    ],
  },
});
