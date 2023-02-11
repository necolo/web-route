import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
// import peerDeps from 'rollup-plugin-peer-deps-external';
import json from '@rollup/plugin-json';
import pkg from './package.json' assert { type: 'json' };

const isExternal = id => !id.startsWith('.') && !id.startsWith('/');

export default {
  input: pkg.source,
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  output: [
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    // peerDeps(),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
    resolve(),
    commonjs(),
    json(),
  ],
}