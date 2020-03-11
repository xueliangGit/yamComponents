/*
 * @Author: zhengguozhi
 * @Date: 2019-12-21 16:08:39
 * @LastEditors: zhengguozhi
 * @LastEditTime: 2019-12-21 16:11:26
 */
window.onload = function () {
  if (process.env.NODE_ENV === 'development') {
    return
  }
  /* 页面强转开始 */
  var tmpTag = document.location.protocol !== 'https:'
  if (tmpTag) {
    var urls = window.location.href
    urls = urls.replace('http', 'https')
    window.location = urls
  }
  /* 页面强转结束 */
}
