import $myEmit from './emit'
import getParam from '@lib/plugins/Sloth/getParam'
import { getCookie } from '../common/config/mUtils'
import appConfig from './config'
export default {
  initConfig (config = {}) {
    Object.assign(appConfig, config)
  },
  getNative (type) {
    let query = getCookie(type)
    try {
      query = JSON.parse(query)
    } catch (e) {
      console.warn('query 不是JSON字符串')
    }
    if (!query) {
      let param = getParam()
      if (param[type]) {
        query = param
      }
    }
    $myEmit.$emit(type, query)
  },
  toGoodsDetail (id) {
    this.go(`${ appConfig.name }://${ appConfig.action }#{"type":"goodsDetail","goodsId":"${ id }"}`)
  },
  navigateBack () {
    window.history.back()
  },
  switchTab (url) {
    this.go(url)
  },
  navigateTo (url) {
    this.go(url)
  },
  redirectTo (url) {
    this.go(url)
  },
  navigateToWeb (url) {
    this.go(`${ appConfig.name }://${ appConfig.action }#{"type":"webView","url":"${ url }"}`)
  },
  go (url) {
    console.log(url)
    window.location.href = url
  },
  reLaunch () {
    window.location.reload()
  },
  setTitle (title) {
    document.title = title
  }
}
