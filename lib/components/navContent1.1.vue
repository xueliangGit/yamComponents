<!--
 * @Author: xuxueliang
 * @Date: 2019-10-22 16:45:38
 * @LastEditors: xuxueliang
 * @LastEditTime: 2019-11-04 19:30:29
 -->
<template>
  <div class="nav-content pos-r" ref="$navContent" :style="globalStyle">
    <div
      ref="$nav"
      class="fixed-top-bar ltr0"
      :class="[(top||barHeight)&&'pos-f']"
      :style="styleObject"
    >
      <!-- 占位 -->
      <div :style="{height:!isFull?'0px':(statusBarHeight+'px')}"></div>
      <div class="pos-r nav fs-24">
        <span v-show="isFull" @click="back" class="back">
          <i class="iconfont icon-back"></i>
        </span>
        <h1 v-if="!newTab" class="title">{{title||'耳觅'}}</h1>
        <slot name="newtab" v-if="newTab" class="title" />
        <span class="nav-right">
          <slot name="nav-right" />
        </span>
        <div class="nav-fixed">
          <slot name="nav-fixed" />
        </div>
      </div>
    </div>
    <!-- 占位 -->
    <div :style="{minHeight:spaceHeight+'px',maxHeight:spaceHeight+'px'}"></div>
    <div
      class="content"
      :style="{maxHeight:'calc(100vh - '+spaceHeight+'px)',minHeight:'calc(100vh - '+spaceHeight+'px)'}"
      ref="$content"
      :class="[top&&'nav-top',isCanScroll&&'can-scroll']"
    >
      <slot />
    </div>
  </div>
</template>

<script>
// import Toast from '@lib/plugins/Sloth/Toast/'
import { setCookie, getCookie } from '@lib/common/config/mUtils'
import Browser from '@lib/plugins/Sloth/Browser'
import { beginTest, endTest } from '@lib/common/config/toTestGesture/fn'
// let index = 0
let bkRgba = [0, 0, 0, 0]
let reachBottom = false
let reachTop = false
// 设置的app statusBar height
const statusBarHeight = 32
// 导航条高度
const navBarHeight = 40
const isAndroid = Browser.getBrowser().isAndroid
const isIOS = Browser.getBrowser().isIOS
let nativeBarHeight = 0
if (isIOS) {
  if (window.eryu && window.eryu.statusBarHeight) {
    setCookie('barHeight', window.eryu.statusBarHeight)
    nativeBarHeight = window.eryu.statusBarHeight
  } else {
    nativeBarHeight = getCookie('barHeight') || statusBarHeight
  }
}
export default {
  name: '',
  props: {
    // 是否全屏
    isFull: {
      type: Boolean,
      default: true
    },
    // 替换自己的tabbar
    newTab: {
      type: Boolean,
      default: false
    },
    // 标题
    title: {
      type: String,
      default: '耳觅'
    },
    // 内容区域是否有padding-top为0
    top: {
      type: Boolean,
      default: false
    },
    // 样式
    styleObject: {
      type: Object,
      default: () => {
        return {
          background: '#fff'
        }
      }
    },
    // 样式
    globalStyle: {
      type: Object,
      default: () => {
        return {
          background: '#fff'
        }
      }
    },
    bkColor: {
      type: String,
      default: ''
    },
    // 是否滚动
    scroll: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isAndroid: isAndroid,
      barHeight: 0,
      statusBarHeight: isAndroid ? statusBarHeight : nativeBarHeight
      // bkRgba: [0, 0, 0, 0]
    }
  },
  created () {
    console.log(document.referrer)
    // this.hideAppTitle()
    if (this.isAndroid) {
      this.targetApp(`eryu://jump#{"type":"hideTitle"}`)
    }
  },
  mounted () {
    this.initNav()
    this.bindScroll()
    this.initTouchEvent()
  },
  updated () {
    // 需要每次更新获取他的总高度是否可以滚动；
    this.setreach()
  },
  computed: {
    isCanScroll () {
      return true
    },
    spaceHeight () {
      return !this.top ? this.barHeight : !this.isFull ? '0' : (this.statusBarHeight)
    },
    contentHeight () {
      return window.innerHeight - this.spaceHeight
    }
  },
  methods: {
    initNav () {
      // 若果有颜色渐变
      if (this.bkColor) {
        bkRgba = this.colorToRgba(this.bkColor, 0)
      }
      // if (this.statusBarHeight === statusBarHeight && window.eryu) {
      //   this.statusBarHeight = window.eryu.statusBarHeight || this.statusBarHeight
      // }
      // 安卓 5.1 处理
      this.$nextTick(() => {
        this.barHeight = this.$refs.$nav.offsetHeight || (60 + this.statusBarHeight)
      })
      this.$refs.$navContent.style.backgroundImage = 'linear-gradient(180deg, ' + (this.bkColor || '#fff') + ' ' + this.$refs.$nav.offsetHeight + 'px, #fff ' + this.$refs.$nav.offsetHeight + 'px)'
      this.setreach()
      this.isReady = true
    },
    setreach () {
      reachBottom = this.$refs.$content.scrollHeight <= this.$refs.$content.scrollTop + this.$refs.$content.offsetHeight
      reachTop = this.$refs.$content.scrollTop === 0
    },
    colorToRgba: (sHex, alpha = 1, isGet = true) => {
      // 十六进制颜色值的正则表达式
      var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
      /* 16进制颜色转为RGB格式 */
      let sColor = sHex.toLowerCase()
      if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
          var sColorNew = '#'
          for (let i = 1; i < 4; i += 1) {
            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
          }
          sColor = sColorNew
        }
        //  处理六位的颜色值
        var sColorChange = []
        for (let i = 1; i < 7; i += 2) {
          sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
        }
        // return sColorChange.join(',')
        // 或
        sColorChange.push(alpha)
        return isGet ? sColorChange : 'rgba(' + sColorChange.join(',') + ')'
      } else {
        return sColor
      }
    },
    initTouchEvent () {
      let touch = {
        oriHeight: 0,
        canDo: false,
        startClientX: 0,
        startClientY: 0,
        distanceX: 0,
        distanceY: 0,
        direction: [],
        translate3dY: 0
      }

      // 绑定触摸事件
      this.$refs.$navContent.addEventListener('touchstart', (e) => {
        // console.log(this.$refs.$content.scrollHeight <= this.$refs.$content.scrollTop + this.$refs.$content.offsetHeight)
        if ((this.$refs.$content.scrollTop === 0) || (this.$refs.$content.scrollHeight <= this.$refs.$content.scrollTop + this.$refs.$content.offsetHeight)) {
          this.$refs.$content.style.transition = ``
          touch.canDo = true
          touch.oriHeight = this.pullHeight
          touch.startClientX = e.changedTouches[0].clientX
          touch.startClientY = e.changedTouches[0].clientY
        }
        beginTest(e)
      }, false)
      this.$refs.$navContent.addEventListener('touchmove', (e) => {
        if (touch.canDo) {
          touch.distanceX = e.changedTouches[0].clientX - touch.startClientX
          touch.distanceY = e.changedTouches[0].clientY - touch.startClientY
          touch.direction = [touch.distanceY > 0 ? 'down' : touch.distanceY < 0 ? 'up' : '', touch.distanceX > 0 ? 'right' : touch.distanceX < 0 ? 'left' : '']
          // this.pullFlash(touch)
          if (touch.distanceY > 0 && reachTop) {
            touch.translate3dY = touch.distanceY / 5
            // this.$refs.$content.style.transform = `translate3d(0,${ touch.translate3dY > 60 ? 60 : touch.translate3dY }px,0)`
            this.$refs.$content.style.marginTop = `${ touch.translate3dY > navBarHeight ? navBarHeight : touch.translate3dY }px`
            // console.log('touch', touch.distanceY)
            e.preventDefault()
          }
          if (touch.distanceY < 0 && reachBottom) {
            touch.translate3dY = -Math.abs(touch.distanceY / 5)
            // this.$refs.$content.style.transform = `translate3d(0,${ -touch.translate3dY > 60 ? -60 : touch.translate3dY }px,0)`
            this.$refs.$content.style.marginTop = `${ -touch.translate3dY > navBarHeight ? -navBarHeight : touch.translate3dY }px`

            // console.log('touch', touch.distanceY)
            // 执行bottom
            e.preventDefault()
          }
        }
      }, false)
      this.$refs.$navContent.addEventListener('touchend', (e) => {
        if (touch.canDo) {
          touch.canDo = false
          touch.distanceX = 0
          touch.distanceY = 0
          if (touch.translate3dY) {
            this.$refs.$content.style.transition = `all 0.2s`
            // this.$refs.$content.style.transform = `translate3d(0,0,0)`
            this.$refs.$content.style.marginTop = `0`
            // 触发方法
            if (this.scroll) {
              if (touch.translate3dY > 0 && reachTop) {
                this.$emit('on-reach-top')
              } else if (touch.translate3dY < 0 && reachBottom) {
                this.$emit('on-reach-bottom')
              }
            }
            touch.translate3dY = 0
          }
        }
        endTest(e)
      }, false)
    },
    bindScroll () {
      this.$refs.$content.addEventListener('scroll', (e) => {
        // 渐变色
        if (this.bkColor) {
          if (e.target.scrollTop <= 230) {
            // console.log(e.target.scrollTop)
            bkRgba[3] = (e.target.scrollTop / 231).toFixed(2)
            this.setNavbarBk(bkRgba)
          } else if (bkRgba[3] < 0.9) {
            bkRgba[3] = 0.99
            this.setNavbarBk(bkRgba)
          }
        }

        //
        // 监测触底操作
        if (e.target.scrollTop + e.target.offsetHeight >= e.target.scrollHeight) {
          console.log('触发了底部方法')
          reachBottom = true
        } else {
          reachBottom = false
        }
        // 监测触顶操作
        if (e.target.scrollTop === 0) {
          reachTop = true
        } else {
          reachTop = false
        }
        // 滚动事件
        if (this.scroll) {
          this.$emit('on-scroll', { reachBottom, reachTop })
          if (reachTop) {
            this.$emit('on-reach-top')
          }
          if (reachBottom) {
            this.$emit('on-reach-bottom')
          }
        }
      }, false)
    },
    setNavbarBk (bkRgba) {
      this.$refs.$nav.style.backgroundColor = `rgba(${ bkRgba.join(',') })`
    },
    // clickH () {
    //   index++
    //   if (index === 4) {
    //     Toast.center('再点一下，进入调试模式')
    //   }
    //   if (index >= 5) {

    //   }
    // },
    targetApp (url) {
      window.location.assign(url)
    },
    checkTypeMoble () {

    },
    hideAppTitle () {
      window['eryu'] && window.eryu['hideTitle'] && window.eryu.hideTitle()
    },
    canBack () {
      if (!document.referrer) {
        return false
      } else {
        return true
      }
    },
    back () {
      console.log('back--', this.canBack())
      if (this.canBack()) {
        window.history.go(-1)
      } else {
        console.log('schema-goBack-')
        window.location.assign(`eryu://jump#{"type":"goBack"}`)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import url('//at.alicdn.com/t/font_1480547_x2qcl740hae.css');

$height = 44px;
$normalTop = 0px;
$contextHeight = $height + $normalTop;
$fontSize = 24px;

.fs-24 {
  font-size: $fontSize;
}

.icon-back {
  font-size: 28px;
}

.pos-r {
  position: relative;
}

.pos-a {
  position: absolute;
}

.pos-f {
  position: fixed;
}

.nav-content {
  height: 100%;
  // overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.ltr0 {
  left: 0;
  right: 0;
  top: 0;
}

.nav {
  text-align: center;
  // height: $height;
  line-height: $height;
  top: $normalTop;
}

.fixed-top-bar {
  z-index: 5;
  width: 100%;
}

.content {
  // padding-top: $contextHeight;
  // max-height: 100vh;
  box-sizing: border-box;
  overflow-y: auto;
  width: 100vw;
  max-height: 100%;
  flex: auto;
}

.can-scroll {
  overflow-scrolling: touch;
  -webkit-overflow-scrolling: touch;
}

.back {
  display: inline-block;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: $height;
  height: $height;

  img {
    width: 60%;
    margin: 20%;
  }
}

.title {
  margin: 0 $height;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  font-size: 20px;
}

.nav-top {
  padding-top: 0;
}

.nav-right {
  width: $height;
  height: $height;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-fixed {
  height: 0;
}
</style>
