/*
 * @Author: xuxueliang
 * @Date: 2019-12-31 11:13:07
 * @LastEditors: xuxueliang
 * @LastEditTime: 2019-12-31 11:13:59
 */
// 比较版本号
function toVersionNum (a) {
  // var a = a.toString()
  // 也可以这样写 var c=a.split(/\./);
  var c = ('' + a).split('.')
  var r = ['', '0', '00', '000', '0000'].reverse()
  for (var i = 0; i < c.length; i++) {
    var len = c[i].length
    c[i] = r[len] + c[i]
  }
  return c.join('')
}
export default function isNeedUpdate (ori, target) {
  return toVersionNum(ori) < toVersionNum(target)
}
