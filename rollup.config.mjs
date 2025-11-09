import cleanup from 'rollup-plugin-cleanup';
import { minify } from 'rollup-plugin-swc-minify'

export default {
  input: 'lib/index.js',
  output: [
    {
      file: 'lib/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: 'lib/index.mjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: 'lib/index.umd.js',
      format: 'umd',
      name: 'convertSourceMap',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: 'lib/index.umd.min.js',
      format: 'umd',
      name: 'convertSourceMap',
      sourcemap: true,
      exports: 'named',
      plugins: [minify()]
    }
  ],
  plugins: [cleanup()]
}
