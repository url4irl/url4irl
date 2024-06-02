import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["lib/index.ts"],
  skipNodeModulesBundle: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
});
