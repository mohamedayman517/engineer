import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Important for Replit
    port: 3002,
    allowedHosts: [
      'all',
      '.replit.dev',
      '.picard.replit.dev',
      'f74cba5d-7463-42d7-a302-8a320709f906-00-3dsv2tdqf5d9p.picard.replit.dev'
    ], // Fix for Replit blocked request
    proxy: {
      "/api": {
        target: (process.env.REPLIT_DB_URL || process.env.REPL_ID || process.env.REPL_SLUG) 
          ? "http://0.0.0.0:3000" 
          : "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying request:', req.method, req.url);
          });
        }
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser'
  },
  preview: {
    host: '0.0.0.0',
    port: 3002,
    allowedHosts: [
      'all',
      '.replit.dev',
      '.picard.replit.dev',
      'f74cba5d-7463-42d7-a302-8a320709f906-00-3dsv2tdqf5d9p.picard.replit.dev'
    ]
  }
});
