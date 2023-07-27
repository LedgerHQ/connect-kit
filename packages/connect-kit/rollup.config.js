import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import image from '@rollup/plugin-image';
import replace from '@rollup/plugin-replace';
import { terser } from "rollup-plugin-terser";
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import dotenv from "rollup-plugin-dotenv"

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        exports: "named",
        file: packageJson.main,
        format: "umd",
        inlineDynamicImports: true,
        name: "ledgerConnectKit",
        sourcemap: true,
      },
    ],
    plugins: [
      dotenv(),
      resolve({
        preferBuiltins: false,
        browser: true,
      }),
      commonjs({
        transformMixedEsModules: true,
      }),
      nodePolyfills(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true,
      }),
      json(),
      typescript({ tsconfig: "./tsconfig.json" }),
      image(),
      terser(),
    ],
  },
  {
    input: "dist/umd/index.d.ts",
    output: [{ file: "dist/umd/index.d.ts", format: "umd", }],
    plugins: [dts()],
  },
];