/*
 * @Author: xuxueliang
 * @Date: 2019-12-31 11:14:57
 * @LastEditors: xuxueliang
 * @LastEditTime: 2019-12-31 11:15:19
 */
// 初始化 页面隐藏显示事件，仅仅是处理5.1.1以上
import emit from './emit'
function initVisibleChange () {
  var vibibleState = ''
  var visibleChange = ''
  if (typeof document.visibilityState !== 'undefined') {
    visibleChange = 'visibilitychange'

    vibibleState = 'visibilityState'
  } else if (typeof document.webkitVisibilityState !== 'undefined') {
    visibleChange = 'webkitvisibilitychange'

    vibibleState = 'webkitVisibilityState'
  }

  if (visibleChange) {
    document.addEventListener(visibleChange, function () {
      if (document[vibibleState] === 'visible') {
        emit.$emit('pageShow', { webview: false }, true)
      } else {
        emit.$emit('pageHide', { webview: false }, true)
      }
    })
  }
}
initVisibleChange()
