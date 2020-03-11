# yamjs-loader

这是一个针对 yamjs 应用的 webpack 加载器，目前该加载器只有一个功能就是处理 style 样式的逻辑；针对样式内部的配置来处理样式是否仅限于组件生效；

使用方式，放在 babel 之前即可；

```js
// rule
{
  test: /\.js$/,
	use: [
		'babel-loader',
		'yamjs-loader'
	]
},
```

使用 `yamjs-cli` 创建应用将自动使用该 `loader`。

目前仅支持使用
