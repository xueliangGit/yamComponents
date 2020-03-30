/*
 * @Author: xuxueliang
 * @Date: 2020-03-06 19:32:30
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-13 14:01:37
 */
import basePost from './http'
// import domains from './domains'
/* eslint-disable */
export const weekStarHttp = (param = {}) => basePost('/act/weekstar', param)
export const assetsUrl = 'http://pws.myhug.cn'
export const isDev = process.env.NODE_ENV === 'development'
export const ERR_OK = 200