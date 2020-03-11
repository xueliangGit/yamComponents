/*
 * @Author: xuxueliang
 * @Date: 2019-11-04 15:31:41
 * @LastEditors  : zhengguozhi
 * @LastEditTime : 2020-01-15 21:20:36
 */
import { beginTest, endTest, isNoHandle, syncConfig } from './fn'
let isInit = false
// 针对没有绑定的事件
export default function bindFn ($elm) {
  if (isNoHandle || isInit) {
    return
  }
  // 绑定触摸事件
  $elm.addEventListener('touchstart', (e) => {
    // console.log('touchStart--')
    if (!isNoHandle) {
      beginTest(e, true)
    }
  }, false)
  $elm.addEventListener('touchend', (e) => {
    // console.log('touchEnd--')
    if (!isNoHandle) {
      endTest(e, true)
    }
  }, false)
  syncConfig(isInit = true)
}
