/*
 * @Author: xuxueliang
 * @Date: 2019-11-04 15:32:46
 * @LastEditors  : xuxueliang
 * @LastEditTime : 2020-01-17 15:38:46
 */
import Toast from '@lib/plugins/Sloth/Toast'
import { loadVConsole } from '@lib/common/config/mUtils'
window.queryFlag = window.queryFlag || '?'
let l = 40
const isDebuging = window.location.href.indexOf('__ISCONSOLE__') > -1
const isTesting = window.location.href.indexOf('h5Test') > -1
let isByDefined = false
let toUrl = {
  test: '',
  debug: ''
  // 可以是方法，也可以是字符串，
}
export const isNoHandle = isTesting && isDebuging
var testTouch = {
  isSure: 0,
  startX: 0,
  startY: 0
}
export function beginTest (e, byDefined) {
  if (isNoHandle || (isByDefined && !byDefined)) {
    return
  }
  let { clientX, clientY } = e.changedTouches[0]
  testTouch.startX = clientX
  testTouch.startY = clientY
}
export function endTest (e, byDefined) {
  if (isNoHandle || (isByDefined && !byDefined)) {
    return
  }
  let { clientX, clientY } = e.changedTouches[0]
  // 右滑 ->下滑-》左滑 进 调试
  // 右滑 ->上滑-》左滑 进 测试页面
  // 右滑->上滑->下滑->左滑 进demo页
  if (clientX - testTouch.startX > 156 && Math.abs(clientY - testTouch.startY) < l) {
    // 左滑
    testTouch.isSure = 1
  } else if (clientY - testTouch.startY > 156 && Math.abs(clientX - testTouch.startX) < l) {
    // 下滑
    if (testTouch.isSure === 1) {
      // 调试滑动
      testTouch.isSure = 2
    } else if (testTouch.isSure === 3) {
      // 去demo页面
      testTouch.isSure = 4
    } else {
      testTouch.isSure = 0
    }
  } else if (testTouch.startY - clientY > 156 && Math.abs(clientX - testTouch.startX) < l) {
    // 上滑
    if (testTouch.isSure === 1) {
      // 测试页面滑动
      testTouch.isSure = 3
    } else {
      testTouch.isSure = 0
    }
  } else if (testTouch.startX - clientX > 156 && Math.abs(clientY - testTouch.startY) < l) {
    // 右滑
    if (testTouch.isSure === 2) {
      // 跳调试
      // console.log('触发调试')
      if (!isDebuging) {
        Toast.showShortCenter('即将打开调试，请稍等', 'warn', 3000)
        setTimeout(() => {
          if (toUrl.debug) {
            toUrlFn('debug')
          } else {
            if (window.location.href.indexOf(window.queryFlag) > -1) {
              let str = window.location.href.split(window.queryFlag)
              window.location.href = str[0] + window.queryFlag + '__ISCONSOLE__=true&' + str[1]
            } else {
              window.location.href = window.location.href + window.queryFlag + '__ISCONSOLE__=true'
            }
            setTimeout(() => {
              console.log(loadVConsole)
              loadVConsole()
            }, 200)
          }
        }, 2000)
      }
    } else if (testTouch.isSure === 3) {
      // 跳测试地址
      if (process.env.NODE_ENV !== 'development' && !isTesting) {
        Toast.showShortCenter('即将跳转测试网址', 'warn', 3000)
        setTimeout(() => {
          if (toUrl.test) {
            toUrlFn('test')
          } else {
            window.location.href = window.location.href.replace('wap/web/', 'wap/web/h5Test/')
          }

          // window.location.href = window.location.href.replace('h5Test', '')
        }, 2000)
      }
    } else if (testTouch.isSure === 4) {
      // 跳demo页
      window.location.href = 'https://ey.myhug.cn/wap/web/demo/index.html'
    }
    testTouch.isSure = 0
  } else {
    testTouch.isSure = 0
  }
  console.log(testTouch.isSure)
}
export function syncConfig (isByDefinedFlag) {
  isByDefined = isByDefinedFlag
}

export function setUrl (Obj) {
  Object.assign(toUrl, Obj)
}

function toUrlFn (params) {
  if (typeof toUrl[params] === 'function') {
    toUrl[params](window.location.href)
  } else {
    window.location.href = toUrl[params]
  }
}
