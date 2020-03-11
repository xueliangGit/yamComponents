<template>
  <div class="card">
    <div class="num-index dib tc" :class='"top_"+(i+1)'>
{{i>2?i+1:''}}
    </div>
    <div @click="toProfile(user.userBase.uId)" class="tou dib" :class='{first:i==0,small:i>2}'>
      <img :src="user.userBase.portraitUrl" alt="" class="tx">
      <img v-if='i==0' src="http://pws.myhug.cn/static/zroom/girls_day/iocn_phb_1_hg.png" class='the-first' alt="">
    </div>
    <div class="info dib">
        <p class="name fh dib">
          {{user.userBase.nickName}}
        </p>
          <span :class="user.stagClassFlag"></span>
          <span :class="user.gradeClassFlag">{{user.userZhibo.grade}}</span>
        <p class="liwu">{{user.score}} {{itemTip}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    props: {
      user: Object,
      i: Number,
      itemTip: {
        type: String,
        default: '贺新春礼物'
      }
    },
    data () {
      return {

      }
    },
    methods: {
      toProfile: function (uId) {
        var url = 'baobao://profile#{"uId":"' + uId + '","yUId":"' + uId + '"}'
        console.log(url)
        location.assign(url)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .card
    padding 20px 0
  .dib
    display inline-block
    vertical-align middle
  .num-index
    width 110px
    color: rgba(255, 255, 255, 0.7);
  .tou
    width 120px
    position relative
    img.tx
      width 120px
      height 120px
      border-radius 50%
      display block
      margin 0 auto
    &.small
      img.tx
        width 100px
        height 100px
  .info
    margin-left 31px
  .name
    max-width: 170px
    font-size: 28px;
    color: #ffffff;
    line-height: 1.32;
  .liwu
    margin-top 23px
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.25;
    opacity: 0.8;
    font-size: 24px;
  img.the-first
    position absolute
    width auto
    height 44px
    top -28px
    right 0px
</style>
