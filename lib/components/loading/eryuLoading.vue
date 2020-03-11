<!--
 * @Author: xuxueliang
 * @Date: 2020-01-10 19:09:22
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-02-21 17:56:42
 -->
<template>
  <div v-if="isLoading" class="isloading">
    <div class="is-loading">
      <img
        src="http://pws.myhug.cn/npic/w/9/20200110175017_4e792f9c361a31ea93afe22b3e66967f"
        alt=""
      />
      加载中
    </div>
  </div>
</template>

<script>
export default {
  props: [

  ],
  name: '',
  data () {
    return {
      isLoading: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.isloading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .is-loading {
    text-align: center;

    img {
      display: block;
      width: 50px;
    }
  }
}
</style>
