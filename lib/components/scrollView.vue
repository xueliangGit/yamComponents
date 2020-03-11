<!--
 * @Author: zhengguozhi
 * @Date: 2019-05-06 14:22:32
 * @LastEditors: zhengguozhi
 * @LastEditTime: 2019-10-15 17:00:13
 -->
<template>
  <div
    :class="{'scorll-y':scrollY,'scorll-x':scrollX}"
    ref="scollContainer"
    :style="{height:height,width:width}"
    class="scroll-view-container"
  >
    <div :style="{height:pullHeight+'px'}" v-show="toTop" class="top-tip">
      <div class="in">
        <p
          v-show="pullHeight<doPullFlashPullHeight&&!isFlashing"
          class="show-pull-text"
        >{{pullText}}</p>
        <p
          v-show="pullHeight>doPullFlashPullHeight&&!isFlashing"
          class="show-flash-text"
        >{{canFlashText}}</p>
        <div v-if="isFlashing" class="show-flashing-text">
          <span class="qiu"></span>
          <span class="qiu"></span>
          <span class="qiu"></span>
          <p>{{flashText}}</p>
        </div>
      </div>
    </div>
    <div class="scroll-view-warp">
      <slot></slot>
    </div>
    <div class="bottom-tip" v-show="!scrollX">
      <p v-show="hasMore">{{bottomLoadingText}}</p>
      <p v-show="!hasMore">{{bottomText}}</p>
    </div>
  </div>
</template>

<script>
/**
 * 返回 upleft,upright,up,downleft,downright,down,left,right
 */
function getDirection (ori, now) {
  let direction = []
  if (ori.scrollTop > now.scrollTop) {
    direction.push('up')
  }
  if (ori.scrollTop < now.scrollTop) {
    direction.push('down')
  }
  if (ori.scrollTop === now.scrollTop) {
    direction.push('')
  }
  if (ori.scrollLeft > now.scrollLeft) {
    direction.push('left')
  }
  if (ori.scrollLeft < now.scrollLeft) {
    direction.push('right')
  }
  if (ori.scrollLeft === now.scrollLeft) {
    direction.push('')
  }
  return direction
}
import {throttle} from '@lib/common/config/mUtils.js'
import {setTimeout, clearTimeout} from 'timers'
export default {
  name: '',
  props: {
    scrollX: {
      type: Boolean,
      default: false
    },
    scrollY: {
      type: Boolean,
      default: false
    },
    useFlash: {
      type: Boolean,
      default: true
    },
    pullText: {
      type: String,
      default: '继续往下拉进行刷新'
    },
    canFlashText: {
      type: String,
      default: '释放刷新'
    },
    flashText: {
      type: String,
      default: '数据加载中...'
    },
    bottomLoadingText: {
      type: String,
      default: '数据加载中...'
    },
    bottomText: {
      type: String,
      default: '没数据了'
    },
    distance: {
      type: Number,
      default: 200
    },
    throttle: {
      type: Boolean,
      default: true
    },
    hasMore: {
      type: Boolean,
      default: true
    },
    height: {
      type: String,
      default: '100%'
    },
    width: {
      type: String,
      default: '100%'
    },
    timeOut: {
      type: Number,
      default: 5000
    }
  },
  mounted () {
    console.log(this.$refs.scollContainer)
    this.$refs.scollContainer.cacheScrollTop = 0
    this.$refs.scollContainer.cacheScrollLeft = 0
    this.$refs.scollContainer.addEventListener('scroll', (e) => {
      if (throttle) {
        throttle(this.scrollFn, {args: [e]})
      } else {
        this.scrollFn(e)
      }
    }, false)
    let touch = {
      oriHeight: 0,
      canDo: false,
      startClientX: 0,
      startClientY: 0,
      distanceX: 0,
      distanceY: 0,
      direction: []
    }
    // 绑定触摸事件
    this.$refs.scollContainer.addEventListener('touchstart', (e) => {
      if (this.toTop && !this.isFlashing && this.useFlash) {
        touch.canDo = true
        touch.oriHeight = this.pullHeight
        touch.startClientX = e.changedTouches[0].clientX
        touch.startClientY = e.changedTouches[0].clientY
      }
    }, false)
    this.$refs.scollContainer.addEventListener('touchmove', (e) => {
      if (touch.canDo) {
        touch.distanceX = e.changedTouches[0].clientX - touch.startClientX
        touch.distanceY = e.changedTouches[0].clientY - touch.startClientY
        touch.direction = [touch.distanceY > 0 ? 'down' : touch.distanceY < 0 ? 'up' : '', touch.distanceX > 0 ? 'right' : touch.distanceX < 0 ? 'left' : '']
        this.pullFlash(touch)
        if (touch.distanceY > 0) {
          e.preventDefault()
        }
      }
    }, false)
    this.$refs.scollContainer.addEventListener('touchend', (e) => {
      if (touch.canDo) {
        touch.canDo = false
        touch.distanceX = 0
        touch.distanceY = 0
        console.log(touch, touch.oriHeight + this.pullHeight)
        if (touch.oriHeight + this.pullHeight > this.doPullFlashPullHeight && this.toTop) {
          this.pullHeight = this.flashingPullHeight
          this.isFlashing = true
          this.startTimeoutPullFlash()
        } else {
          this.pullHeight = 0
          this.isFlashing = false
        }
      }
      // console.log('touchend', e.changedTouches)
    }, false)
  },
  data () {
    return {
      list: 500,
      pullHeight: 0,
      doPullFlashPullHeight: 70,
      flashingPullHeight: 50,
      isFlashing: false,
      timeoutPullFlash: null,
      toTop: true
    }
  },
  methods: {
    startTimeoutPullFlash () {
      if (this.timeoutPullFlash) {
        clearTimeout(this.timeoutPullFlash)
      }
      // 触发下拉刷新动作
      this.$emit('flash')
      this.timeoutPullFlash = setTimeout(() => {
        this._clearFlash()
      }, this.timeOut)
    },
    _clearFlash () {
      this.isFlashing = false
      this.pullHeight = 0
      this.timeoutPullFlash = null
    },
    flashEnd () {
      this._clearFlash()
    },
    scrollFn (e) {
      e.target.scrollDirection = getDirection({
        scrollTop: e.target.cacheScrollTop,
        scrollLeft: e.target.cacheScrollLeft
      }, {
        scrollTop: e.target.scrollTop,
        scrollLeft: e.target.scrollLeft
      })
      e.target.cachescrollTop = e.target.scrollTop
      this.$emit('scroll')
      // 监测触底操作
      if (e.target.scrollTop + e.target.offsetHeight + this.distance > e.target.scrollHeight) {
        console.log('触发了底部方法')
        this.$emit('scrolltolower')
      }
      // 监测触顶操作
      if (e.target.scrollTop === 0 && e.target.scrollDirection[0] !== 'down') {
        this.toTop = true
      } else {
        this.toTop = false
      }
    },
    pullFlash (touch) {
      this.pullHeight = touch.oriHeight + (touch.distanceY > 0 ? touch.distanceY : 0) / 2
    },
    emitFn () {

    }
  }
}
</script>

<style lang="stylus" scoped>
@keyframes upDown {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(0, -20px, 0);
  }
}

$timers = 400ms;

.scroll-view-container {
  height: 100%;
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  width: 100%;

  &.scorll-x {
    overflow-x: auto;
  }

  &.scorll-y {
    overflow-y: auto;
  }

  .top-tip {
    text-align: center;
    height: 0;
    max-height: 200px;
    background: #eee;
    display: block;
    overflow: hidden;

    .in {
      padding-top: 20px;
      color: #888;
    }
  }
}

.qiu {
  display: inline-block;
  background: #dddddd;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: upDown $timers linear 0s infinite alternate;

  &:nth-child(2) {
    animation-delay: ($timers / 2);
  }

  &:nth-child(3) {
    animation-delay: ($timers / 1);
  }

  &:nth-child(4) {
    animation-delay: ($timers / 1);
  }
}

.scroll-view-warp {
  height: auto;
  width: auto;
}

.bottom-tip {
  font-size: 24px;
  padding: 10px 0;
  color: #888888;
  text-align: center;
}
</style>
