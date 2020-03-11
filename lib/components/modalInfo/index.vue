<template>
  <transition name="confirm-fade">
    <div
      class="confirm"
      v-show="showFlag"
      @click.stop="bkClose && cancel"
      @touchmove.prevent.stop
    >
      <div class="confirm-wrapper" @click.stop>
        <!-- :style="{width: showWidth,height: showHeight}" -->
        <div
          class="confirm-content bsbb pos-r"
          :style="{ width: showWidth, height: showHeight }"
        >
          <div v-show="closeShow" class="close" @click="cancel"></div>
          <div class="confirm-title">{{ title }}</div>
          <div class="confirm-text">
            {{ content }}
            <slot />
          </div>
          <div class="confirm-buttons">
            <div v-if="cancelStr" @click="cancel" class="button cancel">
              <span>{{ cancelStr }}</span>
            </div>
            <div v-if="sureStr" @click="confirm" class="button sure">
              <span>{{ sureStr }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { pxToRem } from '@lib/common/config/mUtils'
export default {
  props: {
    bkClose: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '温馨提示'
    },
    cancelStr: {
      type: String,
      default: ''
    },
    sureStr: {
      type: String,
      default: '确定'
    },
    content: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '310px'
    },
    height: {
      type: String,
      default: 'auto'
    },
    closeShow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      confirmCall: () => { },
      cancelCall: () => { },
      showFlag: false
    }
  },
  computed: {
    showWidth () {
      return pxToRem(this.width)
    },
    showHeight () {
      return this.height !== 'auto' ? pxToRem(this.height) : 'auto'
    }
  },
  methods: {
    show (objectConf = {}) {
      if (objectConf.confirm) {
        this.confirmCall = objectConf.confirm
        delete objectConf.confirm
      }
      if (objectConf.cancel) {
        this.cancelCall = objectConf.cancel
        delete objectConf.cancel
      }
      Object.assign(this, objectConf)
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
      this.$emit('confirm')
      this.hide()
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
    max-width: 80%;

    .confirm-content {
      padding: 0 20PX 20PX;
      background: #fff;
      width: 250PX;
      max-width: 100%;
      border-radius: 10PX;
      font-size: 16PX;
      text-align: center;

      .confirm-title {
        height: 40PX;
        line-height: 40PX;
        color: #2a2a2a;
      }

      .confirm-title {
        height: 50PX;
        line-height: 50PX;
        color: #2a2a2a;
      }

      .confirm-text {
        color: #605f63;
        line-height: 22PX;
      }

      .confirm-buttons {
        margin-top: 20PX;
        display: flex;
        justify-content: space-around;

        div {
          flex: auto;
        }

        .button {
          max-width: 60%;
        }

        .button span {
          display: block;
          margin: 0 auto;
          max-width: 80%;
          background: #eee;
          border-radius: 20PX;
          line-height: 30PX;
          height: 30PX;
          font-size: 14PX;
        }

        .sure span {
          background: #feda39;
        }
      }

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
        top: 15PX;
        right: 15PX;
        background-image: url('http://pws.myhug.cn/npic/s/9/ff583957c19071142ce1088f828625851823c12ff8836e');
        bg-size(15PX, 15PX);
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
