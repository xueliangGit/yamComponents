/*
 * @Author: xuxueliang
 * @Date: 2020-06-22 17:20:53
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-10-21 11:43:07
 */
import Yam, { Component } from 'yamjs'
import Button from '../Button'
@Component({
  tagName: 'lazy-img',
  style: '',
  props: ['src', 'width', 'height', 'loadingsrc']
})
class App extends Yam {
  $data () {
    return {
      // your data
      isReady: false
    }
  }
  $mounted () {
    if (this.src) {
      this.loadimg()
    }
  }
  loadimg () {
    let img = new Image()
    img.src = this.src
    img.onload = () => {
      this.isReady = true
    }
    img.onerror = () => {
      if (!img._isTry) {
        img._isTry = true
        img.src = ''
        setTimeout(() => {
          img.src = this.src
        }, 200)
      }
    }
  }
  render () {
    return <div>
      <Button>我是按钮</Button>
      <img aaaa={ this.isReady ? this.src : this.loadingsrc } src={ this.isReady ? this.src : this.loadingsrc } />
    </div>
  }
}
export default App
