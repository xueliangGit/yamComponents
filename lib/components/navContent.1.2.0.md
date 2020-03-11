<!--
 * @Author: zhengguozhi
 * @Date: 2019-12-31 16:37:39
 * @LastEditors: zhengguozhi
 * @LastEditTime: 2020-03-05 16:29:31
 -->

# navContent 组件 1.2.0

## 注意

_**由于 navContent 使用了 height。100%的高度；所以在使用时需要 navContent 在最外层，否则需要在最外层的 div 上写上`height:100%`的样式**_

### 属性

|          属性          |    类型     | 默认值 | 必填 | 说明                                                                             |
| :--------------------: | :---------: | :----: | :--: | :------------------------------------------------------------------------------- |
|        `title`         |   string    |  耳觅  |  否  | navbar 上显示的标题                                                              |
|    `isTestGesture`     |   Boolean   |  true  |  否  | 手势进入调试等                                                                   |
|        `isFull`        |   Boolean   | false  |  否  | 是否内容区全屏                                                                   |
|       `needFull`       |   Boolean   |  true  |  否  | 是否全屏模式；非全屏模式会隐藏回退按钮，去掉 startbar 展位                       |
|        `newTab`        |   boolean   | false  |  否  | 是否替换 `navbar` 为自定义,若是要替换需要在新的 narbar 上添加`slot=newtab`       |
|     `globalStyle`      |   Object    |   {}   |  否  | 全局样式 主要是底色                                                              |
|     `hasStatusBar`     |   boolean   |  true  |  否  | 是否包含状态栏                                                                   |
| `hideContentStatusBar` |   boolean   | false  |  否  | 是否包含内容区状态栏                                                             |
|       `hasBack`        |   boolean   |  true  |  否  | 是否显示回退按钮                                                                 |
|      `navBkColor`      |   string    | '#fff' |  否  | 导航背景色                                                                       |
|      `navFeColor`      |   string    | '#333' |  否  | 导航前景色                                                                       |
|     `navFontsize`      |   string    | '20px' |  否  | 导航字号                                                                         |
|     `scrollColor`      |   boolean   | false  |  否  | 是否是滚动变色的？                                                               |
|        `scroll`        |   boolean   | false  |  否  | 是否触发传递滚动操作                                                             |
|    `@on-pull-down`     | eventhandle |        |  否  | 前置条件`scroll=true` 在顶部下拉时会触发（当需要下拉刷新时触发方法）             |
|     `@on-pull-up`      | eventhandle |        |  否  | 前置条件`scroll=true` 在底部上拉时会触发（当需要上拉加载时触发方法）             |
|    `@on-reach-top`     | eventhandle |        |  否  | 前置条件`scroll=true`;检测触顶操作，滚动触顶后会触发；                           |
|   `@on-reach-bottom`   | eventhandle |        |  否  | 前置条件`scroll=true`;检测触底操作，滚动触底后会触发；                           |
|       `@scroll`        |   boolean   | false  |  否  | 前置条件`scroll=true`;滚动时触发，返回参数{reachBottom:boolean,reachTop:boolean} |

---

### 插槽

内部插槽有三个：

`nav-right`标题右侧显示的图标

`nav-fixed`标题正下方的位置；用于据顶定位

`nav-bottom-fixed`内容区正下方的位置；用于据底定位

`newtab` 自定义导航条，只有在`newTab=true`时生效

### z-index

nav 和 nav-bottom 的 z-index 是 5

### 尺寸

本组件按 375px 标准设计的；

若是设计稿不是这个尺寸需要在项目下的`assets/css/variable.styl`文件添加`$navHeight`、`$backFontSize`值

该值的默认值是

> 新添加全局`$scale`,比例默认时 1；对应的是 375；
>
> 可选值是 2 对应是 750；
>
> 可以调节该值，快速适配尺寸；

```scss
$navHeight=44px
$backFontSize=28px
```

### 示例代码

```html

```

### TODO

- [ ] 1
