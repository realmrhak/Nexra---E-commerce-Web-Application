import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite config — drop-in replacement for the original Create React App setup.
 *
 * IMPORTANT: We are using the EXACT same library versions as the original repo
 * (React 19, MUI 9, Bootstrap 4.1.3, styled-components 6, react-router-dom 7,
 * swiper 12, lucide-react 1.3, react-inner-image-zoom 4, react-slick 0.31,
 * react-range-slider-input 3.0.2). No styling library has been upgraded or
 * downgraded — the user's App.css and all Bootstrap 4 utility classes
 * (ml-auto, mr-3, pl-3, pr-3 etc.) continue to work exactly as before.
 *
 * The only change vs. the original CRA setup is the build tool: Vite instead
 * of react-scripts. This is required because react-scripts is deprecated and
 * not deployable on modern hosts like Vercel.
 */
export default defineConfig({
  plugins: [
    // The original repo uses .js extensions for JSX files (CRA convention).
    // We tell the plugin to treat both .js and .jsx as JSX so existing files
    // continue to work without being renamed.
    react({
      include: /\.(js|jsx)$/,
    }),
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  server: {
    port: 5173,
    open: false,
    proxy: {
      // Proxy /api to backend in development so cookies + CORS just work.
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // Vendor chunk splitting for better long-term caching.
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@mui/styled-engine-sc'],
          'styled-vendor': ['styled-components'],
          'swiper-vendor': ['swiper'],
          'icons-vendor': ['react-icons', 'lucide-react', 'lucide'],
        },
      },
    },
  },
});
