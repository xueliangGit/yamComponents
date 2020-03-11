/*
 * @Author: xuxueliang
 * @Date: 2020-03-11 15:27:21
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-11 19:28:14
 */
var Yam = null
let appsInstalled = (window.appsInstalled || (window.appsInstalled = {}))
let comps = {}
function addApp (app) {
  (appsInstalled[app._tagName] || (appsInstalled[app._tagName] = {}))[app._eid] = app
}
function delApp (app) {
  appsInstalled[app._tagName][app._eid] = null
}
function updateApp (name) {
  console.log('appsInstalled', appsInstalled)
  let allApps = appsInstalled[name]
  if (allApps) {
    Object.keys(allApps).forEach(v => {
      allApps[v].$forceUpdate()
    })
    console.log(allApps)
  }
}
function yamHotReload () {
  return {
    name: 'hot-reload-load',
    install: function (target) {
      target.addLifeCycleCall('$beforeCreate', function () {
        console.log('hot-reload => $beforeCreate', this)
        addApp(this)
      })
    }
  }
}
function yamHotReloadCopy () {
  return {
    name: 'hot-reload-copy',
    install: function (target) {
      target.addPrototype('inherit', function (target) {
        // 鉴定是否应被掉过
        this.props = target['props']
        this.$slotSymbol = target['$slotSymbol']
        // 强制更新 此方法会根据组件的是否相同来更新的
        // 鉴定是否应被掉过
      })
    }
  }
}
function yamHotReloadUpdate () {
  return {
    name: 'hot-reload-update',
    install: function (target) {
      target.addPrototype('$forceUpdate', function () {
        // 鉴定是否应被掉过
        if (this instanceof comps[this._tagName] || this._editCalss instanceof comps[this._tagName]) {
          console.log('还是老的')
          this.update()
        } else {
          let newCopm = new comps[this._tagName]()
          this._editCalss = newCopm
          newCopm.inherit(this)
          var elm = this.elm
          this.__beforeDisconnectedCallback()
          this.__disconnectedCallback()
          elm.isInited = false
          newCopm.renderAt(this.elm)
          console.log('我是新的', this._tagName, newCopm._eid)
        }
        // 强制更新 此方法会根据组件的是否相同来更新的
        // 鉴定是否应被掉过
      })
    }
  }
}
function yamHotReloadDestroy () {
  return {
    name: 'hot-reload-destory',
    install: function (target) {
      target.addLifeCycleCall('$beforeDestroy', function () {
        console.log('hot-reload => $beforeCreate', this)
        delApp(this)
      })
    }
  }
}
exports.install = function (yam, app) {
  if (!Yam) {
    Yam = yam.__esModule ? yam.default : yam
    Yam.use(yamHotReload())
    Yam.use(yamHotReloadDestroy())
    Yam.use(yamHotReloadUpdate())
    Yam.use(yamHotReloadCopy())
  }
  comps[app._tagName] = app
  updateApp(app._tagName)
  console.log(app._tagName)
}
