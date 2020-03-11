
/*
 * @Author: xuxuelaing
 * @Date: 2019-01-24 17:31:10
 * @LastEditors: xuxueliang
 * @LastEditTime: 2019-11-26 19:41:16
 */
/**
 使用方法：
 1、 直接调用loadPro 会创建一个 LoadMediaPro 实例；可以直接调用loadPro({});多个调用不会会互相干扰
    1）调用参数有：
      defaultType: 'image', // 设置默认加载的格式 适用 直接用['url','url']，[{url:''}]方法使用，即没有指明type类型的； 会先根据文件后缀获取已有的格式，若没有那就会用默认的格式去加载
      source:Object [] 加载的文件
      step:Function 每加载完，无论是成功失败都会调用 参数有
            {
              all: 总进度,
              success: 成功的进度,
              successNum: 成功数,
              errorNum: 失败数,
              allNum: 总数量,
              res: 当前对象，若是失败了，会有error信息
            }
      complete:Function 加载完后调用 参数：res 含有success，error
 2、 方法支持扩展其他文件类型的加载；使用方法：
    1）先获取一个实例 let loadProDemo= loadPro()
    2) loadProDemo.install({type: 'asd', load: function (res) { return this.callOther('style', res) }，suffix:'.css')
    load方法可以是使用其他已经有的方法；需要用this.callOther 调用其他的方法(调用的放法名，和res)
    this.callOther('style', res)

 LoadMedia({
    defaultType: 'image', // 默认格式
    source: [
      {url: 'http://pws.myhug.cn/voice/w/2/03bcfb7fb71dab48b93b9b55.eywshare', type: 'audio'},
      {url: 'https://jscode.jbzj.com/bvzdzef.js'},
      {url: 'http://www.fastlove.cn/wap/web/share/static/css/components.8ec958df55c787aa336422b271526db1.css'},
      {url: 'http://localhost:1520/page/index.html?ad=123'}
    ],
    step: (...a) => {
      console.log('2', a)
    },
    complete: function (res) {
      console.log('2', res)
    }
  })
 */
let heads = document.getElementsByTagName('head')
// 一些 格式；待完善
let types = ['image', 'audio', 'video', 'style', 'javascript', 'html']

function xhrGetResouce (url) {
  return new Promise((resolve, reject) => {
    var xhr = new window.XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          // this.response is what you're looking for
          // handler(this.response)
          // console.log(this.response, typeof this.response)
          var url = window.URL || window.webkitURL
          resolve(url.createObjectURL(this.response))
        } else {
          reject(new Error(this))
        }
      }
    }
    xhr.open('GET', url)
    xhr.responseType = 'blob'
    xhr.send()
  })
}

/**
 * @description: 创建实例 方法集合
 * @param {type}  调用方法的指针是this
 * @return:
 */
let creatTypesObj = {
  callOther (name, res) {
    if (this[name]) {
      return this[name]
    }
    return this[name](res)
  },
  image (res) {
    let obj = new Image()
    obj.src = res.url
    return obj
  },
  audio (res) {
    let obj = { tagName: 'audio' }
    if (res.blob) {
      xhrGetResouce(res.url).then(blobUrl => {
        // console.log(res)
        if (obj.onload) {
          obj.onload({ blobUrl })
        }
      }).catch(blobRes => {
        // console.log(res)
        if (obj.onerror) {
          obj.onerror(blobRes)
        }
      })
    } else {
      obj = new Audio()
      obj.oncanplaythrough = () => {
        obj.onload && obj.onload()
      }
      obj.src = res.url
    }

    return obj
  },
  video (res) {
    let obj = document.createElement('video')
    obj.oncanplaythrough = () => {
      obj.onload && obj.onload()
    }
    obj.src = res.url
    return obj
  },
  style (res) {
    let obj = document.createElement('link')
    obj.setAttribute('rel', 'stylesheet')
    obj.setAttribute('type', 'text/css')
    obj.setAttribute('href', res.url)
    if (heads.length) {
      heads[0].appendChild(obj)
    } else {
      document.documentElement.appendChild(obj)
    }
    return obj
  },
  javascript (res) {
    let obj = document.createElement('script')
    obj.setAttribute('type', 'text/javascript')
    obj.setAttribute('src', res.url)
    if (heads.length) {
      heads[0].appendChild(obj)
    } else {
      document.documentElement.appendChild(obj)
    }
    return obj
  },
  none (res) {
    return null
  }
}
let suffixList = {
  image: '.jpg,.jpeg,png,gif',
  audio: '.ogg,.mp3,.wav',
  video: '.mp4',
  style: '.css',
  javascript: '.js',
  html: '.html'
}
class LoadMediaPro {
  constructor (obj) {
    if (!(this instanceof LoadMediaPro)) {
      return new LoadMediaPro(obj)
    }
    if (obj) {
      this.load(obj)
    }
    console.log('LoadMediaPro:isRuning')
  }
  /**
   * obj 加载
   * source = [{url:'',type:'',name:''}] || [url,url]||{name:url,name:url}
   *
   * */
  load (obj) {
    if (typeof obj.source !== 'object') {
      console.warn('LoadMediaPro:source应该是个对象{}或者[]')
      return false
    }
    this.defaultType = obj.defaultType || 'none'
    this.source = getObject(obj.source || {})
    this._stepCall = obj.step || function () { }
    this._completeCall = obj.complete || function () { }
    this.loadSuccess = []
    this.loadError = []
    this.sourceLenth = this.source.length
    this._loadSource(this.source)
  }
  _loadSource (source) {
    source.forEach((res) => {
      this._loadChildProcess(res)
    })
  }
  _loadedCallFn (res, isLoaded = true) {
    if (isLoaded) {
      this.loadSuccess.push(res)
    } else {
      this.loadError.push(res)
    }
    this._stepCall({
      all: ((this.loadError.length + this.loadSuccess.length) / this.sourceLenth * 100).toFixed(0) + '%',
      success: (this.loadSuccess.length / this.sourceLenth * 100).toFixed(0) + '%',
      successNum: this.loadSuccess.length,
      errorNum: this.loadError.length,
      allNum: this.sourceLenth,
      res: res
    })
    if (this.loadError.length + this.loadSuccess.length === this.sourceLenth) {
      if (this.loadError.length) {
        console.warn('本波加载完毕，加载失败有', this.loadError.length, '个', this.loadError)
      }
      this._completeCall({ success: this.loadSuccess, error: this.loadError })
    }
  }
  // 加载子程序
  _loadChildProcess (res, nums = 0) {
    let obj = getObj(res, this.defaultType)
    if (obj && obj.tagName) {
      obj.onload = (loadRes) => {
        if (loadRes && loadRes.blobUrl) {
          res.blobUrl = loadRes.blobUrl
          console.log(res)
        }
        this._loadedCallFn(res)
        obj = null
      }
      obj.onerror = (e) => {
        if (nums > 0) {
          res.error = { msg: `该类型[${ res.oriType || res.type }]的文件[${ res.name }]加载失败`, info: e }
          this._loadedCallFn(res, false)
          obj = null
        } else {
          this._loadChildProcess(res, nums + 1)
        }
      }
    } else {
      res.error = { msg: `该文件类型：[${ res.oriType || res.type }]不存在加载的方法` }
      this._loadedCallFn(res, false)
    }
  }
  /**
   * @description: install 扩展 其他加载文案
   * @param {Object}  [{type:String,load:function(){},suffix:String}]suffix后缀名：String
   * @return:
   */
  install (expend) {
    if (typeof expend === 'object') {
      if (!(expend instanceof Array)) {
        expend = [expend]
      }
      expend.forEach((v) => {
        if (types.indexOf(v.type) < 0) {
          types.push(v.type)
          creatTypesObj[v.type] = v.load
        }
        if (v.suffix) {
          suffixList[v.type] += v.suffix
        }
      })
    } else {
      console.warn(`加载扩展出错，install 方法仅支持 传入参数类型是：[{type:'word',load:function(res){}] 或者  {type:'word',load:function(res){}`)
    }
  }
}
// 获取架子的主对象
function getObj (res, defaultType) {
  res.type = res.type === 'none' ? defaultType : res.type
  if (creatTypesObj[res.type]) {
    return creatTypesObj[res.type](res)
  }
  return null
}
// 获取对象
function getObject (obj) {
  if (obj instanceof Array) {
    return obj.map(v => {
      return initMedia(v)
    })
  } else {
    let arr = []
    for (let i in obj) {
      arr.push({ name: i, url: obj[i], type: getType(obj[i]) })
    }
    return arr
  }
}
// 初始化 对象
function initMedia (v) {
  if (typeof v === 'object') {
    if (!(v.type && types.indexOf(v.type) > -1)) {
      v.oriType = v.type || ''
      v.type = getType(v.url)
    }
  } else {
    v = {
      url: v,
      type: getType(v),
      name: v
    }
  }
  return Object.assign(v, {
    url: v.url,
    name: v.name || getName(v.url),
    type: v.type,
    oriType: v.oriType || ''
  })
}
// 获取name
function getName (url) {
  url = url.split('?')[0]
  return /[^\\/]+$/.exec(url) + ''
}
// 获取类型
function getType (url) {
  let type = 'none'
  if (url) {
    url = url.split('?')[0]
    let suffix = /\.[^\\.]+$/.exec(url)
    for (let i in suffixList) {
      if (suffixList[i].indexOf(suffix) > -1) {
        type = i
        return type
      }
    }
  }
  return type
}
export default function loadPro (obj) {
  return new LoadMediaPro(obj)
}
