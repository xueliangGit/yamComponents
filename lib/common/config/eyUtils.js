/*
 * @Author: zhengguozhi
 * @Date: 2019-11-12 11:54:32
 * @LastEditors: zhengguozhi
 * @LastEditTime: 2019-11-12 12:06:29
 */

// data: uId or user
// types: 'uId' or 'user'
export function toProfile (data, types = 'uId') {
  let url = ''
  if (types === 'uId') {
    url = `eryu://jump#{"type":"userProfile","yUId":"${ data }"}`
  } else if (types === 'user') {
    if (data.userZhibo.zId > 0) {
      url = `eryu://jump#{"type":"zroom","zId":${ data.userZhibo.zId }}`
    } else {
      url = `eryu://jump#{"type":"userProfile","yUId":"${ data.userBase.uId }"}`
    }
  }
  console.log(url)
  location.assign(url)
}
