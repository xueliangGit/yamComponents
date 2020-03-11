/*
 * @Author: xuxueliang
 * @Date: 2019-11-04 15:32:46
 * @LastEditors  : xuxueliang
 * @LastEditTime : 2020-01-06 20:03:47
 */
function gesture ($elm) {
  var l = 40
  var isDebuging = window.location.href.indexOf('__ISCONSOLE__') > -1
  var isTesting = window.location.href.indexOf('h5Test') > -1
  var isByDefined = false
  var toUrl = {
    test: '',
    debug: ''
    // 可以是方法，也可以是字符串，
  }
  var isNoHandle = isTesting && isDebuging
  var testTouch = {
    isSure: 0,
    startX: 0,
    startY: 0
  }
  function beginTest (e, byDefined) {
    if (isNoHandle || (isByDefined && !byDefined)) {
      return
    }
    testTouch.startX = e.changedTouches[0].clientX
    testTouch.startY = e.changedTouches[0].clientY
  }
  function endTest (e, byDefined) {
    if (isNoHandle || (isByDefined && !byDefined)) {
      return
    }
    var clientX = e.changedTouches[0].clientX
    var clientY = e.changedTouches[0].clientY
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
          // Toast.showShortCenter('即将打开调试，请稍等', 'warn', 3000)
          setTimeout(() => {
            if (toUrl.debug) {
              toUrlFn('debug')
            } else {
              if (window.location.href.indexOf('?') > -1) {
                var str = window.location.href.split('?')
                window.location.href = str[0] + '?__ISCONSOLE__=true&' + str[1]
              } else {
                window.location.href = window.location.href + '?__ISCONSOLE__=true'
              }
            }
          }, 100)
        }
      } else if (testTouch.isSure === 3) {
        // 跳测试地址
        if (!isTesting) {
          // Toast.showShortCenter('即将跳转测试网址', 'warn', 3000)
          setTimeout(() => {
            if (toUrl.test) {
              toUrlFn('test')
            } else {
              window.location.href = window.location.href.replace('wap/web/', 'wap/web/h5Test/')
            }
            // window.location.href = window.location.href.replace('h5Test', '')
          }, 100)
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
  function syncConfig (isByDefined) {
    isByDefined = true
  }

  function setUrl (Obj) {
    Object.assign(toUrl, Obj)
  }

  function toUrlFn (params) {
    if (typeof toUrl[params] === 'function') {
      toUrl[params](window.location.href)
    } else {
      window.location.href = toUrl[params]
    }
  }
  var isInit = false
  function bindFn ($elm) {
    if (isNoHandle || isInit) {
      return
    }
    // 绑定触摸事件
    $elm.addEventListener('touchstart', (e) => {
      if (!isNoHandle) {
        beginTest(e, true)
      }
    }, false)
    $elm.addEventListener('touchend', (e) => {
      if (!isNoHandle) {
        endTest(e, true)
      }
    }, false)
    syncConfig(isInit = true)
  }
  if ($elm) {
    bindFn($elm)
  }
  return {
    setUrl: setUrl,
    bindFn: bindFn
  }
}
