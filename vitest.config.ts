import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/__tests__/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mock*/**",
      ],
    },
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],
  },
  resolve: {
    alias: {
      "@game": path.resolve(__dirname, "./src/features/game"),
      "@tutorial": path.resolve(__dirname, "./src/features/tutorial"),
      "@ai": path.resolve(__dirname, "./src/features/ai"),
      "@ui": path.resolve(__dirname, "./src/features/ui"),
      "@shared": path.resolve(__dirname, "./src/shared"),
    },
  },
});
