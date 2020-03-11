# eryuSDk

支持按需倒入内部的所有的模块（目前仅支持此方式）

[录音相关](#录音)

[更新](#更新)
内部的方法有

|        参数        |        类型         |                         描述                         |                                例子                                |
| :----------------: | :-----------------: | :--------------------------------------------------: | :----------------------------------------------------------------: |
|       isEryu       |       Boolean       |                  是否在耳觅 app 内                   |                                                                    |
|      isBaoBao      |       Boolean       |                    是否是抱抱 App                    |                                                                    |
|   isEryuAndroid    |       Boolean       |                    是否是耳觅安卓                    |                                                                    |
|     isEryuIOS      |       Boolean       |                    是否是耳觅 ios                    |                                                                    |
|  isBaoBaoAndroid   |       Boolean       |                    是否是抱抱安卓                    |                                                                    |
|    isBaoBaoIOS     |       Boolean       |                    是否是抱抱 ios                    |                                                                    |
|       isIOS        |       Boolean       |                      是否是 ios                      |                                                                    |
|     appVersion     |       String        |             是耳觅和抱抱的话，会有版本号             |                                                                    |
|      urlParam      |      Function       |                    url 带入的参数                    |                                                                    |
|    isOldVersion    |      Function       |     与目标版本做对比看是否是老版本：参数时版本号     |                                                                    |
|       toApp        |      Function       |                  执行 app 的 scahme                  |                                                                    |
|      openPage      |      Function       |                      打开 page                       |                                                                    |
|       \$emit       |      Function       |                        \$emit                        |                    \$emit('name',params,still)                     |
|        \$on        |      Function       |                     订阅一个方法                     |                     \$on('name',()=>{},times)                      |
|       getUId       | Function【promise】 | 获取 uid，返回一个 promise；可以传入值，获取相应的值 | getUId().then((res)=>{console.log(res.uId)});getUId('yUId').then() |
|     safeHeight     |       Number        |              X,Xmax 的安全距离（24/0）               |                                                                    |
| initVisibleChange  |      Function       |                初始化 js 检测试图变化                |                        initVisibleChange()                         |
| navtiveInjectParam |    Object（Null)    |       客户端注入的参数有 uId，statusBarHeight        |                         准确性底，制作参考                         |
|                    |                     |                                                      |                                                                    |

# 录音

录音相关在@lib/eryuSdk/record 文件内

### startRecord ：Function 开始录音

返回值有`uuid`、`stopRecord`

目前 uuid 作为保留值，后续或有用;目前做订阅区分

```js
import { startRecord, $emit } from '@lib/eryuSdk/record'
let recordObj = startRecord({
  // 方法返回一个对象包含 {uuid// 录音本地id；stopRecord 方法 }
  success: res => {
    // 开启成功回调
    this.isReocrding = true
    console.log('startRecord:success', res)
  },
  error(res) {
    // 开启失败回调 有errmsg 信息
    console.log('startRecord:error', res)
  },
  onTimeUpdate: res => {
    // 录音进行时的回调；传回的参数有 tuneValue 音准值。times时间
    console.log('startRecord:onTimeUpdate', res)
    this.tuneValue = res.tuneValue
    this.times = res.times
  },
  onErrorStop: res => {
    // 录音异常停止事件。例如中途来电话
    this.isReocrding = false
    console.log('startRecord:onErrorStop', res)
  }
})
// 停止录音
recordObj.stopRecord({ success: () => {}, error: () => {} })
or
recordObj.stopRecord.then(res => {}).catch()
```

### stopRecord：Function 停止录音

单独的停止录音功能；需要搭配 uuid 使用；建议使用 startRecord 方法返回的 stopRecord 方法区停止录音；

# 更新

1. 耳觅 app iOS 1.9.0 版本支持 iframe 的 url 调用 scheme；
2. 抱抱 App iOS 8.5.0 版本支持 iframe 的 url 调用 scheme；
