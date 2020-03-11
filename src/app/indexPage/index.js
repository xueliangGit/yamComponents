/*
 * @Author: xuxueliang
 * @Date: 2020-03-06 16:06:51
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-11 19:32:18
 */
import Yam, { Component } from 'yamjs'
import Item from './item/item'
import { initHttp } from '@api'
import stylus from './index.stylus'

//
// function awitcgetcom (url) {
//   async function act (cb = () => { }) {
//     let fn = await import(`${ url }`)
//     cb(fn)
//     return fn
//   }
//   act._isLazyLoad = true
//   return act
// }
// const Item = awitcgetcom('./item/item')()
@Component({
  tagName: 'app-yamjs',
  // ad
  style: stylus,
  props: []
})
class App extends Yam {
  $data () {
    return {
      // your data

    }
  }
  $created () {
    initHttp().then()
  }
  $mounted () {
    console.log('渲染完毕211', Date.now() - window.startTmap)
  }
  render () {
    return <div id className="all-bk asd">
      <div className="body">
        <div className="top pos-r ">
          <div className="times pos-a">活动时间1：2.32-1.11</div>
          <div className="pos-a user">
            <div className="user-inner">
              <div className="user-tx hg pos-r">
                <img
                  className="user-tx-img"
                  src="http://pbs.myhug.cn/npic/w/9/20200107161241_bd1633f3e2bd10db933f63fe41622078"
                  alt=""
                />
                <img
                  className="user-shouhu pos-a"
                  src="http://pws.myhug.cn/npic/w/9/20200305114628_057a14cf4fc994b79149135f0c8b9be4"
                  alt=""
                />
              </div>
              <div className="user-info">
                <div className="name fh">可爱的小卡爱爱爱</div>
                <div className="ID">ID:15348975</div>
                <div className="button" onClick={ this.enter }>进入直播1</div>
              </div>
            </div>
          </div>
        </div>
        <div className="rule bkone">
          <div className="title"></div>
          <div className="rule-inner">
            <p>1.每周主播音符排行榜第一名获得7天直 播间周星头像框奖励</p>
            <p>2.为周星送出礼物钻1石最多的用户可获得7天直播间富甲一方铭牌奖励</p>
            <p>3.此活动送礼、收礼只限直播间内<1/p>
            <p>4.收到/送出礼物价值相同时，榜单按照时间先后顺序排序</p>
            <p>5.计数周期为每周一0时—周日214时</p>
            <p>6.奖励将会在活动13121结a束后的5个工作日1内发放；</p>
          </div>
        </div>
        <div className="bkone rule">
          <div className="title small"></div>
          <div className="list">
            <Item no="1" />
            <Item no="2" />
            <Item no="10" />
          </div>
        </div>
      </div>
    </div >
  }
}
export default App
