# navContent 组件

### 属性

|        属性        |    类型     | 默认值 | 必填 | 说明                                                                                                                              |
| :----------------: | :---------: | :----: | :--: | :-------------------------------------------------------------------------------------------------------------------------------- |
|      `title`       |   string    |  耳觅  |  否  | navbar 上显示的标题                                                                                                               |
|      `isFull`      |   Boolean   |  true  |  否  | 是否全屏模式；非全屏模式会隐藏回退按钮                                                                                            |
|       `top`        |   Boolean   | false  |  否  | 内容区是否全屏                                                                                                                    |
|     `newTabs`      |   boolean   | false  |  否  | 是否替换 `navbar` 为自定义,若是要替换需要在新的 narbar 上添加`slot=newtab`                                                        |
|   `styleObject`    |   Object    |   {}   |  否  | narbar 的样式                                                                                                                     |
|     `bkColor`      |   string    |   ''   |  否  | 滚动页面时会根据高度来设置 narbar 背景色，该值存在时意味着背景一开始是透明的；不要在 `styleObject`内在设置背景颜色了              |
|      `scroll`      |   boolean   | false  |  否  | 是否触发传递滚动操作                                                                                                              |
|  `@on-reach-top`   | eventhandle |        |  否  | 前置条件`scroll=true`;检测触顶操作，有两种触发操作：1、滚动触顶后会触发；2、在顶部下拉时会触发（当需要下拉刷新时触发方法）        |
| `@on-reach-bottom` | eventhandle |        |  否  | 前置条件`scroll=true`;检测触底操作，有两种触发操作：1、滚动触底后会触发；2、在底部上拉时会触发 （当需要上拉加载更多时时触发方法） |
|     `@scroll`      |   boolean   |  true  |  否  | 前置条件`scroll=true`;滚动时触发，返回参数{reachBottom:boolean,reachTop:boolean}                                                  |

---

### 插槽

内部插槽有三个：

`nav-right`标题右侧显示的图标

`nav-fixed`标题正下方的位置；用于据顶定位

`newtab` 自定义导航条，只有在`newTab=true`时生效

### 示例代码

```html

```

### TODO

- [ ] 1
