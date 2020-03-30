/*
 * @Author: xuxueliang
 * @Date: 2020-03-06 16:06:51
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-13 14:05:09
 */
import Yam, { Component } from 'yamjs'
import Item from './item/item'
import { weekStarHttp } from '@api'
import stylus from './index.stylus'
import { getUId, toApp } from '@lib/eryuSdk'
import Toast from '@lib/plugins/Sloth/Toast'

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
  props: ['leng', 'all']
})
class App extends Yam {
  $data () {
    return {
      // your data
      actTime: '0.0-0.0',
      list: [],
      preWeekStarTop1: null
    }
  }
  show () {
    console.log('parent1')
  }
  enter () {
    if (this.preWeekStarTop1.zId) {
      toApp({ type: 'zroom', zId: this.preWeekStarTop1.zId })
    } else {
      Toast.center('该主播暂未开播')
    }
  }
  $created () {
    getUId().then(res => {
      weekStarHttp({ uId: res.uId }).then((res) => {
        console.log(res)
        this.actTime = res.actTime
        this.preWeekStarTop1 = res.preWeekStarTop1
        this.list = res.weekStarRank
      })
    })
  }
  $mounted () {
    console.log('渲染完毕211', Date.now() - window.startTmap)
  }
  getTop () {
    if (this.preWeekStarTop1) {
      return <div className="user-inner" v-if="preWeekStarTop1">
        <div className="user-tx hg pos-r">
          <img
            className="user-tx-img"
            src={ this.preWeekStarTop1.user.userBase.portraitUrl }
            alt=""
          />
          <img
            className="user-shouhu pos-a"
            src="http://pws.myhug.cn/npic/w/9/20200305114628_057a14cf4fc994b79149135f0c8b9be4"
            alt=""
          />
        </div>
        <div className="user-info">
          <div className="name fh">
            { this.preWeekStarTop1.user.userBase.nickName }
          </div>
          <div className="ID">ID:{ this.reWeekStarTop1.user.userBase.eyId } </div>
          <div className="button" onClick={ this.enter.bind(this) }>进入直播</div>
        </div>
      </div>
    }
    return ''
  }
  render () {
    return <div className="all-bk">
      <div className="body">
        <div className={ ['top pos-r  ', this.preWeekStarTop1 === null && 'no'] }>
          <div className="times pos-a">活动时间：{ this.actTime }</div>
          <div className="pos-a user">
            { this.getTop() }
          </div>
        </div>
        <div className="rule bkone">
          <div className="title"></div>
          <div className="rule-inner">
            <p>1.每周主播音符排行榜第一名获得7天直 播间周星头像框奖励</p>
            <p>2.为周星送出礼物钻石最多的用户可获得7天直播间富甲一方铭牌奖励</p>
            <p>3.本活动仅限电台主播参与</p>
            <p>4.收到/送出礼物价值相同时，榜单按照时间先后顺序排序</p>
            <p>5.计数周期为每周一0时—周日24时</p>
            <p>6.奖励将会在活动结束后的5个工作日内发放；</p>
          </div>
        </div>
        <div className="bkone rule">
          <div className="title small"></div>
          <div className="list">
            { this.list.map((v, i) =>
              <Item
                item={ v }
                key={ i }
                no={ i + 1 }
              />) }
          </div>
        </div>
      </div >
    </div >
  }
}
export default App
