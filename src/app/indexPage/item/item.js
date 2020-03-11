/*
 * @Author: xuxueliang
 * @Date: 2020-03-06 16:31:19
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-11 19:27:46
 */
import Yam, { Component } from 'yamjs'
import stylus from './item.stylus'
@Component({
  tagName: 'app-item',
  style: [stylus],
  // shadow: true,
  props: ['no']
})
class App extends Yam {
  $data () {
    return {
      // your data
    }
  }
  getStagClass () {

  }
  getGradeClass () {

  }
  render () {
    return <div className={ ['list-item', this.no === 1 ? 'first-item' : 'normal-item'] }>
      <div className={ ['flag_' + this.no, 'biao'] } >{ this.no }</div>
      <div className={ [this.no === 1 ? 'first first-sh' : 'normal'] }>
        <div className="item_1 item-item">
          <div className={ [this.no === 1 && 'hg', 'tx'] }>
            <img
              src="http://pbs.myhug.cn/npic/w/9/20200107161241_bd1633f3e2bd10db933f63fe41622078"
              alt=""
            />
          </div>
          <span className="name fh">林小林的守林小林的守</span>
          <span className="flag">
            <span className={ this.getStagClass('2') }></span>
            <span className={ this.getGradeClass(80) }>50</span>
          </span >
          <div className="earn">收到音符：214224</div>
        </div >
        <div className="item_2 item-item">
          <div className={ [this.no === 1 && 'hg', 'tx'] }>
            <img
              src="http://pbs.myhug.cn/npic/w/9/20200107161241_bd1633f3e2bd10db933f63fe41622078"
              alt=""
            />
          </div>
          <span className="name fh">林小林的守林小林的守11</span>
          <span className="flag">
            <span className={ this.getStagClass('2') }></span>
            <span className={ this.getGradeClass(80) }>50</span>
          </span >
          <div className="earn">送出钻石：214241</div>
        </div >
      </div >
    </div >
  }
}
export default App
