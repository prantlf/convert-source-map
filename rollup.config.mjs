import cleanup from 'rollup-plugin-cleanup';
import { minify } from 'rollup-plugin-swc-minify'

export default {
  input: 'lib/index.js',
  output: [
    {
      file: 'lib/index.cjs',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: 'lib/index.mjs',
      sourcemap: true
    },
    {
      file: 'lib/index.umd.js',
      format: 'umd',
      name: 'convertSourceMap',
      sourcemap: true
    },
    {
      file: 'lib/index.umd.min.js',
      format: 'umd',
      name: 'convertSourceMap',
      sourcemap: true,
      plugins: [minify()]
    }
  ],
  plugins: [cleanup()]
}
