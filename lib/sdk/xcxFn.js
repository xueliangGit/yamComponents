import getParam from '@lib/plugins/Sloth/getParam'
import $myEmit from './emit'
import appConfig from './config'
let wx = window['wx'] || {}
export default {
  initConfig (config = {}) {
    Object.assign(appConfig, config)
  },
  run: () => { },
  getNative (type) {
    let query = {}
    let param = getParam()
    if (param[type]) {
      query = param[type]
    }
    $myEmit.$emit(type, query)
  },
  toGoodsDetail (id) {
    wx.miniProgram.navigateTo({
      url: '/pages/gc/detail/detail?goodsId=' + id
    })
  },
  navigateBack () {
    wx.miniProgram.navigateBack()
  },
  switchTab (url) {
    wx.miniProgram.switchTab({
      url
    })
  },
  navigateTo (url) {
    wx.miniProgram.navigateTo({
      url
    })
  },
  redirectTo (url) {
    wx.miniProgram.redirectTo({
      url
    })
  },
  navigateToWeb (url) {
    wx.miniProgram.navigateTo({
      url: '/pages/webPage/webPage?url=' + url
    })
  },
  reLaunch () {
    wx.miniProgram.reLaunch()
  }
}
