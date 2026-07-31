import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  // GitHub Pages 部署需要设置 base 为仓库名
  base: "/lyra_10/",
});
