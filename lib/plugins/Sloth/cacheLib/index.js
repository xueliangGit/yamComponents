/*
 * @Author: xuxueliang
 * @Date: 2018-12-12 17:51:59
 * @LastEditors  : xuxueliang
 * @LastEditTime : 2020-01-07 15:14:16
 */
// import Bridge from '../../../sdk'
// import Runing from '../../../sdk/emit'
import Toast from '../Toast'
window['isoffline'] = !navigator.onLine
if (window.applicationCache) {
  console.info('缓存可用')
  // window.applicationCache.oncached = function (e) {
  //   console.info('缓存成功');
  //   console.info(e);
  // }
  window.applicationCache.onchecking = function (e) {
    console.info('检查中')
    // console.info(e);
  }
  window.applicationCache.ondownloading = function (e) {
    console.info('下载中')
    // Bridge.showStr('有更新内容更新，即将体验')
    // console.info(e);
  }
  window.applicationCache.onnoupdate = function (e) {
    console.info('没有更新内容')
    // console.info(e);
  }
  window.applicationCache.addEventListener('progress', function (e) {
    console.info('更新过程中,已经加载了:' + e.loaded + ',总共：' + e.total)
    console.info('更新过程中,已经加载了:' + e.loaded / e.total * 100 + '%')
    console.info(e)
  }, false)
  window.applicationCache.onupdateready = function (e) {
    console.info('更新成功')
    // console.info(e);
    Toast.showShortCenter('数据更新成功')
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }
}
// Runing.regist('offline', function () {
//   Bridge.showStr('网络连接错误，请检查您的网络')
// })
// Runing.regist('online', function () {
//   Bridge.showStr('网络连接恢复')
// })
// window.addEventListener('offline', function () {
//   console.log('offline')
//   window['isoffline'] = true
//   Runing.fire('offline')
// })
// if (!navigator.onLine) {
//   Runing.fire('offline')
// }
// window.addEventListener('online', function () {
//   console.log('online')
//   window['isoffline'] = false
//   Runing.fire('online')
// })
