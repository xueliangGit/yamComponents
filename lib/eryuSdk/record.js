/*
 * @Author: xuxueliang
 * @Date: 2020-01-20 11:25:25
 * @LastEditors  : xuxueliang
 * @LastEditTime : 2020-02-10 11:41:26
 */
import { $on, $rm, $emit } from './emit'
import { toApp } from './app&jsOP'
import { UUID } from '@lib/common/config/mUtils.js'
// record
let record$on = null
function initRecordFlag () {
  record$on && record$on()
  record$on = null
}
const startRecord = function startRecord ({ success = () => { }, error = () => { }, onTimeUpdate = () => { }, onErrorStop = () => { } } = {}) {
  initRecordFlag()
  let uuid = UUID('xxxx_xxxx')
  let callBacks = {
    callBack: 'startRecord_' + uuid,
    onTimeUpdate: 'startRecord_timeUpdate_' + uuid,
    onErrorStop: 'startRecord_stopCallBack_' + uuid
  }
  let startTimes = 0
  record$on = rm$on
  // {  } start 启动录音回调事件 成功或者失败
  let callBack = (res) => {
    if (res.success) {
      startTimes = Date.now()
      success(res)
    } else {
      error(res)
      rm$on()
    }
  }
  $on(callBacks.callBack, callBack)
  function onTimeUpdateCallBack (res) {
    if (typeof res === 'object') {
      res.times = Date.now() - startTimes
    } else {
      res = {
        tuneValue: res,
        times: Date.now() - startTimes
      }
    }
    onTimeUpdate(res)
  }
  $on(callBacks.onTimeUpdate, onTimeUpdateCallBack)
  // 异常退出时触发 此时处理所有的数据
  function errorStopCallBackCopy (...a) {
    onErrorStop(...a)
    rm$on()
  }
  $on(callBacks.onErrorStop, errorStopCallBackCopy)
  // 解除订阅
  function rm$on () {
    $rm(callBacks.callBack, callBack, true)
    $rm(callBacks.onTimeUpdate, onTimeUpdateCallBack, true)
    $rm(callBacks.onErrorStop, errorStopCallBackCopy, true)
  }
  toApp(Object.assign({ type: 'startRecord' }, callBacks))
  return { uuid, stopRecord: stopRecord.bind({ uuid }) }
}

const stopRecord = function stopRecord ({ uuid = '', success = null, error = () => { } } = {}) {
  uuid = (this.uuid || uuid)
  if (!uuid) return
  if (success) {
    // 传入方式
    _stopRecord(uuid, success, error)
  } else {
    // promise
    return new Promise((resolve, reject) => {
      _stopRecord(uuid, resolve, reject)
    })
  }
}
function _stopRecord (uuid, success, error) {
  let callBacks = {
    callBack: 'stopRecord_' + uuid
  }
  let callBack = (res) => {
    if (res.success) {
      success && success(res)
      initRecordFlag()
    } else {
      error(res)
    }
    $rm(callBacks.callBack, callBack, true)
  }
  $on(callBacks.callBack, callBack, 1)
  toApp(Object.assign({ type: 'stopRecord' }, callBacks))
}
// 播放录音
const playRecordVoice = function ({ filePath, onEnded = () => { }, success = () => { }, error = () => { } } = {}) {
  let uuid = UUID('xxxx_xxxx')
  let callBacks = {
    callBack: 'playRecordVoice_' + uuid,
    filePath: filePath,
    endCallBack: 'playRecordVoice_endCallBack_' + uuid
  }
  function callBackFn (res) {
    if (res.success) {
      success(res)
    } else {
      error(res)
    }
  }
  $on(callBacks.callBack, callBackFn, 1)
  $on(callBacks.endCallBack, onEnded, 1)
  toApp({ type: 'playRecordVoice', filePath, callBack: callBacks.callBack, endCallBack: callBacks.endCallBack })
  return {
    pauseRecordVoice: pauseRecordVoice.bind({ uuid })
  }
}
// 播放录音
const pauseRecordVoice = function ({ uuid, success, error } = {}) {
  uuid = this.uuid || uuid
  if (!uuid) return
  let callBacks = {
    callBack: 'pauseRecordVoice_' + uuid
  }
  function callBackFn (res) {
    if (res.success) {
      success && success(res)
    } else {
      error && error(res)
    }
  }
  $on(callBacks.callBack, callBackFn, 1)
  toApp({ type: 'pauseRecordVoice', callBack: callBacks.callBack })
}
export {
  startRecord,
  stopRecord,
  playRecordVoice,
  pauseRecordVoice,
  $emit
}
