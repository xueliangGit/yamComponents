<!--
 * @Author: xuxueliang
 * @Date: 2019-10-14 17:37:31
 * @LastEditors  : xuxueliang
 * @LastEditTime : 2020-01-08 19:11:05
 -->
<template>
  <div class="progress-line">
    <div class="line-inner" :style="overStyle">
      <div class="line" :style="lineStyleObj">
        <div class="block" :style="blockStyleObj"></div>
      </div>
    </div>
    <div class="progress-text">{{ Math.min(step, total) }}/{{ total }}</div>
  </div>
</template>

<script>
import { pxToRem } from '@lib/common/config/mUtils.js'
export default {
  name: 'progress',
  props: {
    colorBegin: {
      type: String,
      default: '#ffbe22'
    },
    lineBack: {
      type: String,
      default: '#ffffffa3'
    },
    colorEnd: {
      type: String,
      default: '#ffbe22'
    },
    blockBorderColor: {
      type: String,
      default: '#ffdd2b'
    },
    blockColor: {
      type: String,
      default: '#ffdd2b'
    },
    height: {
      type: Number,
      default: 10
    },
    step: {
      type: Number,
      default: 50
    },
    total: {
      type: Number,
      default: 100
    }
  },
  computed: {
    getWidth () {
      return (this.step >= this.total ? 1 : (this.step / this.total)) * 100 + '%'
    },
    overStyle () {
      return { height: pxToRem(this.height), backgroundColor: this.lineBack }
    },
    lineStyleObj () {
      return { width: this.getWidth, height: pxToRem(this.height), background: `linear-gradient(90deg,${ this.colorBegin },${ this.colorEnd })` }
    },
    blockStyleObj () {
      let rem = pxToRem(this.height * 2)
      return { width: rem, height: rem, top: pxToRem(this.height / 2 * -1), border: `${ pxToRem(this.height / 2) } ${ this.blockBorderColor } solid `, backgroundColor: this.blockColor }
    }
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="stylus" scoped>
@import '~@lib/common/stylus/variable.styl';
@import '~@lib/common/stylus/mixin.styl';

.progress-line {
  width: 100%;
  padding: scale(20px);
  position: relative;
  box-sizing: border-box;

  .line-inner {
    display: inline-block;
    height: scale(5px);
    width: 80%;
    border-radius: scale(7px);
    background: rgba(255, 255, 255, 0.64);
    // overflow: hidden;
    position: relative;

    .line {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      height: scale(5px);
      width: 0;
      background: #ffbe22;
      display: inline-block;
      border-radius: scale(7px);
      transition: width 0.1s;

      .block {
        content: '';
        display: inline-block;
        width: scale(11px);
        border-radius: 50%;
        height: scale(11px);
        background-color: #ffdd2b;
        position: absolute;
        top: scale(-3px);
        right: 0;
        box-sizing: border-box;
      }
    }
  }

  .progress-text {
    width: 20%;
    display: inline-block;
    font-size: scale(16px);
    vertical-align: sub;
    position: absolute;
    right: 0;
    top: scale(18px);
  }
}
</style>
