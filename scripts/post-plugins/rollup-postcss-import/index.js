/*
 * @Author: xuxueliang
 * @Date: 2020-03-09 19:31:42
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-10 12:00:31
 */
function getEditStr (str, alias, flag) {
  let arr1 = str.split(flag)
  let arr2 = arr1[1].split('/')
  arr2[0] = alias[getAlias(arr2[0])] || arr2[0]
  arr1[1] = arr2.join('/')
  return arr1.join(flag)
}
function getAlias (str) {
  return str.replace(/ /g, ''.replace(/~@/g, '@'))
}
module.exports = function (option = {}) {
  if (!option.alias) {
    option.alias = {}
  }
  return {
    name: 'stylus-pre',
    test: /\.(styl|stylus)$/,
    async process ({ code, ...obj }) {
      console.log('=======stylus-pre=====')
      console.log(obj)
      console.log(this)
      // console.log(code)
      let match1 = code.match(/@import\s+['][^(']*([^')]+)[']/g)
      let match2 = code.match(/@import\s+["][^("]*([^")]+)["]/g)
      match1 && match1.forEach(v => {
        code = code.replace(v, getEditStr(v, option.alias, "'"))
      })
      match2 && match2.forEach(v => {
        code = code.replace(v, getEditStr(v, option.alias, '"'))
      })
      // const style = stylus(code, {
      //   ...this.options,
      //   filename: this.id,
      //   sourcemap: this.sourceMap && {}
      // })

      // const css = await pify(style.render.bind(style))()
      // const deps = style.deps()
      // for (const dep of deps) {
      //   this.dependencies.add(dep)
      // }
      return {
        code: code,
        map: ''
      }
    }
  }
}
