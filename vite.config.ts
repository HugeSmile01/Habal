import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Server configuration
  server: {
    port: 3000,
    host: true, // Listen on all addresses
    strictPort: true, // Exit if port is already in use
    open: false, // Don't open browser automatically
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true, // Generate source maps for debugging
    minify: 'esbuild', // Use esbuild for faster builds
    target: 'es2020', // Modern browsers
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
        },
      },
    },
  },
  
  // Path aliases for cleaner imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@config': path.resolve(__dirname, './src/config'),
      '@services': path.resolve(__dirname, './src/services'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
  
  // Environment variable prefix
  envPrefix: 'VITE_',
  
  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: true,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/storage'
    ],
  },
});
