<!--
 * @Author: xuxueliang
 * @Date: 2019-11-20 14:14:42
 * @LastEditors  : xuxueliang
 * @LastEditTime : 2020-01-17 15:52:37
 -->
<template>
  <div
    class="slide-popup"
    @touchmove.stop="showNull"
    @click.stop="bkHide && hide()"
    :style="{ height: (showFlag ? windowHeight : 0) + 'px' }"
    :class="{ show: showFlag }"
  >
    <div class="slide-content" @click.stop="showNull">
      <slot />
    </div>
  </div>
</template>
<script>
// import { $on } from '@lib/eryuSdk'
export default {
  name: '',
  props: {
    bkHide: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      windowHeight: window.innerHeight,
      showFlag: !1,
      selected: 0
    }
  },
  created () {
    // $on('window.resize', () => { this.windowHeight = window.innerHeight })
  },
  methods: {
    showNull () { },
    show () {
      this.windowHeight = window.innerHeight
      this.showFlag = true
    },
    hide () {
      this.showFlag = false
    },
    paySelectOk () {
      if (!this.selected) return
      this.showFlag = false
      this.$emit('paySelected', { wxPay: this.selected === 1, aliPay: this.selected === 2 })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@lib/common/stylus/eyIcon.styl';

.slide-popup {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 6;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s 0.3s, height 0s 0.6s;
  border-top: 0px solid transparent;
  height: 0;
  overflow: hidden;

  &.show {
    top: 0;
    height: 100vh;
    transition: background 0.5s;
    // border-top: 100vh solid transparent;
    background: rgba(0, 0, 0, 0.5);

    .slide-content {
      transform: translate3d(0, 0, 0);
    }
  }
}

.slide-content {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  // background: #fff;
  // padding-bottom: 12px;
  transform: translate3d(0, 100%, 0);
  transition: all 0.3s;
}
</style>
