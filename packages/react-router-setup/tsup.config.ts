import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],  // Output both ESM and CommonJS
  dts: true,               // Generate declaration files
  sourcemap: false,
  clean: true,             // Clean output directory before build
  outDir: 'lib',
  external: [
    'react',
    'react-dom',
    'react-router-dom',
  ],
  treeshake: true,
});
