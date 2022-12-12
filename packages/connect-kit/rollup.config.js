import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import image from '@rollup/plugin-image';
import replace from '@rollup/plugin-replace';
import { terser } from "rollup-plugin-terser";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.module,
        format: "umd",
        sourcemap: true,
        name: "ledgerConnectKit",
      },
    ],
    plugins: [
      resolve({
        preferBuiltins: false
      }),
      commonjs(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true,
      }),
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
