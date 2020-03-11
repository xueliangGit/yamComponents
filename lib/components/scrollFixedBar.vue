<!--
 * @Author: xuxueliang
 * @Date: 2019-01-17 15:04:37
 * @LastEditors: xuxueliang
 * @LastEditTime: 2019-12-10 12:31:34
 -->
<template>
  <div ref="scrollFixedBar" class="scrollFixedBar" :style="{height:getRem(height)}">
    <div :style="[positionStyle,{height:getRem(height)}]" :class="{scrollBarFixed:topbarfix}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { getPoint, pxToRem } from '@lib/common/config/mUtils'
export default {
  name: '',
  props: {
    positionStyle: {
      type: Object,
      default: () => {
        return {
          top: 0,
          left: 0,
          bottom: 0
        }
      }
    },
    height: String
  },
  data () {
    return {
      top: 0,
      topbarfix: false
    }
  },
  created () {
  },
  mounted () {
    this.getTop()
    let scrollFn = () => {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > this.top && !this.topbarfix) {
        this.topbarfix = true
      } else if (scrollTop <= this.top && this.topbarfix) {
        this.topbarfix = false
      }
    }
    scrollFn()
    window.addEventListener('scroll', scrollFn, false)
  },
  methods: {
    getRem (px) {
      return pxToRem(px)
    },
    getTop () {
      this.top = getPoint(this.$refs.scrollFixedBar)
    }
  }
}
</script>

<style lang="stylus" scoped>
.scrollBarFixed {
  z-index: 5;
  width: 100%;
  position: fixed;
}
</style>
