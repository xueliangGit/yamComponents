<!--
 * @Author: zhengguozhi
 * @Date: 2019-12-19 14:27:20
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-03 10:44:23
 -->
<template>
  <div :class="prefixCls" v-show="show" :style="contentStyle">
    <slot></slot>
  </div>
</template>
<script>
import { isIOS } from '@lib/eryuSdk'
const prefixCls = 'bbfe-tabs-tabpane' + (isIOS ? ' IOS' : '')

export default {
  name: 'TabPane',
  inject: ['TabsInstance'],
  props: {
    name: {
      type: String
    },
    label: {
      type: [String, Function],
      default: ''
    },
    icon: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: null
    },
    transition: {
      type: String,
      default: 'visibility'
    },
    // Tabs 嵌套时，用 tab 区分层级，指向对应的 Tabs 的 name
    tab: {
      type: String
    },
    // 在 TabPane 使用 v-if 时，并不会按照预先的顺序渲染，这时可设置 index，并从小到大排序
    // 数值需大于 0
    index: {
      type: Number
    }
  },
  data () {
    return {
      prefixCls: prefixCls,
      show: true,
      currentName: this.name
    }
  },
  computed: {
    contentStyle () {
      if (this.transition === 'none') {
        return {}
      }
      switch (this.transition) {
        case 'none':
          return {}
        case 'height':
          return { height: this.TabsInstance.activeKey !== this.currentName ? '0px' : 'auto' }
        case 'opacity':
          return { opacity: this.TabsInstance.activeKey !== this.currentName ? '0' : '1' }
        case 'visibility': default:
          return { visibility: this.TabsInstance.activeKey !== this.currentName ? 'hidden' : 'visible' }
      }
      // return this.transition === 'visibility' ? { visibility: this.TabsInstance.activeKey !== this.currentName ? 'hidden' : 'visible' } : { opacity: this.TabsInstance.activeKey !== this.currentName ? '0' : '1' }
      // return {
      //   // visibility: this.TabsInstance.activeKey !== this.currentName ? 'hidden' : 'visible'
      //   opacity: this.TabsInstance.activeKey !== this.currentName ? '0' : '1'
      // }
      // return this.moveAni()
    }
  },
  methods: {
    updateNav () {
      this.TabsInstance.updateNav()
    }
  },
  watch: {
    name (val) {
      this.currentName = val
      this.updateNav()
    },
    label () {
      this.updateNav()
    },
    icon () {
      this.updateNav()
    },
    disabled () {
      this.updateNav()
    }
  },
  mounted () {
    this.updateNav()
  },
  destroyed () {
    this.updateNav()
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@lib/common/stylus/variable.styl';
@import '~@lib/common/stylus/mixin.styl';

$tabs-prefix-cls = $css-prefix + 'tabs';

.{$tabs-prefix-cls} {
  &-tabpane {
    flex-shrink: 0;
    width: 100%;
    transition: opacity 0.3s;
    opacity: 1;
    outline: none;

    &.IOS {
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
    }
  }
}
</style>
