/*
 * @Author: xuxuelaing
 * @Date: 2019-01-17 18:57:02
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-02-20 15:10:13
 */
/* eslint-disable */
/**
 * 存储localStorage
 */
import { rootValue } from '@app/project'
import getParam from '@lib/plugins/Sloth/getParam'

export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
}

/**
 * 存储cookie
 */
export const setCookie = (objName, objValue, objHours = 30) => {
  var str = objName + "=" + escape(objValue);
  if (objHours != null) {
    var date = new Date();
    var ms = objHours * 3600 * 1000 * 24;
    date.setTime(date.getTime() + ms);
    str += "; expires=" + date.toGMTString();
  }
  document.cookie = str;
}
// 储存
export const setCookieCurrentDay = (objName, objValue) => {
  var str = objName + "=" + escape(objValue);
  var date = new Date();
  var newdate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  str += "; expires=" + newdate.toGMTString();
  document.cookie = str;
}
/**
 * 获取cookie
 */
export const getCookie = (name) => {
  let arr = []
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null
}
/**
 * 删除cookie
 */
export const delCookie = (name) => {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null) {
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  }
}
/**
 * 删除所有cookie
 */
export const clearCookie = () => {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
    for (var i = keys.length; i--;) {
      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
  }
}
export const hasClass = (obj, cls) => {
  return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

export const addClass = (obj, cls) => {
  if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}

export const removeClass = (obj, cls) => {
  if (hasClass(obj, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    obj.className = obj.className.replace(reg, ' ');
  }
}
// 获取元素据顶部的距离
export const getPoint = (obj) => {
  let t = obj.offsetTop
  obj = obj.offsetParent
  while (obj) {
    t += obj.offsetTop
    obj = obj.offsetParent
  }
  return t
}
// px 转 rem
export const pxToRem = (num = '0', rv) => {
  num = num.toString()
  if (num.indexOf('rem') > -1) {
    return num
  }
  rv = rv || rootValue || 750
  let nums = +(num + '').split('px')[0]
  return nums / rv * 10 + 'rem'
}
// px 转 px
export const pxTopx = (num = '0', rv) => {
  num = num.toString()
  if (num.indexOf('rem') > -1) {
    return num
  }
  rv = rv || rootValue || 750
  let nums = +(num + '').split('px')[0]
  return nums / rv * 10 * window.rem
}
// 节流器
export const throttle = function () {
  let isClear = arguments[0]
  let fn
  if (typeof isClear === 'boolean') {
    fn = arguments[1]
    fn.__throttleID && clearTimeout(fn.__throttleID)
  } else {
    fn = isClear
    let param = arguments[1]
    var p = Object.assign({
      context: null,
      args: [],
      time: 300
    }, param)
    throttle(true, fn)
    fn.__throttleID = setTimeout(function () {
      fn.apply(p.context, p.args)
    }, p.time)
  }
}
const ua = navigator.userAgent
export const browser = {
  ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
  android: ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1,
  weixin: ua.match(/MicroMessenger\/[0-9]/i) ? true : false,
  qq: ua.match(/QQ\/[0-9]/i) ? true : false,
  weibo: ua.match(/WeiBo/i) ? true : false
}
const _backType = (o) => {
  let nowType = Object.prototype.toString.call(o)
  if (nowType == '[object Number]') return 'number'
  if (nowType == '[object String]') return 'string'
  if (nowType == '[object Array]') return 'array'
  if (nowType == '[object Object]') return 'object'
  if (nowType == '[object Function]') return 'function'
  if (nowType == '[object Null]') return 'null'
  if (nowType == '[object Undefined]') return 'undefined'
}
// 判断类型
export const isType = (o, t = null) => {
  let typeStr = _backType(o)
  if (!t) {
    return typeStr
  } else {
    return typeStr === t
  }
}

// 时间格式化 formatDate（date ,'yyyy-MM-dd hh:mm:ss'）
export const formatDate = function (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  var o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (var k in o) {
    if (new RegExp(`(${ k })`).test(fmt)) {
      var str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      )
    }
  }
  return fmt
}
function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}
export function getUId () {
  return new Promise((resolve, reject) => {
    let urlParam = getParam()
    let uId = urlParam.uId || getCookie('uId')
    if (uId) {
      resolve(uId)
    } else {
      reject()
    }
  })
}
// 判断参数是否是其中之一
export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }
  return false;
}
export function typeOf (obj) {
  const toString = Object.prototype.toString;
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  return map[toString.call(obj)];
}
// 深度拷贝
export function deepCopy (data) {
  const t = typeOf(data);
  let o;

  if (t === 'array') {
    o = [];
  } else if (t === 'object') {
    o = {};
  } else {
    return data;
  }

  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[i]));
    }
  } else if (t === 'object') {
    for (let i in data) {
      o[i] = deepCopy(data[i]);
    }
  }
  return o;
}

// scrollTop animation
export function scrollTop (el, from = 0, to, duration = 500, endCallback) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      }
    );
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil(difference / duration * 50);

  function scroll (start, end, step) {
    if (start === end) {
      endCallback && endCallback();
      return;
    }

    let d = (start + step > end) ? end : start + step;
    if (start > end) {
      d = (start - step < end) ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  }
  scroll(from, to, step);
}

// Find components upward
export function findComponentUpward (context, componentName, componentNames) {
  if (typeof componentName === 'string') {
    componentNames = [componentName];
  } else {
    componentNames = componentName;
  }

  let parent = context.$parent;
  let name = parent.$options.name;
  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent;
    if (parent) name = parent.$options.name;
  }
  return parent;
}
// Find component downward
export function findComponentDownward (context, componentName) {
  const childrens = context.$children;
  let children = null;

  if (childrens.length) {
    for (const child of childrens) {
      const name = child.$options.name;
      if (name === componentName) {
        children = child;
        break;
      } else {
        children = findComponentDownward(child, componentName);
        if (children) break;
      }
    }
  }
  return children;
}
// Find components downward
export function findComponentsDownward (context, componentName) {
  return context.$children.reduce((components, child) => {
    if (child.$options.name === componentName) components.push(child);
    const foundChilds = findComponentsDownward(child, componentName);
    return components.concat(foundChilds);
  }, []);
}

// Find components upward
export function findComponentsUpward (context, componentName) {
  let parents = [];
  const parent = context.$parent;
  if (parent) {
    if (parent.$options.name === componentName) parents.push(parent);
    return parents.concat(findComponentsUpward(parent, componentName));
  } else {
    return [];
  }
}
// Find brothers components
export function findBrothersComponents (context, componentName, exceptMe = true) {
  let res = context.$parent.$children.filter(item => {
    return item.$options.name === componentName;
  });
  let index = res.findIndex(item => item._uid === context._uid);
  if (exceptMe) res.splice(index, 1);
  return res;
}

/* istanbul ignore next */
const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};

export const loadScript = function (path, callback) {
  var script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = path
  script.onload = function () {
    callback && callback()
    console.log('脚本加载完毕')
  }
  document.body.appendChild(script)
}
// 按需同步加载vconsole
export const loadVConsole = function () {
  let xhr = new XMLHttpRequest()
  xhr.open('get', 'https://cdn.bootcss.com/vConsole/3.3.4/vconsole.min.js', false)
  xhr.onload = function (e) {
    //同步接受响应
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        //实际操作
        // console.log(xhr.responseText)
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.innerHTML = xhr.responseText;
        document.body.appendChild(script)
        new VConsole()
      }
    }
  }
  xhr.send(null);

  // let div_flag = document.createElement('div')
  // div_flag.innerHTML = '刷新'
  // div_flag.setAttribute('style', `
  //   width: 80px;
  //   height: 80px;
  //   border-radius: 80px;
  //   line-height: 80px;
  //   text-align: center;
  //   font-size: 18px;
  //   position: fixed;
  //   top: 80%;
  //   left: 80%;
  //   z-index: 10;
  //   background:#04be02;
  //   color:#fff;
  // `)
  // div_flag.addEventListener('touchmove', (e) => {
  //   div_flag.style.left = e.touches[0].clientX - 40 + 'px'
  //   div_flag.style.top = e.touches[0].clientY - 40 + 'px'
  // }, false)
  // div_flag.onclick = function () {
  //   window.location.reload()
  // }
  // document.body.appendChild(div_flag)
}
// 获取UUID 支持自定义格式 xxx会被替换
export const UUID = function UUID (str) {
  return (str || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}