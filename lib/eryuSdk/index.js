/*
 * @Author: xuxueliang
 * @Date: 2019-11-06 17:39:22
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-02 15:35:18
 */
import { $on, $emit, $onSigle } from './emit'
import Browser from '@lib/plugins/Sloth/Browser'
import getParam from '@lib/plugins/Sloth/getParam'
import { getCookie, delCookie, setCookie } from '@lib/common/config/mUtils.js'// throttle
import isNeedUpdate from './checkVersion'
import { toApp, openPage, setQueryFlag } from './app&jsOP.js'
// 注册web页面显示隐藏事件 安卓5.1 检测失效
const initVisibleChange = () => {
  import('./webVisibleChange').then()
}
// 注册尺寸变化事件
const initWindowSizeChange = () => import('./window.resize')
// function initThrottle (fn, ...params) {
//   // 截流 延时200
//   throttle(fn, { time: 200, args: params })
// }
let browser = Browser.getBrowser()
window.eryuEmit = {
  $emit
}
// console.log(emit)
// 导出的信息
const { isAndroid, isIOS, isEryu, isBaoBao, isEryuAndroid, isEryuIOS, isBaoBaoIOS, isBaoBaoAndroid } = browser
const appVersion = browser.eryuVersion || browser.baobaoVersion
const navtiveInjectParam = window[isEryu ? 'eryu' : 'baobao'] || {}
// 获取UID
let urlParam = Object.assign({}, getParam('', '#'), getParam())
function getUId (flag = 'uId') {
  return new Promise((resolve, reject) => {
    let uId = navtiveInjectParam.uId || urlParam[flag] || getCookie(flag)
    if (uId) {
      delCookie('istry')
      let obj = {}
      obj[flag] = uId
      obj[flag + 'From'] = navtiveInjectParam.uId ? 'navtiveInjectParam' : urlParam[flag] ? 'url' : 'cookie'
      resolve(obj)
    } else {
      if (flag === 'uId') {
        if (getCookie('istry')) {
          delCookie('istry')
          reject(new Error('get  uid error'))
        } else {
          setCookie('istry', '1')
          setTimeout(() => {
            window.location.replace(window.location.href)
          }, 1500)
        }
      } else {
        reject(new Error(`get  ${ flag } error`))
      }
    }
  })
}
const isOldVersion = v => {
  return isNeedUpdate(appVersion, v)
}

// 安全距离 再吸底时使用的
// safe height
var isIPhoneX = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && window.screen.height === 812
// iPhone XS Max
var isIPhoneXSMax = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 414 && window.screen.height === 896
// iPhone XR
var isIPhoneXR = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896
const safeHeight = (isIPhoneX || isIPhoneXSMax || isIPhoneXR) ? 24 : 0
let MoblieType = window.navigator.userAgent.split('MoblieType/')[1]
if (MoblieType) {
  // 新的ios
  MoblieType = MoblieType.split(' eryu')[0]
}
export {
  isEryu,
  isBaoBao,
  isEryuAndroid,
  isEryuIOS,
  isBaoBaoAndroid,
  isBaoBaoIOS,
  isAndroid,
  isIOS,
  appVersion,
  // uId,
  // uIdFrom,
  urlParam,
  isOldVersion,
  toApp,
  openPage,
  $emit,
  $on,
  $onSigle,
  getUId,
  safeHeight,
  initVisibleChange,
  setQueryFlag,
  initWindowSizeChange,
  navtiveInjectParam,
  MoblieType
}
