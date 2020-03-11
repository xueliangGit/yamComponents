/*
 * @Author: xuxueliang
 * @Date: 2020-03-11 10:51:25
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-11 16:51:04
 */
// let isReadey = false
let path = require('path')
module.exports = function (context, jsPath) {
  // if (isReadey) {
  //   return context
  // }
  // isReadey = true
  let hotPath = path.resolve(__dirname, './hot.reload.js') // path.relative(jsPath, path.join(__dirname, './hot.reload.js'))
  // 'if (module.hot) {(function () {\n'
  // '  var hotAPI = require("'  hotReloadAPIPath  '")\n'
  // '  hotAPI.install(require("vue"), false)\n'
  // '  if (!hotAPI.compatible) return\n'
  // '  module.hot.accept()\n'
  // '  if (!module.hot.data) {\n'
  // // initial insert
  // '    hotAPI.createRecord("'  moduleId  '", Component.options)\n'
  // '  } else {\n'
  context += `
  \n/* yamjs hot reload */\n
  if (module.hot) {
    // 实现热更新
    var hotAPI = require('${ hotPath }')
    hotAPI.install(Yam,App)
    module.hot.accept();
    console.log(hotAPI)
    }
  `
  return context
}
