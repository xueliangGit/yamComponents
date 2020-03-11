<template>
  <div class="load-pro" :style='{backgroundColor:bkColor}'>
    <slot></slot>
    <div class="progress">
     <div class="pos-r line-c">
        <div class="line" :style='{width:progress,backgroundColor:proColor}'>
        </div>
        <div class="num" :style="{left:progress,color:proColor}">{{progress}}</div>
     </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    props: {
      bkColor: {
        type: String,
        default: '#f76b40'
      },
      proColor: {
        type: String,
        default: 'blue'
      },
      progress: {
        type: String,
        default: '0%'
      }
    },
    data () {
      return {

      }
    }
  }
</script>

<style lang="stylus" scoped>
  .load-pro
    position fixed
    width 100vw
    height 100vh
    z-index 999
  .progress
    width 80%
    margin auto
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    height 25px
    background #ffffff
    border-radius 25px
    border 3px #fff solid
    .line-c
      width 100%
      height 100%
    .line
      width 50%
      height 100%
      border-radius 25px
      transition width 200ms
      position relative
    .num
      position absolute
      transition left 200ms
      background #ffffff
      width auto
      bottom 37px
      border-radius 10px
      padding 5px
      transform translate3d(-50%,0,0)
      &:after
        content ''
        display block
        position absolute
        border-bottom 10px #fff solid
        border-left 10px #fff solid
        border-top 10px transparent solid
        border-right 10px transparent solid
        transform rotate(-45deg)
        left 50%
        bottom -8px
        margin-left -13px

</style>
