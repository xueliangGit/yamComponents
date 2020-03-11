<!--
 * @Author: zhengguozhi
 * @Date: 2019-02-22 19:35:56
 * @LastEditors: zhengguozhi
 * @LastEditTime: 2019-11-15 12:29:40
 -->
<template>
  <div
    class="cir-img"
    :style="{
      width: imgWidth,
      height: imgWidth,
      backgroundImage: 'url(' + defSrc + ')',
      borderRadius: borderRadius
    }"
  >
    <div
      class="cir-img inited"
      :class="showSrc != '' ? 'show' : ''"
      :style="{
        width: imgWidth,
        height: imgWidth,
        backgroundImage: 'url(' + showSrc + ')',
        borderRadius: borderRadius
      }"
    ></div>
  </div>
</template>
<script>
import { pxToRem } from '@lib/common/config/mUtils'
import loadPro from '@lib/plugins/Sloth/loadMedia'
export default {
  name: '',
  props: {
    width: {
      type: String,
      default: '120px'
    },
    src: {
      type: String,
      default: ''
    },
    defSrc: {
      type: String,
      default: ''
    },
    borderRadius: {
      type: String,
      default: ''
    }
  },
  computed: {
    imgWidth: function () {
      return pxToRem(this.width)
    }
  },
  data () {
    return {
      showSrc: '',
      oriSrc: ''
    }
  },
  watch: {
    src (newV, oldV) {
      this.load(newV)
    }
  },
  mounted () {
    if (this.src) {
      this.load(this.src.length > 10 && this.src.substr(-10).lastIndexOf('!') < 0 && this.src.substr(0, 10).indexOf('data:') < 0 ? this.src + '!umid' : this.src)
    }
  },
  methods: {
    load (url) {
      if (url !== this.showSrc) {
        loadPro({
          source: [{ url: url, type: 'image' }],
          step: (...a) => {
          },
          complete: (data) => {
            if (data.success[0]) {
              this.showSrc = data.success[0].url
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.cir-img {
  overflow: hidden;
  border-radius: 50%;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #eee;
}

.inited {
  opacity: 0;
  display: block;
  transform: scale(1.1);
  transition: all 500ms linear;

  &.show {
    opacity: 1;
    transform: scale(1);
    transition: all 500ms linear;
  }
}
</style>
