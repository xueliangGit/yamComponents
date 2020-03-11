<template>
  <div ref="avcard" :class="{isnull:isNull}">
    <audio ref="audio" preload>
      <source :src="voiceUrl" type="audio/aac" />
    </audio>
    <!-- <div class="audio-card flex bsbb" @click='playControl'> -->
    <!-- <div class="audio-card flex bsbb" :style='{width: showWidth}' @click='playControl'>
      <div class="play-control" :class='playing ? "playing-icon" : "play-icon"'>
      </div>
      <div class="flex-item"></div>
      <div class="time tr">{{timeLeft}}″</div>
    </div>-->
    <div @click="playControl" @touchend="touchEnd">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import $myEmit from '@lib/sdk/emit'
import {pxToRem, throttle} from '@lib/common/config/mUtils'
import {getPoint} from '@lib/common/config/mUtils.js'
import loadMedia from '@lib/plugins/Sloth/loadMedia'
import {clearTimeout, setTimeout} from 'timers'
let audioIndex = 0
// let interval = null
export default {
  data () {
    return {
      isScrollplayFlag: null,
      isInitTimeLeft: false,
      audioIndex: 0,
      isPlay: false,
      timeLeft: 0,
      eleTop: 0,
      playing: false,
      isStopByuser: false,
      canLoadPic: true,
      userClick: false // 手动触发
    }
  },
  components: {

  },
  props: {
    isNull: Boolean,
    headfont: {
      type: String,
      default: '啦啦'
    },
    voiceUrl: {
      type: String,
      default: ''
    },
    voiceDura: {
      type: Number,
      default: 0
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    pic: {
      type: Array,
      default () {
        return []
      }
    },
    timeMode: {
      type: String,
      default: ''
    }
  },
  computed: {
    showWidth () {
      return pxToRem(((this.voiceDura / 5) < 6 ? 100 + Math.floor(this.voiceDura / 5) * 30 : 280) + 'px')
    }
  },
  watch: {
    voiceDura: {
      immediate: true,
      handler () {
        if (this.timeMode === 'add') {
          this.timeLeft = 0
        } else {
          this.timeLeft = this.voiceDura
        }
        // console.log('更新props', this.voiceDura)
      }
    },
    voiceUrl: {
      immediate: true,
      handler () {
        // this.playAudio()
      }
    },
    autoPlay: {
      immediate: true,
      handler () {
        // this.playAudio()
      }
    },
    timeLeft: {
      immediate: true,
      handler () {
        this.$emit('timeLeftUpdata', {timeleft: this.timeLeft || 0, isInit: !this.isInitTimeLeft}, {})
        this.isInitTimeLeft = true
      }
    },
    playing: {
      immediate: true,
      handler () {
        this.$emit('playStatus', {playing: this.playing, userClick: this.userClick}, {})
      }
    }
  },
  mounted () {
    this.$refs.audio = document.getElementById('rootAudio') || this.$refs.audio
    this.audioIndex = ++audioIndex
    $myEmit.$bind('stopAll', this.emitStop)
    $myEmit.$bind('stopAudio', this.stopAudio)
    // 监听音频播放时间并更新进度条
    this.$refs.audio.addEventListener('timeupdate', () => {
      this.updateProgress(this.$refs.audio, true)
    }, false)
    // 监听播放完成事件
    this.$refs.audio.addEventListener('ended', () => {
      // TODO: 不知道啥问题；若不能循环播放，那是操作和姿势问题；处理循环播放问题
      this.audioEnded()
      console.log('结束')
      console.log('触发endAudio')
      $myEmit.$emit('endAudio', {audioIndex: this.audioIndex})
      // this.stopTimes()
      // this.$refs.audio.play()

      // this.$emit('audioEnd', {}, {})
    }, false)
    this.$refs.audio.addEventListener('error', (err) => {
      let codeArr = ['', '用户终止', '网络错误', '解码错误', 'URL无效'] // 1.用户终止 2.网络错误 3.解码错误 4.URL无效
      console.log('audio-err---', 'code ' + err.srcElement.error.code, codeArr[err.srcElement.error.code], err)
      this.audioEnded()
    }, false)
    // 自动播放
    // document.addEventListener('touchstart', () => {
    //   this.playAudio()
    // }, false)
    // interval = setInterval(() => {
    //   this.playAudio()
    // }, 1000)
    if (this.autoPlay) {
      let ua = navigator.userAgent
      let isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      let isWeibo = ua.indexOf('Weibo') > -1
      console.log('---平台---', navigator.userAgent, isIOS, isWeibo)
      // iphone平台并且是Weibo客户端不自动播放
      if (isIOS && isWeibo) {
      } else {
        this.playAudio()
      }
    }
    this.eleTop = getPoint(this.$refs.avcard)
    // 滚动播放
    window.addEventListener('scroll', () => {
      if (!this.autoPlay) {
        return false
      }
      this.scrollFn()
    }, false)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollFn
      , false)
    this.stop()
    $myEmit.$rm('stopAll', this.emitStop, true)
    $myEmit.$rm('stopAudio', this.stopAudio, true)
  },
  beforeDestroy () {
    this.stopTimes()
    console.log('beforeDestroy')
  },
  methods: {
    touchEnd () {
      if (this.playing) {
        this.userClick = true
      } else {
        this.userClick = false
      }
      console.log('点击click', this.userClick)
    },
    scrollFn (e) {
      // TODO: 处理ios 微信浏览器 滑动播放问题
      if (window.scrollY > this.eleTop - window.innerHeight / 2 && window.scrollY < this.eleTop + this.$refs.avcard.offsetHeight / 2) {
        this.scorllPlay()
        if (this.pic.length > 1 && this.canLoadPic) {
          this.canLoadPic = false
          let pics = []
          this.pic.forEach((item, index) => {
            if (index !== 0) {
              pics.push(item.url)
            }
          })
          loadMedia({
            defaultType: 'image',
            source: pics,
            step: (a) => {
              console.log(a)
            },
            complete: (a) => {
              console.log('success')
            }
          })
        }
      } else {
        this.clearScorllPlay()
      }
    },
    stopAudio () {
      console.log('stopAudio')
      // this.stop()
      this.touchEnd()
      // this.playControl()
      this.emitStop(-1)
    },
    emitStop (i) {
      this.isStopByuser = false
      // if (i !== this.audioIndex && this.$refs.audio && !this.$refs.audio.paused) {
      if (i !== this.audioIndex && this.$refs.audio) {
        console.log('emitStop---')
        this.$refs.audio.pause()
        this.$refs.audio.src = ''
        this.stop(1)
      }
    },
    loopAudio () {
      this.$refs.audio.src = ''
      console.log('---xxxxxx----', this.$refs.audio.src)
      this.$refs.audio.src = this.voiceUrl
      this.$refs.audio.load()
      console.log('---xxxZZZZxxx----', this.$refs.audio.src)
    },
    playAudio () {
      let self = this
      // console.log('playAudio', this.autoPlay, this.voiceUrl)
      if (this.voiceUrl.length > 0) {
        setTimeout(() => {
          window.screenTop = 1
        }, 0)
        // console.log('autoPlay---', this.autoPlay, this.voiceUrl)
        this.playControl(1)
        document.addEventListener('WeixinJSBridgeReady', function () {
          console.log('微信环境播放')
          self.playControl(1)
        }, false)
      }
    },
    scorllPlay () {
      if (!this.isScrollplayFlag) {
        this.isScrollplayFlag = setTimeout(() => {
          if (this.$refs.audio.paused && !this.isStopByuser) {
            $myEmit.$emit('stopAll', -1)
            throttle(this.playControl)
          }
        }, 1000)
      }
    },
    clearScorllPlay () {
      if (this.isScrollplayFlag) {
        clearTimeout(this.isScrollplayFlag)
        this.isScrollplayFlag = null
      }
      if (this.$refs.audio && this.$refs.audio.src) {
        this.$refs.audio && this.$refs.audio.pause()
        this.$refs.audio.src = ''
        this.stop(1)
      }
    },
    playControl (isAutoPlay) {
      $myEmit.$emit('stopAll', this.audioIndex)
      let audio = this.$refs.audio
      // console.log('audio---', audio, audio.paused)
      if (isAutoPlay === 1 || audio.paused) {
        // 开始播放当前点击的音频
        if (audio.src !== this.voiceUrl) {
          audio.src = this.voiceUrl
        }
        this.stopTimes()
        audio.play()
        console.log('开始播放aac', audio.id)
        console.log('音频地址', audio.src)
      } else {
        // if (interval) {
        //   clearInterval(interval)
        //   retur
        // }
        this.isStopByuser = true
        this.stop()
        audio.pause()
        this.playing = false
        $myEmit.$emit('pausedAudio')
      }
    },
    startTimes () {
      if (!this.myTimer) {
        // console.log('startTimes')
        // this.timerSeek = 0
        this.myTimer = setInterval(() => {
          if (this.timerSeek >= this.voiceDura) {
            this.timerSeek = 0
          }
          this.timerSeek += 0.2
          this.updateProgress(this.$refs.audio)
        }, 200)
      }
    },
    stopTimes () {
      // console.log('----------------停止')
      // console.log('stopTimes', this.myTimer)
      if (this.myTimer) {
        // console.log('stopTimes:OK')
        // this.timerSeek = 0
        clearInterval(this.myTimer)
        this.myTimer = null
      }
    },
    /**
     * 更新进度条与当前播放时间
     * @param {object} audio - audio对象
     */
    updateProgress (audio, isSeek = false) {
      console.log('进度条', audio.src, audio.paused, this.voiceDura - Math.floor(this.timerSeek || audio.currentTime), audio.duration, this.timerSeek || audio.currentTime)
      if (!audio || audio.paused || audio.src === '') {
        this.stopTimes()
        console.log('go: stop')
        return
      }
      if (isSeek && (audio.duration < 1 || isNaN(audio.duration) || audio.duration === Infinity)) {
        this.startTimes()
        // 提前执行 消失播放按钮
        if (!audio.paused && !this.playing) {
          this.playing = true
          this.userClick = false
        }
        console.log('go: begin')
        // console.log('======================开始及时')
      } else if (!isSeek && audio.duration > 1 && audio.duration !== Infinity) {
        console.log('go: stop2')
        this.stopTimes()
      } else {
        console.log('go: running ' + isSeek)
        if (audio) {
          // console.log('updatePraogress', audio.paused)
          if (!audio.paused && !this.playing) {
            this.playing = true
            this.userClick = false
          }
          let duration = this.voiceDura
          let currentTime = Math.floor(this.timerSeek || audio.currentTime)
          if ((duration - currentTime) > this.voiceDura) {
            if (this.timeMode === 'add') {
              this.timeLeft = 0
            } else {
              this.timeLeft = this.voiceDura
            }
          } else {
            if (this.timeMode === 'add') {
              this.timeLeft = currentTime
            } else {
              this.timeLeft = duration - currentTime
            }
          }
        }
      }
    },
    /**
     * 播放完成时把进度调回开始的位置
     */
    audioEnded (isStoped) {
      this.$refs.audio && this.$refs.audio.pause()
      console.log(isStoped)
      if (isStoped) {
        // 为修复 点击暂停时 时间显示错误--（带测试）
        if (this.timeMode === 'add') {
          this.timeLeft = 0
        } else {
          this.timeLeft = this.voiceDura
        }
      }
      this.stopTimes()
      this.playing = false
    },
    stop (isStoped) {
      console.log('isStop')
      this.audioEnded(isStoped)
      // this.$refs.audio && (this.$refs.audio.src = '')
    },
    resetUrl () {
      this.$refs.audio && (this.$refs.audio.src = '')
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~@lib/common/stylus/variable.styl';
@import '~@lib/common/stylus/mixin.styl';

.audio-card {
  wh(188px, 45px);
  padding: 0 20px;
  align-items: center;
  border-radius: 22.5px;
  box-shadow: 0 5px 11px 0 rgba(255, 201, 66, 0.4);
  background-image: linear-gradient(283deg, #ffc742, #ffe142);

  .play-control {
    wh(16px, 16px);
    background-repeat: no-repeat;
    background-size: 16px 16px;
    background-position: 0 0;

    &.playing-icon {
      animation: playAni steps(3) 1s infinite;
      // background-image: url('../assets/imgs/btn_yuyin.png');
    }

    &.play-icon {
      // background-image: url('../assets/imgs/btn_yuyin.png');
    }

    img {
      wh(16px, 16px);
    }
  }

  .time {
    min-width: 27px;
    height: 22px;
    fs(16px);
    line-height: @height;
  }
}

.isnull {
  display: none;
}

@keyframes playAni {
  0% {
    width: 6px;
  }

  100% {
    width: 20px;
  }
}
</style>
