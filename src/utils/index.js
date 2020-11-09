/*
 * @Author: xuxueliang
 * @Date: 2020-10-21 11:24:35
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-10-21 11:39:40
 */
import { uiprefix } from '../config'
export const getTagName = (name) => `${uiprefix}-${name.toLowerCase()}`
