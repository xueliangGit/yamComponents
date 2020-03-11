/*
 * @Author: xuxueliang
 * @Date: 2020-01-20 12:47:33
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-02-20 17:41:47
 */
import Browser from '@lib/plugins/Sloth/Browser'
import isNeedUpdate from './checkVersion'

let queryFlag = window.queryFlag = '?'
let browser = Browser.getBrowser()
let appName = 'eryu'
let { isBaoBao, isAndroid, isEryu, eryuVersion, baobaoVersion } = browser// ,
appName = isBaoBao ? 'baobao' : appName
const appSchemaPrefix = appName + '://jump#'
function _run_ (name, ...params) {
  if (browser.isEryu) {
    appFn[name](...params)
  } else {
    jsFn[name](...params)
  }
}
let toAppUrls = ''
// 执行app方法
function _schema_ (url) {
  if (typeof url === 'object') {
    url = appSchemaPrefix + JSON.stringify(url)
  }
  if (toAppUrls.indexOf(url) > -1) {
    return
  }
  toAppUrls += url + ','
  setTimeout(() => {
    toAppUrls = toAppUrls.replace(url + ',', '')
  }, 500)
  window.dataRecord && window.dataRecord.push({
    type: 'toApp',
    times: new Date(),
    schema: url
  })
  console.log(url, toAppUrls)
  // 耳觅1.9.0 开启iframe传值
  if (isAndroid || (isEryu && !isNeedUpdate(eryuVersion, '1.9.0')) || (isBaoBao && !isNeedUpdate(baobaoVersion, '8.5.0'))) {
    let iframe = document.createElement('iframe')
    iframe.src = url
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    window.setTimeout(function () {
      document.body.removeChild(iframe)
    }, 3000)
  } else {
    window.location.assign(url)
  }
}
let appFn = {
  openPage (url, params = {}, isFullScreen = true, obj = {}) { // isReload = false isSoundTest  :true
    let str = Object.assign({ type: 'url', url: getUrl(url) + meger(params), isFullScreen: !!isFullScreen }, obj)
    _schema_(str)
  }
}
// js方法
let jsFn = {
  openPage (url, params = {}, isFullScreen) {
    window.location = getUrl(url) + meger(params)
  }
}
// 获取url
function getUrl (url) {
  if (url[0] === '/') {
    return window.location.origin + url
  }
  if (url[0] === '.' && url[1] === '/') {
    url = url.substr(2)
  }
  let href
  if (url.indexOf('http') === 0) {
  } else {
    href = window.location.href.split('/')
    href.splice(-1, 1, url)
  }

  return href ? href.join('/') : url
}
// 合并参数
function meger (arg) {
  let str = Object.keys(arg).map(v => `${ v }=${ arg[v] }`).join('&')
  return str ? queryFlag + str : ''
}
const setQueryFlag = (flag = '?') => {
  queryFlag = flag
  window.queryFlag = flag
  if (flag === '#') {
    window.onhashchange = (e) => {
      console.log('oldURL:', e.oldURL)
      console.log('newURL:', e.newURL)
      window.location.reload()
    }
  }
}
const toApp = uri => {
  _schema_(uri)
}
const openPage = (...arg) => {
  _run_('openPage', ...arg)
}

export {
  toApp, openPage, setQueryFlag
}
