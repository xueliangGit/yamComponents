<!--
 * @Author: xuxueliang
 * @Date: 2019-10-22 16:45:38
 * @LastEditors: zhengguozhi
 * @LastEditTime: 2020-03-04 17:10:26
 -->
<!--
顶部，底部固定是
z-index:5

全屏弹窗浮层时时需要遮挡大于5才行
 -->
<template>
  <div
    class="nav-content pos-r"
    :class="[(!hasStatusBar || hideContentStatusBar) && 'noStatusBar']"
    ref="$navContent"
    :style="globalStyle"
  >
    <div
      v-if="needFull"
      ref="$nav"
      class="fixed-top-bar ltr0 pos-f"
      :style="{
        color: navFeColor,
        backgroundColor: !scrollColor ? navBkColor : ''
      }"
    >
      <!-- 占位 -->
      <div v-if="needFull" :style="{ height: !hasStatusBar ? '0px' : statusBarHeight + 'px' }"></div>
      <div class="pos-r nav fs-24">
        <span v-show="needFull && hasBack" @click="back" class="back">
          <i class="iconfont icon-back"></i>
        </span>
        <h1
          v-if="!newTab && needFull"
          :style="{ fontSize: navFontsize }"
          class="nav-title"
        >{{ title || '耳觅' }}</h1>
        <slot name="newtab" v-if="newTab" class="nav-title" />
        <span class="nav-right">
          <slot name="nav-right" />
        </span>
        <div class="nav-fixed">
          <slot name="nav-fixed" />
        </div>
      </div>
    </div>
    <!-- 占位 -->
    <div
      v-if="!hideContentStatusBar"
      :style="{
        minHeight: spaceHeight + 'px',
        maxHeight: spaceHeight + 'px',
        backgroundColor: navBkColor
      }"
    ></div>
    <div
      class="nav-main-content"
      :style="{
        maxHeight: contentHeight,
        minHeight: contentHeight,
        height: contentHeight
      }"
      ref="$content"
      :class="[isCanScroll && 'can-scroll']"
    >
      <slot />
    </div>
    <div class="nav-bottom-fixed">
      <slot name="nav-bottom-fixed" />
    </div>
  </div>
</template>

<script>
// import Toast from '@lib/plugins/Sloth/Toast/'
import '@lib/common/config/fixIosDoubleTap.js'
import { getCookie, throttle } from '@lib/common/config/mUtils'// setCookie,
import $localStorage from '@lib/plugins/Sloth/localStorage'
import { beginTest, endTest } from '@lib/common/config/toTestGesture/fn'
// , isIOS, isOldVersion, isBaoBao
import { $on, toApp, initWindowSizeChange, isAndroid, navtiveInjectParam } from '@lib/eryuSdk/index'
initWindowSizeChange()
// let index = 0
let bkRgba = [0, 0, 0, 0]
let reachBottom = false
let reachTop = false
let isMayEmitTouchMoveEvent = false
// 设置的app statusBar height
const statusBarHeight = 32
// 导航条高度
const navBarHeight = 43
let nativeBarHeight = null
let cookieStatusBarHeight = null
if (isAndroid) {
  cookieStatusBarHeight = getCookie('statusBarHeight')
}
const devicePixelRatio = window.devicePixelRatio
if (cookieStatusBarHeight !== null) {
  // 针对cookie中存值的
  nativeBarHeight = getStatusBarHeight(cookieStatusBarHeight)
} else {
  if (navtiveInjectParam && navtiveInjectParam.statusBarHeight !== undefined) {
    $localStorage.set('barHeight', getStatusBarHeight(navtiveInjectParam.statusBarHeight))
    nativeBarHeight = getStatusBarHeight(navtiveInjectParam.statusBarHeight)
  } else {
    nativeBarHeight = +($localStorage.get('barHeight') || statusBarHeight)
  }
}
// console.log('nativeBarHeight', nativeBarHeight)
function getStatusBarHeight (h) {
  return isAndroid ? h / devicePixelRatio : h
}
// 使用toFixed 来修正滚动到小数的情况
function fixedScrollTopAndOffsetHeight ($elm) {
  return ($elm.scrollTop + $elm.offsetHeight).toFixed(0)
}
export default {
  name: '',
  props: {
    // // 顶部背景颜色高度
    // bkColorHeight: {
    //   type: Number,
    //   default: 50
    // },
    // 是否需要全屏
    needFull: {
      type: Boolean,
      default: true
    },
    // 是否隐藏内容区的statusbar
    hideContentStatusBar: {
      type: Boolean,
      default: false
    },
    // 是否允许手势进入测试页面，调试等
    isTestGesture: {
      type: Boolean,
      default: true
    },
    // 是否全屏 内容去置顶
    isFull: {
      type: Boolean,
      default: false
    },
    // 是否包含状态栏
    hasStatusBar: {
      type: Boolean,
      default: true
    },
    // 是否隐藏回退按钮
    hasBack: {
      tyep: Boolean,
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
    // 全局样式 主要是底色
    globalStyle: {
      type: Object,
      default: () => {
        return {
          background: '#fff'
        }
      }
    },
    // 导航背景色
    navBkColor: {
      type: String,
      default: '#fff'
    },
    // 导航前景色
    navFeColor: {
      type: String,
      default: '#333'
    },
    // 导航字号
    navFontsize: {
      type: String,
      default: '20px'
    },
    // 是否是滚动变色的？
    scrollColor: {
      type: Boolean,
      default: false
    },
    // 是否滚动
    scroll: {
      type: Boolean,
      default: false
    },
    // 比例 默认是1 375 2 750
    scale: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      windowHeight: window.innerHeight,
      navBarHeight: navBarHeight,
      backParams: {},
      isAndroid: isAndroid,
      barHeight: 0,
      statusBarHeight: nativeBarHeight !== null ? nativeBarHeight : statusBarHeight
      // bkRgba: [0, 0, 0, 0]
    }
  },
  created () {
    $on('window.resize', this.resize)
    this.windowHeight = window.innerHeight
    console.log(document.referrer)
    // this.hideAppTitle()
    // 抱抱8.5.0使用全屏 //|| (isIOS && isBaoBao && !isOldVersion('8.5.0')) 暂缓
    if (this.needFull && (this.isAndroid)) {
      toApp({ 'type': 'hideTitle' })
    }
  },
  watch: {
    navBkColor (to, from) {
      if (this.isReady) {
        this.initNav()
      }
    },
    globalStyle (to, from) {
      if (this.isReady) {
        this.initNav()
      }
    },
    title: {
      immediate: true,
      handler () {
        console.log('title--', this.title)
        document.title = this.title
      }
    }
  },
  mounted () {
    this.navBarHeight = navBarHeight * window.innerWidth / 375
    this.initNav()
    this.bindScroll()
    this.initTouchEvent()
    $on('setBackParams', (data) => {
      if (typeof data === 'object') {
        Object.assign(this.backParams, data)
      }
    })
  },
  updated () {
    // 需要每次更新获取他的总高度是否可以滚动；
    this.setReach()
  },
  computed: {
    isCanScroll () {
      return true
    },
    spaceHeight () {
      return (!this.needFull || this.hideContentStatusBar) ? 0 : ((!this.isFull ? this.navBarHeight : 0) + (!this.hasStatusBar ? 0 : (this.statusBarHeight)))// this.barHeight
    },
    contentHeight () {
      // this.windowHeight
      return this.spaceHeight > 0 ? `calc(100% - ${ this.spaceHeight }px)` : '100%'
    }
  },
  methods: {
    resize () {
      this.windowHeight = window.innerHeight
    },
    gotTop () {
      this.$refs.$content.scrollTop = 0
    },
    getBkHeight () {
      return Math.max(this.getNavHeight(), 82) + 82
    },
    getNavHeight () {
      return this.$refs.$nav ? this.$refs.$nav.offsetHeight : 0
    },
    initNav () {
      // 若果有颜色渐变
      if (this.scrollColor) {
        bkRgba = this.colorToRgba(this.navBkColor, 0)
        console.log(bkRgba)
      }
      // if (this.statusBarHeight === statusBarHeight && window.eryu) {
      //   this.statusBarHeight = window.eryu.statusBarHeight || this.statusBarHeight
      // }
      // 安卓 5.1 处理
      this.$nextTick(() => {
        this.barHeight = this.getNavHeight() || (60 + this.statusBarHeight)
      })
      this.$refs.$navContent.style.backgroundImage = 'linear-gradient(180deg, ' + (this.navBkColor || '#fff') + ' ' + this.getBkHeight() + 'px,' + (this.globalStyle.backgroundColor || '#fff ') + ' ' + this.getBkHeight() + 'px)'
      // console.log('linear-gradient(180deg, ' + (this.navBkColor || '#fff') + ' ' + this.getNavHeight() + 'px,' + (this.globalStyle.backgroundColor || '#fff ') + ' ' + this.getNavHeight() + 'px)')
      this.setReach()
      this.isReady = true
    },
    setReach () {
      reachBottom = this.$refs.$content.scrollHeight <= fixedScrollTopAndOffsetHeight(this.$refs.$content)
      // console.warn(this.$refs.$content.scrollHeight, this.$refs.$content.scrollTop, this.$refs.$content.offsetHeight, fixedScrollTopAndOffsetHeight(this.$refs.$content))
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
        hasMaybeScrollUp: false,
        hasMaybeScrollDown: false,
        hasScrolling: false,
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
        this.setReach()
        // 处理有有内部滚动时的情况
        let $obj = e.target
        while ($obj) {
          if ($obj === this.$refs.$navContent || $obj === this.$refs.$content) {
            break
          }
          if ($obj.scrollTop > 0 && $obj.scrollHeight > fixedScrollTopAndOffsetHeight($obj)) {
            touch.hasScrolling = true
            break
          } else if ($obj.scrollHeight > $obj.offsetHeight && $obj.scrollTop === 0 && !touch.hasMaybeScrollUp) {
            let overFlowStatue = GetCurrentStyle($obj, 'overflow')
            if (overFlowStatue === 'auto' || overFlowStatue === 'hidden auto') {
              touch.hasMaybeScrollUp = true
            }
          } else if ($obj.scrollHeight > $obj.offsetHeight && $obj.scrollHeight <= $obj.offsetHeight + $obj.scrollTop && !touch.hasMaybeScrollDown) {
            let overFlowStatue = GetCurrentStyle($obj, 'overflow')
            if (overFlowStatue === 'auto' || overFlowStatue === 'hidden auto') {
              touch.hasMaybeScrollDown = true
            }
          }
          $obj = $obj.parentElement
        }
        if (e.changedTouches[0].clientX > 10) {
          if (!touch.hasScrolling && (reachTop || reachBottom)) {
            // toFixed 修正
            this.$refs.$content.style.transition = ``
            touch.canDo = true
            touch.oriHeight = this.pullHeight
            touch.startClientX = e.changedTouches[0].clientX
            touch.startClientY = e.changedTouches[0].clientY
            isMayEmitTouchMoveEvent = true
          }
          touch.hasScrolling = false
          // 重置一下触顶触底的flag
          // this.setReach()
        } else {
          // 可能触发返回，不做操作
        }
        if (this.isTestGesture) {
          beginTest(e)
        }
      }, false)
      this.$refs.$navContent.addEventListener('touchmove', (e) => {
        if (touch.canDo) {
          touch.distanceX = e.changedTouches[0].clientX - touch.startClientX
          touch.distanceY = e.changedTouches[0].clientY - touch.startClientY
          touch.direction = [touch.distanceY > 0 ? 'down' : touch.distanceY < 0 ? 'up' : '', touch.distanceX > 0 ? 'right' : touch.distanceX < 0 ? 'left' : '']
          // 处理内部 滚动
          if (touch.direction[0] === 'up' && touch.hasMaybeScrollUp) {
            // console.log('upup')
            return
          }
          if (touch.direction[0] === 'down' && touch.hasMaybeScrollDown) {
            // console.log('downdown')
            return
          }
          if (touch.distanceY > 0 && reachTop) {
            touch.translate3dY = touch.distanceY / 5
            // this.$refs.$content.style.transform = `translate3d(0,${ touch.translate3dY > this.navBarHeight ? this.navBarHeight : touch.translate3dY }px,0)`
            this.$refs.$content.style.marginTop = `${ touch.translate3dY > this.navBarHeight ? this.navBarHeight : touch.translate3dY }px`
            // console.log('touch', touch.distanceY)
            e.preventDefault()
            // e.stopPropagation()
          }
          // console.log('------2')
          // console.log(touch.hasScrolling, this.$refs.$content.scrollHeight <= fixedScrollTopAndOffsetHeight(this.$refs.$content), reachTop, reachBottom, 'cando:' + touch.canDo)
          // console.log('------2')
          if (touch.distanceY < 0 && reachBottom) {
            touch.translate3dY = -Math.abs(touch.distanceY / 5)
            // this.$refs.$content.style.transform = `translate3d(0,${ -touch.translate3dY > this.navBarHeight ? -this.navBarHeight : touch.translate3dY }px,0)`
            this.$refs.$content.style.marginTop = `${ -touch.translate3dY > this.navBarHeight ? -this.navBarHeight : touch.translate3dY }px`

            // 执行bottom
            e.preventDefault()
          }
        }
      }, false)
      this.$refs.$navContent.addEventListener('touchend', (e) => {
        if (touch.canDo) {
          touch.hasMaybeScrollUp = false
          touch.hasMaybeScrollDown = false
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
                // 下拉事件
                this.$emit('on-pull-down')
              } else if (touch.translate3dY < 0 && reachBottom) {
                // 上拉事件
                this.$emit('on-pull-up')
              }
            }
            touch.translate3dY = 0
          }
          isMayEmitTouchMoveEvent = false
        }
        if (this.isTestGesture) {
          endTest(e)
        }
      }, false)
    },
    bindScroll () {
      this.$refs.$content.addEventListener('scroll', (e) => {
        // 渐变色
        if (this.scrollColor) {
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
        // 监测触底操作 监测触顶操作
        // console.log('---scroll-setReach----')
        // 滚动事件
        if (this.scroll) {
          this.$emit('on-scroll', { reachBottom, reachTop })
          // if (reachTop) {
          //   this.$emit('on-reach-top')
          // }
          // if (reachBottom) {
          //   this.$emit('on-reach-bottom')
          // }
        }
        throttle(this.scrollThrottle, { time: 50 })
      }, false)
    },
    scrollThrottle () {
      if (!isMayEmitTouchMoveEvent) {
        this.setReach()
        if (this.scroll) {
          if (reachTop) {
            this.$emit('on-reach-top')
          }
          if (reachBottom) {
            this.$emit('on-reach-bottom')
          }
        }
      }
    },
    setNavbarBk (bkRgba) {
      this.$refs.$nav.style.backgroundColor = `rgba(${ bkRgba.join(',') })`
    },
    checkTypeMoble () {

    },
    canBack () {
      if (!document.referrer) {
        return false
      } else {
        if (document.referrer === window.location.href) {
          return false
        }
        return true
      }
    },
    back () {
      console.log('back--', this.canBack())
      let params = {
        type: 'goBack'
      }
      historyBackWFallback(() => {
        console.log('app back')
        toApp(Object.assign(params, this.backParams))
        // window.location.assign(`eryu://jump#${ JSON.stringify() }`)
      })
      // if (this.canBack()) {
      //   window.history.go(-1)
      // } else {
      //   console.log('schema-goBack-')

      //   console.log()
      //   // window.location.assign(`eryu://jump#${ JSON.stringify(Object.assign(params, this.backParams)) }`)
      // }
    }
  }
}
function GetCurrentStyle (obj, prop) {
  if (obj.currentStyle) {
    return obj.currentStyle[prop]
  } else if (window.getComputedStyle) {
    prop = prop.replace(/([A-Z])/g, '-$1')
    prop = prop.toLowerCase()
    return document.defaultView.getComputedStyle(obj, null)[prop]
  } return null
}

function historyBackWFallback (fallbackUrl) {
  fallbackUrl = fallbackUrl || '/'
  var prevPage = window.location.href

  window.history.go(-1)

  setTimeout(function () {
    if (window.location.href === prevPage) {
      if (typeof fallbackUrl === 'function') {
        fallbackUrl()
      } else {
        window.location.href = fallbackUrl
      }
    }
  }, 500)
}
</script>

<style lang="stylus" scoped>
@import 'assets/font/nav.font.css';
@import '~@lib/common/stylus/variable.styl';

$navScale = $scale;
$height = $navHeight * $navScale;
$normalTop = 0px;
$contextHeight = $height + $normalTop;
$fontSize = $navFontSize * $navScale;
$backFS = $backFontSize * $navScale;

.fs-24 {
  font-size: $fontSize;
}

.icon-back {
  font-size: $backFS;
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
  // display: flex;
  flex-direction: column;

  // height: 100vh;
  &.noStatusBar {
    overflow: hidden;
  }
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

.nav-main-content {
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
  z-index: $zindex-back-top;

  img {
    width: 60%;
    margin: 20%;
  }
}

.nav-title {
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
  // height: 0;
}

.nav-bottom-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  // height: 0;
  z-index: 5;
}
</style>
<style lang="stylus">
body, html {
  height: 100%;
}
</style>
