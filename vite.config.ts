import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { execSync } from "node:child_process";
import packageJson from "./package.json" with { type: "json" };

const gitSha = (() => {
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "local";
  }
})();

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __BUILD_SHA__: JSON.stringify(gitSha),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  build: {
    sourcemap: false,
    minify: "esbuild",
    assetsInlineLimit: 0,
    rollupOptions: {
      treeshake: true,
      output: {
        generatedCode: "es2015",
      },
    },
  },
  esbuild: {
    legalComments: "none",
    drop: ["debugger"],
    pure: ["console.debug"],
  },
  test: {
    environment: "node",
  },
});
