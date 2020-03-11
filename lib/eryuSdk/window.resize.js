/*
 * @Author: xuxueliang
 * @Date: 2020-01-13 20:00:48
 * @LastEditors  : xuxueliang
 * @LastEditTime : 2020-01-13 21:22:57
 */
import { throttle } from '@lib/common/config/mUtils.js'// throttle
import emit from './emit'
emit.$emit('window.resize', {}, true)
function windowResize () {
  emit.$emit('window.resize')
}
window.addEventListener('resize', () => {
  throttle(windowResize)
}, false)
console.log('windowResize is init')
