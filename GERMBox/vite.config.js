import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/GERMBox/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        portfolio: resolve(__dirname, "pages/portfolio.html"),
        login: resolve(__dirname, "pages/login.html"),
        signup: resolve(__dirname, "pages/signup.html"),
        support: resolve(__dirname, "pages/support.html")
      }
    }
  }
});