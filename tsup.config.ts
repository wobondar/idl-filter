import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  external: ["commander"],
  format: ["esm"],
  target: "node20",
  outDir: "dist",
  splitting: false,
  clean: true,
  dts: false,
  minify: false,
  shims: true,
  esbuildOptions(options) {
    options.legalComments = "inline";
  },
  banner: {
    js: "#!/usr/bin/env node",
  },
});
