/* eslint-disable */
/**
 * Browser.getBrowser() 获取浏览器的信息
 * {
 * isAndroid: isAndroid,
*   isIOS: isIOS,
*   isSafari: isSafari,
*   isQQ: isQQ,
*   isWb: isWb,
*   isWx: isWx,
*   isQZ: isQZ,
*   isAndroidChrome: isAndroidChrome
 * }
 * Browser.getDevice() 获取设备的信息
 * {
 * sw: 屏幕宽度
 * sh: 屏幕高度
 * deviceOs: 平台
 * deviceOp: 版本   
 * }
 * */
let Browser = (function () {
  function Browser () { }
  let browserInfo = null
  let deviceInfo = null
  /**
   * 获取浏览器数据
   */
  Browser.getBrowser = function () {
    if (browserInfo) {
      return browserInfo
    }
    let UA = navigator.userAgent || ''
    let isAndroid = (function () {
      return !!UA.match(/Android/i)
    })()
    let isQQ = (function () {
      return /(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d\.]+)/.test(UA) || /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/.test(UA)
    })()
    let isIOS = (function () {
      return !!UA.match(/iPhone|iPad|iPod/i)
    })()
    let isSafari = (function () {
      return /iPhone|iPad|iPod\/([\w.]+).*(safari).*/i.test(UA)
    })()
    let isWx = (function () {
      return !!UA.match(/micromessenger/i)
    })()
    let isWb = (function () {
      return !!UA.match(/weibo/i)
    })()
    let isAndroidChrome = (function () {
      return (UA.match(/Chrome\/([\d.]+)/) || UA.match(/CriOS\/([\d.]+)/)) && isAndroid && !isQQ
    })()
    let isEryu = (function () {
      return !!UA.match(/eryu\/([\d.]+)/)
    })()
    let isBaoBao = (function () {
      return !!UA.match(/baobao\/([\d.]+)/)
    })()
    let isQZ = (function () {
      return UA.indexOf('Qzone/') !== -1
    })()
    browserInfo = {
      isAndroid: isAndroid,
      isIOS: isIOS,
      isSafari: isSafari,
      isQQ: isQQ,
      isWb: isWb,
      isWx: isWx,
      isQZ: isQZ,
      isAndroidChrome: isAndroidChrome,
      isEryu: isEryu,
      isBaoBao: isBaoBao,
      isEryuAndroid: isEryu && isAndroid,
      isEryuIOS: isEryu && isIOS,
      isBaoBaoAndroid: isBaoBao && isAndroid,
      isBaoBaoIOS: isBaoBao && isIOS,
      isNotInApp: !isQQ && !isWb && !isWx && !isQZ,
      eryuVersion: getEryuVersion() || getBaoBaoVersion(),
      baobaoVersion: getBaoBaoVersion()
    }
    return browserInfo
  }
  Browser.getDevice = function () {
    if (deviceInfo) {
      return deviceInfo
    }
    let UA = navigator.userAgent || ''
    let isAndroid = (function () {
      return !!UA.match(/Android/i) ? 'Android' : ''
    })()
    let isIOS = (function () {
      return !!UA.match(/iPhone|iPad|iPod/i) ? 'iOS' : ''
    })()
    deviceInfo = {
      sw: window.screen.width,
      sh: window.screen.height,
      deviceOs: isAndroid || isIOS || getOS(),
      deviceOp: isAndroid ? get_android_version() : isIOS ? get_ios_version() : '',
    }
    return deviceInfo
  }
  function get_ios_version () {
    var ua = navigator.userAgent.toLowerCase();
    var version = null;
    if (ua.indexOf("like mac os x") > 0) {
      var reg = /os [\d._]+/gi;
      var v_info = ua.match(reg);
      version = (v_info + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, "."); //得到版本号9.3.2或者9.0
      // version = parseInt(version.split('.')[0]); // 得到版本号第一位
    }

    return version;
  }
  function get_android_version () {
    var ua = navigator.userAgent.toLowerCase();
    var version = null;
    if (ua.indexOf("android") > 0) {
      var reg = /android [\d._]+/gi;
      var v_info = ua.match(reg);
      version = (v_info + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, "."); //得到版本号4.2.2
      // version = parseInt(version.split('.')[0]);// 得到版本号第一位
    }

    return version;
  }
  function getOS () {
    var sUserAgent = navigator.userAgent;
    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
    if (isMac) return "Mac";
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    if (isUnix) return "Unix";
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
    if (isLinux) return "Linux";
    if (isWin) {
      var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
      if (isWin2K) return "Win2000";
      var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
      if (isWinXP) return "WinXP";
      var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
      if (isWin2003) return "Win2003";
      var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
      if (isWinVista) return "WinVista";
      var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
      if (isWin7) return "Win7";
      var isWin10 = sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 10") > -1;
      if (isWin10) return "Win10";
    }
    return "other";
  }
  function getEryuVersion () {
    if (navigator.userAgent.indexOf('eryu') > -1) {
      return navigator.userAgent.split('eryu/')[1].split(' ')[0].split(' ')[0]
    }
    return 0
  }
  function getBaoBaoVersion () {
    if (navigator.userAgent.indexOf('baobao') > -1) {
      return navigator.userAgent.split('baobao/')[1].split(' ')[0].split(' ')[0]
    }
    return 0
  }
  return Browser
})()
export default Browser