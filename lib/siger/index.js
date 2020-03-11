/*
 * @Author: xuxueliang
 * @Date: 2018-12-18 12:26:30
 * @LastEditors  : xuxueliang
 * @LastEditTime : 2019-12-31 18:54:37
 */
import md5 from './md5'
let API_SIG_VERSION = '2'
let API_SIG_SUFIX = '!2a9491a2d9'
const getApiSig = (data, posStr = 'after') => {
  const sortedData = {}
  Object.keys(data).sort().forEach(key => {
    if (data[key] !== undefined) {
      sortedData[key] = data[key]
    }
  })
  let strData = ''
  Object.keys(sortedData).forEach(key => {
    strData += `${ key }=${ sortedData[key] }`
  })
  if (posStr === 'before') {
    strData = API_SIG_SUFIX + strData
  } else {
    strData += API_SIG_SUFIX
  }
  return API_SIG_VERSION + md5(strData)
}
export default getApiSig
/**
 * @description: 设置签名的 属性
 * @param {API_SIG_VERSION:'',API_SIG_SUFIX:''}
 * @return:
 */
export const setSigerConfig = (data = {}) => {
  API_SIG_VERSION = data['API_SIG_VERSION'] || API_SIG_VERSION
  API_SIG_SUFIX = data['API_SIG_SUFIX'] || API_SIG_SUFIX
}
