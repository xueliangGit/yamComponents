/*
 * @Author: xuxueliang
 * @Date: 2018-12-11 18:34:42
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-01-03 20:24:06
 */
let paramCache = {}
let getParam = function (url = '', flag = '?') {
  if (paramCache['Url_' + url]) {
    return paramCache['Url_' + url]
  }
  let u = (url || window.location.href).split(flag)[1]
  if (u) {
    return (paramCache['Url_' + url] = getParmJSON(u))
  } else {
    return {}
  }
}
function getParmJSON (par) {
  let arry = par.split('&')
  let param = {}
  for (let i = 0; i < arry.length; i++) {
    let a = arry[i].split('=')
    param[a[0]] = a[1]
  }
  return param
}
export default getParam
