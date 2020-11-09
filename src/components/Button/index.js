/*
 * @Author: xuxueliang
 * @Date: 2020-10-21 11:19:31
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-10-21 16:08:34
 */
import { getTagName } from '@/utils/index'
import { uiprefix } from '@/config'
import Yam, { Component } from 'yamjs'
import style from './index.stylus'
console.log(getTagName('button'))
@Component({
  tagName: getTagName('button'),
  style: [style],
  props: {
    type: {
      validator (value) {
        return oneOf(value, ['primary', 'ghost', 'dashed', 'text', 'info', 'success', 'warning', 'error', 'default']);
      }
    },
    shape: {
      validator (value) {
        return oneOf(value, ['circle', 'circle-outline']);
      }
    },
    size: {
      validator (value) {
        return oneOf(value, ['small', 'large', 'default']);
      }
    },
    loading: Boolean,
    disabled: Boolean,
    htmlType: {
      default: 'button',
      validator (value) {
        return oneOf(value, ['button', 'submit', 'reset']);
      }
    },
    icon: String,
    long: {
      type: Boolean,
      default: false
    }
  }
})
class App extends Yam {
  $data () {
    return {
      // your data
    }
  }
  handleClick () {
    console.log(uiprefix)
  }
  render () {
    return <button
      type="htmlType"
      className="classes"
      disabled="disabled"
      onClick={ () => this.handleClick() } >
      {/* <Icon class="ivu-load-loop" type="load-c" v-if="loading"></Icon>
      <Icon type="icon" v-if="icon && !loading"></Icon> */}
      <slot />
      <span ref="slot">
      </span>
    </button >
  }
}
export default App
