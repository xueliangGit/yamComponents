/*
 * @Author: xuxueliang
 * @Date: 2019-12-29 17:43:29
 * @LastEditors  : xuxueliang
 * @LastEditTime : 2020-01-16 16:06:01
 */
const prefix = '_sloth_'
var $localStorage = window.localStorage || {
  getItem () {

  },
  setItem (...a) {
  },
  clear () {

  }
}
function get (key) {
  let value = $localStorage.getItem(prefix + key)
  try {
    return JSON.parse(value)
  } catch (e) {
    return value
  }
}
function set (key, value) {
  try {
    $localStorage.setItem(prefix + key, JSON.stringify(value))
  } catch (e) {
    $localStorage.setItem(prefix + key, value)
  }
}
function clear () {
  var i = $localStorage.length
  while (i >= 0) {
    if (~$localStorage.key(i).indexOf(prefix)) {
      rm($localStorage.key(i), true)
    }
    --i
  }
}
function rm (key, ori = false) {
  $localStorage.removeItem(ori ? key : (prefix + key))
}
export {
  rm,
  get,
  set,
  clear
}
export default {
  rm,
  get,
  set,
  clear
}
