/*
 * @Author: xuxueliang
 * @Date: 2020-03-06 19:32:30
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-06 19:35:35
 */
import basePost from './http'
// import domains from './domains'
/* eslint-disable */
export const initHttp = (param = {}) => basePost('/sys/init', param)
export const assetsUrl = 'http://pws.myhug.cn'
export const isDev = process.env.NODE_ENV === 'development'
export const ERR_OK = 200