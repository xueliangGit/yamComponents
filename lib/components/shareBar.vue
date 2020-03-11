<!--
 * @Author: zhengguozhi
 * @Date: 2019-10-16 21:08:24
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-05 18:59:06
 -->
<template>
  <!-- <div class="share-btn-box" :style="{backgroundColor:'#b266eb'}"> -->
  <div
    class="button-container flex"
    :style="{ width: remWidth(outWidth), height: remWidth(outHeight) }"
  >
    <div
      class="share-btn tc"
      v-for="(item, index) in strArr"
      :key="index"
      @click="shareBtn(pointerObj[item])"
      @touchstart="touchstartFn(index)"
      @touchend="touchendFn(index)"
      :style="{ width: remWidth(itemWidth) }"
    >
      <div
        class="img-url"
        :style="{
          backgroundImage: `url(${_self[item + 'Url']})`,
          height: remWidth(itemWidth)
        }"
      >
        <div :class="nowIndex === index ? 'choose-index' : ''"></div>
      </div>
      <div>{{ descObj[item] }}</div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import { pxToRem } from '@lib/common/config/mUtils'
import { isEryu, toApp, $onSigle } from '@lib/eryuSdk'
export default {
  data () {
    return {
      // platformArr: [1, 2, 5, 4, 6], // platform:1 微信 2 朋友圈 3 qq空间 4 qq 5 微博 6 下载 7私信
      pointerObj: {
        'xiazai': 6,
        'weibo': 5,
        'qq': 4,
        'kongjian': 3,
        'pengyouquan': 2,
        'weixin': 1,
        'sixin': 7
      },
      descObj: {
        'xiazai': '下载',
        'weibo': '微博',
        'qq': 'QQ',
        'kongjian': 'QQ空间',
        'pengyouquan': '朋友圈',
        'weixin': '微信',
        'sixin': '私信'
      },
      nowIndex: -1,
      baseObj: {
      }
    }
  },
  components: {

  },
  props: {
    eventFrom: {
      type: String,
      default: ''
    },
    handleClick: {
      type: Boolean,
      default: false
    },
    appName: {
      type: String,
      default: isEryu ? 'eryu' : 'baobao'
    },
    // platformArr: {
    //   type: Array,
    //   default () {
    //     return [1, 2, 5, 4, 6]
    //   }
    // },
    strArr: {
      type: Array,
      default () {
        return ['xiazai', 'weixin', 'pengyouquan', 'weibo', 'sixin', 'qq']
      }
    },
    shareInfo: {
      type: Object,
      default () {
        return {}
      }
    },
    outWidth: {
      type: String,
      default: '345px'
    },
    outHeight: {
      type: String,
      default: '85px'
    },
    itemWidth: {
      type: String,
      default: '45px'
    },
    xiazaiUrl: {
      type: String,
      // default: 'http://pws.myhug.cn/npic/s/9/ff583908ed2a13184e31363016d67ffe9ebfbf3f28100d'
      default: 'http://pws.myhug.cn/npic/s/9/ff583960854f288dbfe81c92a196a4c6f3ce44588d3ef0'
    },
    weixinUrl: {
      type: String,
      default: 'http://pws.myhug.cn/npic/s/9/ff58391b4c9ff56d069a89b8af0cae33fa8a02df7d56eb'
    },
    pengyouquanUrl: {
      type: String,
      default: 'http://pws.myhug.cn/npic/s/9/ff58390e5e2075051e4be15ed4b8d8dffa8f70d1fe4deb'
    },
    weiboUrl: {
      type: String,
      default: 'http://pws.myhug.cn/npic/s/9/ff5839acb3e54106581bc45b18bc11e7267d565d10e7fc'
    },
    kongjianUrl: {
      type: String,
      default: 'http://pws.myhug.cn/npic/s/9/ff5839cdbdb8030385dffa96af6ba321cacf31f3b840eb'
    },
    qqUrl: {
      type: String,
      default: 'http://pws.myhug.cn/npic/s/9/ff5839794970ffc827b5b2f604d075d7366e6627147deb'
    },
    sixinUrl: {
      type: String,
      default: 'http://pws.myhug.cn/npic/s/9/ff5839a4a748ce074ce72601039e4da0c6d41b194e1a69'
    }
  },
  mounted () {

  },
  methods: {
    shareBtn (platform) {
      // upH5State(upH5StateConf[[1, 4, 5].indexOf(+this.firstType) > -1 ? this.firstType : '' + this.secondType + this.firstType])
      // let url = `eryu://share#{"imgUrl": "${ this.shareInfo.imgUrl }","thumbnail":"${ this.shareInfo.thumbnail }","title":"${ this.shareInfo.title }","content":"${ this.shareInfo.content }","h5Url":"${ this.shareInfo.h5Url }", "platform": ${ platform }}`
      // 兼容安卓1.5.12版本，不传title和h5Url,安卓端将在1.5.14修复
      // let url = `eryu://share#{"imgUrl": "${ this.shareInfo.imgUrl }","thumbnail":"${ this.shareInfo.thumbnail }","content":"${ this.shareInfo.content }","platform": ${ platform }}`
      // let url = ''
      let newObj = {
        eventFrom: this.checkEventFrom(this.eventFrom),
        ...this.baseObj,
        ...this.shareInfo,
        platform
      }
      let url = this.appName + '://share#' + JSON.stringify(newObj)
      console.log(url)

      if (this.handleClick) {
        this.$emit('handleClick', {
          next: () => {
            this.toAppAndRegister(url, true)
          }
        })
      } else {
        this.toAppAndRegister(url, false)
      }
    },
    checkEventFrom (str) {
      return ~str.indexOf(',') ? str : (str + ',')
    },
    toAppAndRegister (url, register) {
      if (register) {
        $onSigle('shareCallback', ({ success } = {}) => {
          this.$emit('shareCallback', { success })
          if (success) {
            //  分享成功
          } else {
            // 分享失败
          }
        })
      }
      toApp(url)
    },
    remWidth (num) {
      return pxToRem(num)
    },
    touchstartFn (index) {
      this.nowIndex = index
    },
    touchendFn (index) {
      setTimeout(() => {
        this.nowIndex = -1
      }, 50)
    }
    // reTurn (str) {
    //   return this[str]
    // },
    // log (str) {
    //   console.warn('str---', str)
    // }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@lib/common/stylus/variable.styl';
@import '~@lib/common/stylus/mixin.styl';

.share-btn-box {
  width: (750 / 2)px;
  height: (192 / 2)px;
  // background: #ccc;
  // opacity: 0.8;
  position: fixed;
  // top: (1142 / 2)px;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  box-sizing: border-box;
  padding-left: (70 / 2)px;
  background-image: url('http://pws.myhug.cn/npic/s/9/ff5839143920eed62b45b550a41979a32ce5bc8d80ca62');
  background-size: 100%, (192 / 2)px;
  background-color: #fff;
}

.button-container {
  max-width: 100%;
  margin: 0 auto;
  height: 100%;
  // padding: 0 19px;
  box-sizing: border-box;
  justify-content: space-between;

  // background: #eee;
  .share-btn {
    // background-color: #ddd;
    font-size: 12px;
    color: #2a2a30;

    .img-url {
      background-size: cover;
      margin-bottom: 10px;

      .choose-index {
        width: 100%;
        height: 100%;
        border-radius: 100%;
        background: rgba(0, 0, 0, 0.15);
      }
    }
  }
}
</style>
