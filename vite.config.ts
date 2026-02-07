import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@game": path.resolve(__dirname, "src/features/game"),
      "@tutorial": path.resolve(__dirname, "src/features/tutorial"),
      "@ai": path.resolve(__dirname, "src/features/ai"),
      "@ui": path.resolve(__dirname, "src/features/ui"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },
  server: {
    fs: {
      allow: [
        // Allow serving files from the project root
        path.resolve(__dirname),
        // Allow serving files from node_modules/stockfish
        path.resolve(__dirname, "node_modules/stockfish"),
      ],
    },
  },
  optimizeDeps: {
    exclude: ["stockfish"],
  },
});
