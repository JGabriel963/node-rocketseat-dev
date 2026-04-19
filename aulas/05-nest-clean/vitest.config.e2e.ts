import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

export default defineConfig({
  test: {
    include: ["**/*.e2e-spec.ts"],
    globals: true,
    root: "./",
  },
  plugins: [
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
