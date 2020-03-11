# scrollView  组件

### 属性

| 属性         | 类型        |  默认值  | 必填   | 说明
| :--------:    | :-----:  | :----: |:----:|:----
| `height`    | string    |100%     |  否    |    `scrollview`的高度
| `width`   | string    |100%     |  否    |    `scrollview`的宽度
| `scrollX`    | boolean    |false     |  否    |    允许横向滚动
| `scrollY`    | boolean    |false     |  否    |    允许纵向滚动
| `timeOut`    | number    |5000     |  否    |    下拉刷新超时时间
| `@scrolltolower`    | eventhandle    |     |  否    |    当需要滚动加载时需要设置
| `@scroll`    | eventhandle    |     |  否    |    当需要滚动事件时需要设置
| `@flash`    | eventhandle    |     |  否    |    当需要下拉刷新时触发方法
| `useFlash`    | boolean    |true     |  否    |    是否使用下拉刷新
| `pullText`    | string     |继续往下拉进行刷新 |    否   |下拉提示文字
| `canFlashText|` string     |  释放刷新    |    否  |下拉达到舒心匮乏值时提示文字
| `flashText`| string     |  数据加载中...    |    否  |刷新中显示的文字
| `bottomLoadingText`| string     |  数据加载中...    |    否  |底部加载数据时显示的文字
| `bottomText`| string     |  没数据了   |    否  |底部没有数据时显示的文字
| `distance`| number     |  200   |    否  |距离底部多大距离触发  `scrolltolower`方法
| `throttle`| boolean     |  true   |    否  |是否使用节流器，主要是用在scroll方法中，若为`true`那么scroll方法将在滚动停下来时进行触发；
| `hasMore` | boolean     |  true   |    否  |关系到显示底部文字，为`true`时显示`bottomLoadingText`文字，为`false`时显示`bottomText`文字
| `hasMore` | boolean     |  true   |    否  |关系到显示底部文字，为`true`时显示`bottomLoadingText`文字，为`false`时显示`bottomText`文字
---

### 方法

`flashEnd()`只是在下拉刷新的时候用此方法重置刷新状态

### 示例代码

```html
  <template>
    <div id="">
        <scrollView ref=scrollView scroll-y @scrolltolower='scrolltolower' :has-more='hasMore'  @flash=flash>
          <div v-for='item in list' :key=item>
            <p class="list-into">2019.10.30 22:40开奖</p>
            <item  />
          </div>
        </scrollView>
    </div>
  </template>

<script>
  // import { Indicator } from 'mint-ui'
  import scrollView from '@lib/components/scrollView'
  import item from '../../components/item'
  export default {
    components: {
      scrollView, item
    },
    data () {
      return {
        hasMore: true,
        list: 10
      }
    },
    // 相关操作事件
    methods: {
      flash () {
        this.list = 8
        setTimeout(() => {
          this.$refs.scrollView.flashEnd()
        }, 1000)
      },
      scrolltolower () {
        console.log('adsasdadsasd')
        if (this.list < 50) {
          this.list += this.list > 50 ? 0 : 10
        } else {
          setTimeout(() => {
            this.hasMore = false
          }, 2000)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@lib/common/stylus/variable.styl"
  .list-into{
    height 52px
    line-height 52px
    background rgb(243,242,245)
    padding  0 30px
    color rgb(136,136,136)
  }
</style>

```

### TODO

- [ ]  完善scroll-x相关的操作