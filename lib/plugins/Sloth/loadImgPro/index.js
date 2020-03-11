class LoadImgPro {
  constructor (obj) {
    if (!(this instanceof LoadImgPro)) {
      return new LoadImgPro(obj)
    }
    if (obj) {
      this.load(obj)
    }
    console.log('loadImgPro:isRuning')
  }
  load (obj) {
    this.source = this._getArray(obj.source || obj.soucre || [])
    this._stepCall = obj.step || function () {}
    this._completeCall = obj.complete || function () {}
    this.imgLenth = this.source.length
    this._loadImgSoucre(this.source)
  }
  _loadImgSoucre (source) {
    let length = this.imgLenth
    source.forEach((res) => {
      this._loadImg(res, () => {
        length--
        this._stepCall(((this.imgLenth - length) / this.imgLenth * 100).toFixed(0) + '%', this.imgLenth - length, this.imgLenth)
        if (length === 0) {
          this._completeCall()
        }
      })
    })
  }
  _loadImg (source, callFn, nums = 0) {
    let nImg = new Image()
    nImg.src = source
    nImg.onload = function () {
      callFn()
    }
    nImg.onerror = () => {
      if (nums > 0) {
        callFn()
      } else {
        this._loadImg(source, callFn, nums + 1)
      }
    }
  }
  _getArray (obj) {
    if (obj instanceof Array) {
      return obj
    } else {
      let arr = []
      for (let i in obj) {
        arr.push(obj[i])
      }
      return arr
    }
  }
}
export default function loadImgPro (obj) {
  return new LoadImgPro(obj)
}
