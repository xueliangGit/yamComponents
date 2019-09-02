/*
 * @Author: xuxueliang
 * @Date: 2019-08-16 17:53:23
 * @LastEditors: xuxueliang
 * @LastEditTime: 2019-08-21 17:48:16
 */
import Yam, { Component } from 'yamjs'
import style from './upimg1.stylus'
@Component({
  tagName: 'up-img',
  style: style,
  props: ['serverurl', 'title', 'type'],
  canBeCalledExt: true
})

class App extends Yam {
  $data () {
    return {
      // your data
      imgUrl: '',
      isLoading: false,
      loadingInfo: '加载中...'
    }
  }
  $created () {
    console.log(this.title)
  }
  change (e) {
    this.isLoading = true
    this.loadingInfo = '加载中...'
    if (this.serverurl) {
      this.upLoad(e.target.files[0])
    } else {
      this.updateUrl({ picUrl: preImg(e.target) })
    }
  }
  updateUrl (obj) {
    this.imgUrl = obj.picUrl
    this.emitProp('uploadok', obj)
    this.isLoading = false
  }
  upLoad (file) {
    let params = new FormData()
    params.append('type', this.type || 0)
    params.append('picFile', file, file.name)
    console.log(file)
    window.fetch(this.serverurl, {
      method: 'post',
      body: params,
      timeout: 10000
    })
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        this.updateUrl(response)
      })
      .catch((error) => {
        this.loadingInfo = '加载失败'
        setTimeout(() => {
          this.isLoading = false
        }, 500)
        console.log(error)
      })
    return false
  }
  loading () {
    return <div onClick={(e) => { e.preventDefault() }} class='loading'>
      <div>{ this.loadingInfo }</div>
      <span />
    </div>
  }
  render () {
    console.log(this.imgUrl)
    return <div class='upfile'>
      <label>
        <input type='file' onChange={this.change.bind(this)} accecpt='image/*' />
        { this.imgUrl ? <div class='showimg' style={{ backgroundImage: 'url(' + this.imgUrl + ')' }} /> : this.isLoading ? '' : <p>+</p> }
        { this.isLoading ? this.loading() : '' }
      </label>
    </div>
  }
}
export default App
function preImg (node) {
  let imgURL = ''
  try {
    var file = null
    if (node.files && node.files[0]) {
      file = node.files[0]
    } else if (node.files && node.files.item(0)) {
      file = node.files.item(0)
    }
    // Firefox 因安全性问题已无法直接通过input[file].value 获取完整的文件路径
    try {
      imgURL = file.getAsDataURL()
    } catch (e) {
      imgURL = window.URL.createObjectURL(file)
    }
  } catch (e) {
    if (node.files && node.files[0]) {
      var reader = new FileReader()
      reader.onload = function (e) {
        imgURL = e.target.result
      }
      reader.readAsDataURL(node.files[0])
    }
  }
  return imgURL
}
