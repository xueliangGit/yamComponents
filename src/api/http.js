/*
 * @Author: xuxueliang
 * @Date: 2020-03-06 19:32:30
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-06 19:34:56
 */
import axios from 'axios'
import qs from 'qs'
import getApiSig from '@lib/siger'
import Toast from '@lib/plugins/Sloth/Toast/'
// import { Indicator, Toast } from 'mint-ui' 没有试用mintUi
// import 'mint-ui/lib/style.css'
import Yam from 'yamjs'
Yam.prototype.$ajax = axios
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

axios.interceptors.request.use((config) => {
  if (config.method === 'post') {
    config.data = config.data || {}
    config.data.ts = parseInt((+new Date()) / 1000)
    config.data.sig = getApiSig(config.data || {})
    config.data = qs.stringify(config.data)
  }
  return config
}, (error) => {
  // Toast({
  //   message: '加载超时',
  //   position: 'middle',
  //   duration: 3000
  // })
  Toast.showShortCenter('加载超时', '', 3000)
  return Promise.reject(error)
})

axios.interceptors.response.use((res) => {
  // Indicator.close()
  return res.data
}, (error) => {
  console.log('好多人在访问呀，请重新试试[timeout]')
  // Indicator.close()
  if (error) {
    let errortime = null
    clearTimeout(errortime)
    errortime = setTimeout(() => {
      // Toast({
      //   message: error.message,
      //   position: 'middle',
      //   duration: 2000
      // })
      Toast.showShortCenter(error.message, '', 2000)
      clearTimeout(errortime)
    }, 0)
  }
  return Promise.reject(error)
})
const basePost = (api, param = {}) => {
  if (param.__ISTEST__) {
    // 参数中有 __ISTEST__ 属性即是 打算走测试接口；当是开发环境时 或者 浏览器地址含有 __ISTEST__ 属性时； 走测试接口
    if (process.env.NODE_ENV === 'development' || window.location.href.indexOf('__ISTEST__') > -1) {
      api = 'http://192.168.2.154:2521/getApi?domain=ey&api=' + api
    }
    delete param.__ISTEST__
  }
  return axios.post(api, param)
}
export default basePost
