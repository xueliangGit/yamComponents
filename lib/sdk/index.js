/*
 * @Author: xuxueliang
 * @Date: 2018-12-12 11:33:02
 * @LastEditors  : xuxueliang
 * @LastEditTime : 2020-02-01 16:27:16
 */

import $myEmit from './emit'
import xcxFn from './xcxFn'
import jsFn from './jsFn'
/*
小程序交互，安卓交互，ios交互  =>SDK
*/
let callFncache = [] // 运行函数的缓存
let isReady = false // 初始化状态
let callFncacheIsRuning = false // 是否有正在运行的函数
let isMiniProgram = false
let wx = window['wx'] || {}
let browser = {
  versions: (function () {
    let u = navigator.userAgent
    let app = navigator.appVersion
    return {// 移动终端浏览器版本信息
      app: app,
      trident: u.indexOf('Trident') > -1, // IE内核
      presto: u.indexOf('Presto') > -1, // opera内核
      webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
      iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, // 是否iPad
      webApp: u.indexOf('Safari') === -1 // 是否web应该程序，没有头部与底部
    }
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
function runCallFncache () {
  // console.log('callFncache', [].concat(callFncache))
  if (callFncache[0]) {
    callFncacheIsRuning = true
    callFncache[0]()
    callFncache.splice(0, 1)
    runCallFncache()
  } else {
    callFncacheIsRuning = false
  }
}
function inieEnv () {
  var ua = window.navigator.userAgent.toLowerCase()
  // console.log('ua', ua, ua.match(/MicroMessenger/i) === 'micromessenger')
  if ((ua.match(/MicroMessenger/i) + '') === 'micromessenger' && wx.miniProgram) { // 判断是否是微信环境
    // 微信环境
    wx.miniProgram.getEnv(function (res) {
      if (res.miniprogram) {
        // 小程序环境下逻辑
        isMiniProgram = true
      } else {
        isMiniProgram = false
        // 非小程序环境下逻辑
      }
      isReadyFn()
    })
  } else {
    isReadyFn()
  }
}
function isReadyFn () {
  console.log('isMiniProgram', isMiniProgram)
  isReady = true
  runCallFncache()
}
window['e_cache'] = window['e_cache'] || []
function cacheRunFn (funName, parameter) {
  try {
    console.log(funName)
    if (window['webkit'] && window['webkit'].messageHandlers[funName]) { // ios
      window['webkit'].messageHandlers[funName].postMessage(parameter || '')
    } else if (window['android'] && window['android'][funName]) {
      window['android'][funName](parameter || '')
    } else if (isMiniProgram && xcxFn[funName]) {
      xcxFn[funName](parameter)
    } else if (jsFn[funName]) {
      jsFn[funName](parameter)
    } else {
      throw Error(`Bridge 没有 ${ funName } 方法，请补充后再使用`)
    }
  } catch (e) {
    window['e_cache'].push(e)
    console.warn(e)
  }
}
function runFn (funName, parameter) {
  callFncache.push(cacheRunFn.bind(this, funName, parameter))
  if (isReady) {
    if (!callFncacheIsRuning) {
      runCallFncache()
    }
  }
}
class Bridge {
  constructor () {
    this.isInited = false
    this.browser = browser
    console.log('Bridge is running')
    inieEnv()
  }
  setConfig (config = { name: 'xsb' }) {
    jsFn.initConfig(config)
    xcxFn.initConfig(config)
    this.isInited = true
  }
  getNative (type, times) {
    return new Promise((resolve, reject) => {
      $myEmit.$on(type, resolve, times || false)
      runFn('getNative', type)
    })
  }
  emit (fnName, param) {
    if (!this.isInited) {
      window && window['console'] && window['console']['warn'] && window.console.warn('SDK未init，将自动使用默认配置进行init')
      this.setConfig()
    }
    runFn(fnName, param)
  }
}
export default new Bridge()
