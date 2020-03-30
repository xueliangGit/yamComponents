/*
 * @Author: xuxueliang
 * @Date: 2020-03-06 16:31:19
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-13 14:14:41
 */
import Yam, { Component } from 'yamjs'
import stylus from './item.stylus'
import { getGradeClass, getStagClass } from '@lib/common/config/baobaoUtils'

@Component({
  tagName: 'app-item',
  style: [stylus],
  // shadow: true,
  props: ['no', 'item']
})
class App extends Yam {
  $data () {
    return {
      // your data
      nums: 1231123123
    }
  }
  getStagClass () {

  }
  getGradeClass () {

  }
  show (index) {
    console.log('1', index)
  }
  render () {
    return <div className={ ['list-item', this.no === 1 ? 'first-item' : 'normal-item'] }>
      <div className={ ['flag_' + this.no, 'biao'] }>{ this.no }</div>
      <div className={ [this.no === 1 ? 'first first-sh' : 'normal'] }>
        <div className="item_1 item-item">
          <div className={ [this.no === 1 && 'hg', 'tx'] }>
            <img
              src={ this.item.user.userBase.portraitUrl }
              alt=""
            />
          </div>
          <span className="name fh">{ this.item.user.userBase.nickName }</span>
          <span className="flag">
            <span className={ getStagClass(this.item.user.userBase.sex) }> </span>
            <span className={ getGradeClass(this.item.user.userZhibo.grade) }> { this.item.user.userZhibo.grade }</span>
          </span >
          <div className="earn">收到音符：{ this.item.gainNum }</div>
        </div >
        <div className="item_2 item-item">
          <div className={ ['tx', this.no === 1 && 'hg'] }>
            <img
              src={ this.item.donateUser.userBase.portraitUrl }
              alt=""
            />
          </div>
          <span className="name fh">{ this.item.donateUser.userBase.nickName }</span>
          <span className="flag">
            <span className={ getStagClass(this.item.donateUser.userBase.sex) }> </span>
            <span className={ getGradeClass(this.item.donateUser.userZhibo.grade) }> { this.item.donateUser.userZhibo.grade } </span>
          </span >
          <div className="earn">送出钻石：{ this.item.donateNum }</div>
        </div >
      </div >
    </div >
  }
}
export default App
