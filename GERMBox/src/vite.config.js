import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        portfolio: resolve(__dirname, 'public/pages/portfolio.html'),
        login: resolve(__dirname, 'public/pages/login.html'),
        signup: resolve(__dirname, 'public/pages/signup.html'),
        support: resolve(__dirname, 'public/pages/support.html')
      }
    }
  }
});