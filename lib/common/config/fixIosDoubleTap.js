/*
 * @Author: xuxueliang
 * @Date: 2020-01-17 15:18:54
 * @LastEditors  : xuxueliang
 * @LastEditTime : 2020-01-17 15:30:56
 */
(function () {
  var agent = navigator.userAgent.toLowerCase() // 检测是否是ios
  var iLastTouch = null // 缓存上一次tap的时间
  if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0) {
    document.body.addEventListener('touchend', function (event) {
      var iNow = new Date()
        .getTime()
      iLastTouch = iLastTouch || iNow + 1 /** 第一次时将iLastTouch设为当前时间+1 */
      var delta = iNow - iLastTouch
      if (delta < 500 && delta > 0) {
        event.preventDefault()
        return false
      }
      iLastTouch = iNow
    }, false)
  }
})()
