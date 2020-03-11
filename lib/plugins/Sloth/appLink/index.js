
import Browser from '../Browser'
/**
 * setConfig({openFail:()=>{},andriodUrl,iosUrl,schemaurl})
 * openFail 开始失败回调，返回为 true时，AppLink将继续执行url跳转；返回时false时AppLink停止操作
 * andriodUrl 安卓跳转链接
 * iosUrl ios跳转链接
 * open(url,true) // url 是 app 唤起链接，第二个参数是开启失败是否跳转
 *  */
/**
 * AppLink:H5唤起APP的所有方法
 */
function showGuid () {
  var t = document.createElement('div')
  t.innerHTML = `<div style='position:fixed;left:0;top:0;background:#edebf2 url(http://pws.myhug.cn/npic/s/9/ff583972b39424fe9ebfbfa0ee33302e86c90eb6e61476) no-repeat right top /100% auto;width:100%;height:100%;z-index:10000;'></div>`
  document.body.appendChild(t)
}
var AppLink = (function () {
  /**
   * @param config IAppLink类型的config文件
   * config={
   * androidUrl,iosUrl,schemaUrl
   * }
   */
  function AppLink (config) {
    /**
     * 传入的config数据，以接口约束
     */
    this.UA = navigator.userAgent || ''
    this.config = {}
  }
  /**
   * 跳转函数
   * @param url 链接 isGoUrl 是否去页面
   */
  AppLink.prototype.setConfig = function (config) {
    if (!config.openFail && (!config.androidUrl || !config.iosUrl)) {
      console.warn(`
      提示：
      AppLink 调用必须需要传入 openFail:function 或者 androidUrl（跳转安卓下载链接）， iosUrl（跳转ios下载链接）， schemaUrl(非必传，跳转Appschema，这个是通用的，也可以在open中传入)
      openFail 存在时，打开失败后将不再自动跳转url，全权代理给 openFail；当openFail返回true时再自动跳转；
      final函数不管打开成功还是失败都会执行
      `)
      return
    }
    this.config = config || {}
  }
  /**
   * 跳转函数
   * @param url 链接 isGoUrl 是否去页面
   */
  AppLink.prototype.go = function (url, isGoUrl) {
    isGoUrl && (url ? window.location.href = url : console.warn(`
      没有传入安卓/ios下载的Url
      `))
  }
  /**
   * 检查是否唤起
   * @param cb 回调函数
   */
  AppLink.prototype.checkOpen = function (cb) {
    var browser = Browser.getBrowser()
    var inter = null
    var statue = false
    var count = (browser.isWb || browser.isWx) ? 50 : 0
    inter = window.setInterval(function () {
      count++
      statue = document.hidden || document.webkitHidden
      if (statue || count > 60) {
        cb(statue)
        clearInterval(inter)
      }
    }, 50)
  }
  /**
   * 外部调用的入口函数
   */
  AppLink.prototype.open = function (url, isGoUrl = true) {
    if (isGoUrl && !this.config.openFail && (!this.config.androidUrl || !this.config.iosUrl)) {
      console.warn(`
      请先运行 setConfig 函数
      `)
      this.config.openFail && this.config.openFail()
      return
    }
    if (!url && !this.config.schemaUrl) {
      console.warn(`
      没有可用的 schemaUrl 
      `)
      this.config.openFail && this.config.openFail()
      return
    }
    var browser = Browser.getBrowser()
    var schemaUrl = url || this.config.schemaUrl
    // 微信直接跳 应用宝
    if (browser.isWx) {
      if (isGoUrl) {
        this.openOrGoUrl(schemaUrl, browser.isIOS ? this.config.iosUrl : this.config.androidUrl, isGoUrl)
        // showGuid()
      }
    } else if (browser.isQQ) {
      if (browser.isIOS) {
        // 使用scheme唤起
        this.openOrGoUrl(schemaUrl, this.config.iosUrl, isGoUrl)
      }
      // iOS跳到iosUrl
      if (browser.isAndroid) {
        this.openOrGoUrl(schemaUrl, this.config.androidUrl, isGoUrl)
      }
    } else if (browser.isWb) {
      // 使用scheme唤起
      showGuid()
      // this.openOrGoUrl(schemaUrl, browser.isIOS ? this.config.iosUrl : this.config.androidUrl, isGoUrl)
      // 微博：唤起失败，也不跳转，会有引导功能
    } else if (browser.isSafari) {
      var version = this.getIOSVersion()
      // iOS10以下不支持直接跳转到iosUrl，跳到应用宝
      this.openOrGoUrl(schemaUrl, version < 10 ? this.config.androidUrl : this.config.iosUrl, isGoUrl)
    } else {
      this.openOrGoUrl(schemaUrl, this.config.androidUrl, isGoUrl)
      // 其他情况，直接跳应用宝
      // this.go(this.config.androidUrl,isGoUrl)
    }
  }
  /**
   * 下载按钮的url地址
   */
  AppLink.prototype.getDownloadUrl = function () {
    var browser = Browser.getBrowser()
    // var config = this.config
    var url = ''
    if (browser.isQQ) {
      if (browser.isIOS) {
        url = this.config.iosUrl
      } else {
        url = this.config.androidUrl
      }
    } else if (browser.isSafari) {
      var version = this.getIOSVersion()
      if (version < 10) {
        url = this.config.androidUrl
      } else {
        url = this.config.iosUrl
      }
    } else if (browser.isWb) {
      url = ''
    } else {
      url = this.config.androidUrl
    }
    return url
  }
  /**
   * 尝试唤起APP
   * @param scheme 唤起的scheme
   */
  AppLink.prototype.tryCallApp = function (scheme) {
    var aLink = document.createElement('a')
    var body = document.body
    aLink.href = scheme
    body.appendChild(aLink)
    aLink.click()
  }
  /**
   * 判断iOS版本
   */
  AppLink.prototype.getIOSVersion = function () {
    var ver = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
    var version = parseInt(ver[1], 10)
    return version
  }
  /**
   * 尝试open失败就跳转
   */
  AppLink.prototype.openOrGoUrl = function (schemaUrl, url, isGoUrl) {
    var _this = this
    // 使用scheme唤起
    this.tryCallApp(schemaUrl)
    // 没有下载
    var oldTime = +new Date()
    this.checkOpen((isSuccess) => {
      // console.log('AppLink', isSuccess, +new Date() - oldTime, (+new Date() - oldTime > 50 * 50))
      if (!isSuccess && (+new Date() - oldTime < 70 * 50)) {
        if (!this.config.openFail || (this.config.openFail && this.config.openFail())) {
          _this.go(url, isGoUrl)
          this.config.final && this.config.final()
        }
      } else {
        this.config.final && this.config.final()
      }
    })
  }
  return AppLink
})()

export default new AppLink()
