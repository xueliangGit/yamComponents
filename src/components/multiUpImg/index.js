/*
 * @Author: xuxueliang
 * @Date: 2020-02-18 15:13:32
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-06-22 17:19:41
 */
import Yam, { Component } from 'yamjs'
import img from './but-jubaozhaoshanchu@2x.png'
import style from './index.stylus'
const Upimg = () => import('../upfile/upimg')
@Component({
  tagName: 'multi-upimg',
  style: style,
  props: ['serverurl', 'title', 'type', 'suffix', 'width', 'height', 'max']
})
class App extends Yam {
  $data () {
    return {
      // your data
      max: 5,
      title: '213',
      Show: false,
      imgs: [],
      imgKeys: []
    }
  }
  uploadok (imgObj) {
    // console.log(imgObj)
    this.imgs.push(imgObj.picUrl)
    this.imgKeys.push(imgObj.picKey)
    console.log(this.__isWillupdate)
    this.update()
    this.updateEmitImgs()
  }
  updateEmitImgs () {
    this.emitProp('uploadok', this.imgs, this.imgKeys)
  }
  $mounted () {
    setTimeout(() => {
      this.Show = true
    }, 3000)
  }
  $beforeUpdate () {
    console.log(this)
  }
  getAll () {
    return <div className='img-divs'>
      { this.imgs.map((v, i) => (
        <div key={ i } className='img-show' style={ { 'width': this.width + 'px', height: this.height + 'px', backgroundImage: 'url(' + v + (this.suffix || '') + ')' } }>

          <span className='close' onClick={ () => { this.imgs.splice(i, 1) && this.imgKeys.splice(i, 1) && this.update() && this.updateEmitImgs() } } >
            <img src={ img } />
          </span>
        </div>
      ))
      }
      <Upimg selelctOnly={ true } className={ `img-show ${ this.imgs.length >= this.max ? 'hide' : '' }` } style={ { 'width': this.width + 'px', height: this.height + 'px' } } type={ this.type } suffix={ this.suffix } serverurl={ this.serverurl } uploadok={ this.uploadok.bind(this) } title="上传图片"></Upimg>
    </div >
  }
  render () {
    return <div>
      { this.Show ? this.getAll() : null }
    </div>
  }
}
export default App
