/*
 * @Author: xuxueliang
 * @Date: 2019-06-20 03:18:16
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-13 14:04:40
 */
// webpack.common.js
const path = require('path')
const config = require('../config')
const utils = require('./utils')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
const createLintingRule = () => ({
  test: /\.(js)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})
module.exports = {
  entry: {
    index: './src/index.js'
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.scss', 'styl'], // 添加在此的后缀所对应的文件可以省略后缀
    alias: {
      '@': resolve('src'),
      '@lib': resolve('lib') || '/Users/xuxueliang/mywork/xsb/act/xsb/lib',
      '@assets': resolve('src/assets'),
      '@app': resolve('src'),
      '@api': resolve('src/api')
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          'yamjs-loader'
        ],
        include: [resolve('src'), resolve('lib'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.html$/,
        use: 'text-loader'
      }
    ]
  },
}
