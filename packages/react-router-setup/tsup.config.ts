import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,        
  sourcemap: false,
  clean: true,            
  outDir: 'lib',
  external: [
    'react',
    'react-dom',
    'react-router-dom',
  ],
  treeshake: true,
});
