import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import ts from "rollup-plugin-typescript2";

export default {
  input: "./src/Threejs/index.ts", // 入口文件
  output: {
    file: "./lib/index.js", // 出口文件
    name: "index", // 出口文件
    format: "es", // 输出的模块语法格式
  },
  plugins: [ts(), resolve(), commonjs()],
  external: ["three", "axios", "@types/three"],
};
