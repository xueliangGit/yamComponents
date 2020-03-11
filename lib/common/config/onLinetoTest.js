/*
 * @Author: xuxueliang
 * @Date: 2019-10-29 19:23:44
 * @LastEditors: xuxueliang
 * @LastEditTime: 2019-10-30 13:05:32
 */
// import Toast from '../../plugins/Sloth/Toast'
export default function (basePost) {
  if (process.env.NODE_ENV !== 'development' && window.location.href.indexOf('__ISTEST__') < 0 && window.location.href.indexOf('h5Test') < 0) {
    // if ((process.env.NODE_ENV !== 'development' && window.location.href.indexOf('__ISTEST__') < 0 && window.location.href.indexOf('web/share') < 0) && window.location.href.indexOf('h5Test') > -1) {
    // basePost('https://192.168.2.175/getApi?domain=test&api=/test', {}).then(res => {
    //   console.log(res)
    //   if (res.isTest) {
    //     Toast.showShortCenter('检测到您处于本地局域网网络，并且可能正在测试本项目，将3秒后自动跳转到本项目的测试地址，若已经测试没问题；联系H5负责人上线项目', 'warn', 4000)
    //     setTimeout(() => {
    //       window.location.href = window.location.href.replace('wap/web/', 'wap/web/h5Test/')
    //       // window.location.href = window.location.href.replace('h5Test', '')
    //     }, 4000)
    //   }
    // }).catch(res => { })
  }
}
