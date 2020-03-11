<!--
 * @Author: zhengguozhi
 * @Date: 2019-11-21 11:31:32
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-02 16:11:52
 -->
<template>
  <div id :class="[prefixCls, 'mc', 'pos-r']">
    <div v-if="hasTabs" :class="[prefixCls + '-nav']">
      <div :class="barClasses" :style="barStyle"></div>
      <div
        :class="[tabCls(item), 'flex-center']"
        v-for="(item, index) in navList"
        :key="index"
        @click="handleChange(index)"
      >
        {{ item.label }}
      </div>
    </div>
    <div :class="contentClasses" :style="contentStyle" ref="panes">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// import { Indicator } from 'mint-ui'
// import tpl from '@components/tpl'
// import {initHttp} from '@api'
import getParam from '@lib/plugins/Sloth/getParam'
import { findComponentsDownward } from '@lib/common/config/mUtils'
import { isIOS } from '@lib/eryuSdk'
let urlParam = getParam()
const prefixCls = 'bbfe-tabs'
const transitionTime = 300 // from CSS
export default {
  components: {
    // tpl
  },
  provide () {
    return { TabsInstance: this }
  },
  data () {
    return {
      panesWidth: 0,
      touchMoveDisTance: 0,
      prefixCls: prefixCls,
      navList: [{
        label: '转盘',
        name: 'tab1'
      }, {
        label: '碎片兑换',
        name: 'tab2'
      }],
      activeKey: this.value,
      yUId: ''
    }
  },
  props: {
    hasTabs: {
      type: Boolean,
      default: true
    },
    value: {
      type: [String, Number]
    },
    touchMove: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value (val) {
      console.log('value--', val)
      this.activeKey = val
      this.focusedKey = val
    },
    activeKey (val) {
      this.focusedKey = val
      // this.updateBar()
      // this.updateStatus()
      // this.broadcast('Table', 'on-visible-change', true)
      // this.$nextTick(() => {
      //   this.scrollToActiveTab()
      // })
      // update visibility
      const nextIndex = Math.max(this.getTabIndex(this.focusedKey), 0)
      this.updateVisibility(nextIndex)
    }
  },
  computed: {
    barClasses () {
      return [`${ prefixCls }-ink-bar`]
    },
    contentClasses () {
      return [`${ prefixCls }-content`, `${ prefixCls }-content-animated`, `${ isIOS ? 'IOS' : '' }`]
    },
    contentStyle () {
      const x = this.getTabIndex(this.activeKey)
      // const p = x === 0 ? '0%' : `-${ x }00%`
      let p = 0
      if (this.touchMove && this.touchMoveDisTance !== 0) {
        p = -x * this.panesWidth + this.touchMoveDisTance + 'px'
      } else {
        p = x === 0 ? '0%' : `-${ x }00%`
      }
      let style = {}
      if (x > -1) {
        style = {
          // transform: `translateX(${ p }) translateZ(0px)`
          transform: `translate3d(${ p }, 0, 0)`
        }
        if (this.touchMoveDisTance !== 0 || this.isUpdating) {
          style.transition = 'none'
        }
      }
      return style
    },
    tabpaneStyle () {
      return {}
      // return {
      //   visibility: this.TabsInstance.activeKey !== this.currentName ? 'hidden' : 'visible'
      // }
    },
    barStyle () {
      return {}
    }
  },
  created () {
    this.yUId = urlParam.yUId || ''
  },
  // 加载数据
  mounted () {
    // initHttp().then((res) => {
    //   console.log(res)
    // })
    // Indicator.open({
    //   text: '加载中...',
    //   spinnerType: 'fading-circle'
    // })
    // setTimeout(function () {
    //   Indicator.close()
    // }, 3000)
    if (this.touchMove) {
      this.panesWidth = this.$refs.panes.offsetWidth
      window.dataProcess && window.dataProcess.push({
        type: 'mounted',
        panesWidth: this.panesWidth
      })
      this.initTouchMove()
    }

    this.updateVisibility(this.getTabIndex(this.activeKey))
  },
  // 相关操作事件
  methods: {
    getPanesWidth () {
    },
    initTouchMove () {
      let $elm = this.$refs.panes
      let index = 0
      let touchArg = {
        startX: 0,
        startY: 0,
        isLocked: false,
        horizontal: false,
        vertical: false,
        maybeBack: false,
        timeStamp: 0,
        clear () {
          this.isLocked = false
          this.vertical = false
          this.horizontal = false
          this.startX = 0
          this.startY = 0
          this.timeStamp = 0
        },
        initStartx (e) {
          this.clear()
          let { X, Y } = this.getDistance(e)
          this.startY = Y
          this.startX = X
          if (X < 20) {
            this.maybeBack = true
          } else {
            this.maybeBack = false
          }
          this.timeStamp = e.timeStamp
        },
        check (e) {
          let { X, Y } = this.getDistance(e)
          if (Math.abs(Y) / Math.abs(X) > 0.57) {
            // 上下
            this.vertical = true
          } else {
            // 左右
            this.horizontal = true
          }
          this.isLocked = true
        },
        getDistance (e) {
          return {
            Y: e.changedTouches[0].clientY - this.startY,
            X: e.changedTouches[0].clientX - this.startX
          }
        }
      }
      $elm.addEventListener('touchstart', (e) => {
        index = this.getTabIndex(this.activeKey)
        touchArg.initStartx(e)
        if (!this.panesWidth) {
          // 某些情况 宽度获取为空 需要处理一下
          this.panesWidth = this.$refs.panes.offsetWidth
        }
      }, true)
      $elm.addEventListener('touchmove', (e) => {
        if (!touchArg.isLocked) {
          touchArg.check(e)
        }
        if (touchArg.vertical) {
        }
        if (touchArg.horizontal) {
          let { X } = touchArg.getDistance(e)
          if ((index === 0 && X < 0) || (index === this.navList.length - 1 && X > 0) || (index < this.navList.length - 1 && index > 0)) {
            this.touchMoveDisTance = X
          }
          // e.preventDefault()
          if (!this.maybeBack) {
            e.preventDefault()
          }
          e.stopPropagation()
        }
      }, false)
      $elm.addEventListener('touchend', (e) => {
        if (touchArg.horizontal) {
          let { X } = touchArg.getDistance(e)
          // 先判断是否是瞬时滑动
          // 不是瞬时滑动那就直接判断距离
          if (e.timeStamp - touchArg.timeStamp < 500 || this.panesWidth / 3 < Math.abs(X)) {
            if (X > 0) { // 向左
              this.handleChange(--index >= 0 ? index : (index + 1))
            } else { // 向右
              this.handleChange(++index <= this.navList.length - 1 ? index : (index - 1))
            }
            window.dataProcess && window.dataProcess.push({
              type: 'touchend',
              touchArg: JSON.parse(JSON.stringify(touchArg)),
              index,
              style: this.contentStyle,
              panesWidth: this.panesWidth,
              // navList: [].concat(this.navList),
              touchMoveDisTance: this.touchMoveDisTance
            })
          }
          this.touchMoveDisTance = 0
        }
      }, false)
    },
    toAddress () {
      window.location.href = 'address.html'
    },
    tabCls (item) {
      return [
        `${ prefixCls }-tab`, { [`${ prefixCls }-tab-active`]: item.name === this.activeKey }
      ]
    },
    handleChange (index) {
      const nav = this.navList[index]
      this.activeKey = nav.name
      this.$emit('handleChange', index, nav)
    },
    getTabIndex (name) {
      return this.navList.findIndex(nav => nav.name === name)
    },
    duihuanHandle () {
      location.href = 'https://www.myhug.cn/wap/debrisExchange/index.html?yUId=' + this.yUId
    },
    updateNav () {
      this.isUpdating = true
      this.navList = []
      this.getTabs().forEach((pane, index) => {
        this.navList.push({
          labelType: typeof pane.label,
          label: pane.label,
          icon: pane.icon || '',
          name: pane.currentName || index,
          disabled: pane.disabled,
          closable: pane.closable
        })
        if (!pane.currentName) pane.currentName = index
        if (index === 0) {
          if (!this.activeKey) this.activeKey = pane.currentName || index
        }
      })
      this.$nextTick(() => {
        Promise.resolve().then(() => { this.isUpdating = false })
      })
      // this.updateStatus()
      // this.updateBar()
    },
    updateStatus () {
      const tabs = this.getTabs()
      // eslint-disable-next-line no-return-assign
      tabs.forEach(tab => tab.show = (tab.currentName === this.activeKey) || this.animated)
    },
    getTabs () {
      // return this.$children.filter(item => item.$options.name === 'TabPane');
      const AllTabPanes = findComponentsDownward(this, 'TabPane')
      const TabPanes = []
      AllTabPanes.forEach(item => {
        if (item.tab && this.name) {
          if (item.tab === this.name) {
            TabPanes.push(item)
          }
        } else {
          TabPanes.push(item)
        }
      })
      // 在 TabPane 使用 v-if 时，并不会按照预先的顺序渲染，这时可设置 index，并从小到大排序
      TabPanes.sort((a, b) => {
        if (a.index && b.index) {
          return a.index > b.index ? 1 : -1
        }
      })
      return TabPanes
    },
    updateVisibility (index) {
      [...this.$refs.panes.querySelectorAll(`.${ prefixCls }-tabpane`)].forEach((el, i) => {
        if (index === i) {
          // eslint-disable-next-line no-return-assign
          [...el.children].filter(child => child.classList.contains(`${ prefixCls }-tabpane`)).forEach(child => child.style.visibility = 'visible')
          // if (this.captureFocus) setTimeout(() => focusFirst(el, el), transitionTime)
        } else {
          setTimeout(() => {
            // eslint-disable-next-line no-return-assign
            [...el.children].filter(child => child.classList.contains(`${ prefixCls }-tabpane`)).forEach(child => child.style.visibility = 'hidden')
          }, transitionTime)
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@lib/common/stylus/variable.styl';
@import '~@lib/common/stylus/mixin.styl';

$tabs-prefix-cls = $css-prefix + 'tabs';

.div {
  font-size: 16px;
  background: $color-yellow;
}

.mb30 {
  margin-bottom: 30px;
}

.{$tabs-prefix-cls} {
  width: 750px;
  min-height: 500px;
  background: $body-background;
  overflow: hidden;

  &-nav {
    position: relative;
    display: flex;
    // clearfix();
    height: 84px;
    box-sizing: border-box;
    border-bottom: $border-width-base $border-style-base $border-color-base;
  }

  &-tab {
    position: relative;
    width: 200px;
    height: 100%;
    // display: inline-block;
    color: $black;
    fs(30px);

    &-active {
      color: #8a4bd9;

      &::after {
        content: '';
        width: 40px;
        height: 6px;
        border-radius: 100px;
        background-image: linear-gradient(to left, #5f37d9 135%, #c36bd6 20%);
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }
  }

  &-ink-bar {
    height: 2px;
    position: absolute;
    left: 0;
    bottom: 0;
    transition: transform 0.3s $ease-in-out;
    transform-origin: 0 0;
  }

  &-content {
    // min-height: 100%;
    &-animated {
      display: flex;
      flex-direction: row;
      will-change: transform;
      transition: transform 0.3s $ease-in-out;

      &.IOS {
        transform-style: preserve-3d;
        backface-visibility: hidden;
        perspective: 1000;
      }
    }
  }

  &-tabpane {
    flex-shrink: 0;
    width: 100%;
    transition: opacity 0.3s;
    opacity: 1;
    outline: none;
  }
}

.zhuanpan, .duihuan, .huolizhi {
  box-sizing: border-box;
  padding: 30px 30px 30px;
  color: $black;
  line-height: $line-height-base;
  fs(28px);
  font-weight: 300;

  h1 {
    fs(32px);
    font-weight: 300;
    padding: 30px 0;
  }

  .btn {
    width: 306px;
    height: 80px;
    border-radius: 40px;
    background-color: #a462f6;
    color: $white;
    margin-top: 100px;
    margin-bottom: 50px;
  }
}
</style>
