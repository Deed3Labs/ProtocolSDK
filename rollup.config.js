import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';

const packageJson = require('./package.json');

const external = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {})
];

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        name: 'ProtocolSDK'
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true
      }
    ],
    external,
    plugins: [
      resolve(),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false
      }),
      terser()
    ]
  },
  {
    input: 'src/index.ts',
    output: [{ file: packageJson.types, format: 'esm' }],
    plugins: [dts()],
    external
  }
]; 