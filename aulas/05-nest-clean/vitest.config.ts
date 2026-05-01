import swc from "unplugin-swc";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true,
    root: "./",
  },
  plugins: [
    tsconfigPaths(),
    swc.vite({
      module: { type: "es6" },
    }),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, "./src"),
    },
    tsconfigPaths: true,
  },
});
