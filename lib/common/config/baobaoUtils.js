/*
 * @Author: zhengguozhi
 * @Date: 2019-03-29 17:18:57
 * @LastEditors: zhengguozhi
 * @LastEditTime: 2020-03-05 15:13:59
 */
export function getStagClass (sex) {
  if (sex === '2') {
    return 'userStag userStagGirl'
  } else {
    return 'userStag userStagBoy'
  }
}

export function getStagClass2 (sex) {
  if (sex === '2') {
    return 'userStag userStagGirl_2'
  } else {
    return 'userStag userStagBoy_2'
  }
}

export function getGradeClass (grade) {
  if (grade <= 15) {
    return 'userGrade userGradeStar'
  } else if (grade <= 34) {
    return 'userGrade userGradeMoon'
  } else if (grade <= 58) {
    return 'userGrade userGradeSun'
  } else if (grade <= 84) {
    return 'userGrade userGradeCrown1'
  } else if (grade <= 99) {
    return 'userGrade userGradeCrown2'
  } else if (grade <= 111) {
    return 'userGrade userGradeCrown3'
  } else if (grade <= 144) {
    // 144 新添加
    return 'userGrade userGradeCrown112'
  } else if (grade <= 170) {
    return 'userGrade userGradeCrown4'
  } else if (grade <= 225) {
    return 'userGrade userGradeCrown5'
  } else if (grade <= 288) {
    // 226 新添加
    return 'userGrade userGradeCrown226'
  } else {
    // 289新添加
    return 'userGrade userGradeCrown289'
  }
}
// data: uId or user
// types: 'uId' or 'user'
export function toProfile (data, types = 'uId') {
  let url = ''
  if (types === 'uId') {
    url = `baobao://profile#{"uId":" ${ data }","yUId":"${ data }"}`
  } else if (types === 'user') {
    if (data.userZhibo.zId > 0) {
      url = `baobao://jump#{"type":"zroom","zId":${ data.userZhibo.zId }}`
    } else {
      url = `baobao://profile#{"uId":"${ data.userBase.uId }","yUId":"${ data.userBase.uId }"}`
    }
  }
  console.log(url)
  location.assign(url)
}
