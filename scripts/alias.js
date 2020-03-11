/*
 * @Author: xuxueliang
 * @Date: 2019-08-13 18:52:29
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-09 14:23:49
 */
const path = require('path')

const resolve = p => path.resolve(__dirname, '../', p)

module.exports = {
  resolve: ['.jsx', '.js', '/index.js'],
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
  compiler: resolve('src/compiler'),
  core: resolve('src/core'),
  shared: resolve('src/shared'),
  web: resolve('src/platforms/web'),
  weex: resolve('src/platforms/weex'),
  server: resolve('src/server'),
  sfc: resolve('src/sfc'),
  lib: resolve('src/lib'),
  '@api': resolve('src/api'),
  '@assets': resolve('src/assets'),
  '@lib': resolve('lib')
  // sfc: resolve('src/sfc')
}
