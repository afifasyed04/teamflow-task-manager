import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      "teamflow-task-manager-production-328d.up.railway.app"
    ]
  }
});
