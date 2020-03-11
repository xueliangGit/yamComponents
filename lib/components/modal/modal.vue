<template>
  <transition name="confirm-fade">
    <div
      class="confirm"
      v-show="showFlag"
      @click.stop="cancel"
      @touchmove.prevent.stop
    >
      <div class="confirm-wrapper" @click.stop>
        <!-- :style="{width: showWidth,height: showHeight}" -->
        <div class="confirm-content bsbb pos-r">
          <div v-show="closeShow" class="close" @click="cancel"></div>
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { pxToRem } from '@lib/common/config/mUtils'
export default {
  props: {
    width: {
      type: String,
      default: '310px'
    },
    height: {
      type: String,
      default: '322px'
    },
    closeShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      showFlag: false
    }
  },
  computed: {
    showWidth () {
      return pxToRem(this.width)
    },
    showHeight () {
      return pxToRem(this.height)
    }
  },
  methods: {
    show () {
      this.showFlag = true
    },
    hide () {
      this.showFlag = false
    },
    cancel () {
      this.hide()
      this.$emit('cancel')
    },
    confirm () {
      this.hide()
      this.$emit('confirm')
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@lib/common/stylus/variable.styl';
@import '~@lib/common/stylus/mixin.styl';

.confirm {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9;
  background-color: $color-background-d;

  &.confirm-fade-enter-active {
    animation: confirm-fadein 0.3s;

    .confirm-content {
      animation: confirm-zoom 0.3s;
    }
  }

  .confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;

    .confirm-content {
      // width: 564px * 2;
      // border-radius: 13px * 2;
      // background: #fff;
      // color: #510e18;
      // width: 310px * 2;
      // height: 322px * 2;

      // border-radius: 20px * 2;
      // background-color: #fff;
      // box-shadow: 0 0 29px * 2 0 #FFEFCC inset;
      // padding-top: 88px * 2;
      .btnOff {
        background-image: linear-gradient(to right, #d9d1e6, #fce5fb 99%);
        color: #a9a9a9 !important;
      }

      .close {
        position: absolute;
        top: 15px * 2;
        right: 15px * 2;
        background-image: url('http://pws.myhug.cn/npic/s/9/ff583957c19071142ce1088f828625851823c12ff8836e');
        bg-size(15px * 2, 15px * 2);
        z-index: 1;
      }

      .close-icon {
        padding: 30px * 2;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1;
        width: 30px * 2;
        height: 30px * 2;
      }

      .box {
        padding: 30px * 2;

        .content {
          font-size: 28px * 2;
          line-height: 1.6;
          padding-bottom: 10px * 2;
          color: $dark-black;
        }
      }

      .text {
        padding: 19px * 2 15px * 2 50px * 2;
        // line-height: 22px * 2;
        text-align: center;
        font-size: 36px * 2;
        color: $color-red;
      }

      .operate {
        // display: flex;
        align-items: center;
        text-align: center;
        font-size: $font-size-large;

        .operate-btn {
          // flex: 1;
          // line-height: 22px * 2;
          // padding: 10px * 2 0;
          // height: 0.8rem;
          // border-top: 1px * 2 solid $color-background-d
          // color: $color-text-d;
          // background: url('http://pws.myhug.cn/static/wap/img/zww/btn_tanchuang_queren.png');
          // background-size: 2rem;
          background-repeat: no-repeat;
          background-position: center;
          // width: 361px * 2;
          // height: 80px * 2;
          border-radius: 40px * 2;
          // background-image: linear-gradient(to right, #ff34db, #d312f6 98%);
          margin: 0 auto;
          // box-shadow: 0 0 29px * 2 0 rgba(255, 255, 255, 0.5) inset;
          // background-color: #C73DE7;
          color: #fff;
          width: 250px * 2;
          height: 67px * 2;
          line-height: @height;
          border-radius: 30px * 2;
          box-shadow: 0px * 2 5px * 2 0 0 rgba(196, 42, 8, 0.85);
          background-image: linear-gradient(to top, #ff8d00, #ffe400);
          text-shadow: 0px * 2 2px * 2 5px * 2 rgba(196, 42, 8, 0.89);
          font-weight: 600;
          font-size: 36px * 2;

          &.left {
            // border-right: 1px * 2 solid $color-background-d
            background: url('http://pws.myhug.cn/static/wap/img/zww/btn_tanchuang_quexiao.png');
            background-size: 2rem;
            background-repeat: no-repeat;
            background-position: center;
            padding: 10px * 2 0;
          }
        }
      }
    }
  }
}

@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes confirm-zoom {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>
