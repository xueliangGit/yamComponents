export default (function (win, doc) {
  var code1 = '<div  style="max-width:250px;line-height: 22px;transition:opacity 0.2s  ease,bottom 0.4s cubic-bezier(0.65, 0.5, 0.55, 1.3),top 0.4s  cubic-bezier(0.65, 0.5, 0.55, 1.3);bottom:0;top:0;position:fixed;background:#000;color:#fff;padding:10px 20px;background:rgba(0,0,0,.8);border-radius:5px;-webkit-transition::opacity 0.2s  ease,bottom 0.4s cubic-bezier(0.65, 0.5, 0.55, 1.3),top 0.4s  cubic-bezier(0.65, 0.5, 0.55, 1.3);font-size:14px;text-align:center;z-index:1000000;opacity:0;visibility:hidden;box-sizing:content-box;">'
  var code2 = '</div>'
  function Toast () {
    this.author = 'SlothSilence:xuxueliang'
    this.body = doc.getElementsByTagName('body')[0]
    console.log('Toast：运行正常')
  }
  function getStyle (obj, styles) {
    return parseInt(obj.currentStyle ? obj.currentStyle : win.getComputedStyle(obj, null)[styles])
  }
  Toast.prototype = {
    show: function (val, vertical, type, duration) { // type:success warn error
      var str = code1 + val + code2
      var _ = this
      var time = null
      var d = doc.createElement('div')
      duration = duration || 1000
      d.innerHTML = str
      _.body = _.body ? _.body : doc.getElementsByTagName('body')[0]
      _.body.appendChild(d)
      var div = d.getElementsByTagName('div')[0]
      var width_ = getStyle(div, 'width') + 40
      div.style.marginLeft = -width_ / 2 + 'px'
      div.style.left = '50%'
      switch (type) {
        case 'success':
          div.style.background = 'green'
          break
        case 'warn':
          div.style.background = 'orange'
          break
        case 'error':
          div.style.background = 'red'
          break
      }
      if (vertical === 'bottom') {
        div.style.bottom = '50px'
        div.style.top = 'auto'
      } else if (vertical === 'top') {
        div.style.bottom = 'auto'
        div.style.top = '50px'
      } else {
        div.style.bottom = 'auto'
        div.style.top = '50%'
        d.style.position = 'fixed'
        d.style.top = '45%'
        d.style.marginTop = '-36px'
        div.style.position = 'static'
        div.style.margin = '0 auto'
        d.style.marginLeft = -width_ / 2 + 'px'
        d.style.left = '50%'
        d.style.zIndex = 100
      }
      div.style.opacity = 1
      div.style.visibility = 'visible'
      time = setTimeout(function () {
        if (time) {
          time = null
          div.style.opacity = 0
          setTimeout(function () {
            _.body.removeChild(d)
          }, 1000)
        }
      }, duration)
      div.onclick = function () {
        if (time) {
          clearTimeout(time)
          time = null
          div.style.opacity = 0
          setTimeout(function () {
            _.body.removeChild(d)
          }, 1000)
        }
      }
    },
    showShortBottom: function (val, type, duration) {
      this.show(val, 'bottom', type, duration)
    },
    showShortTop: function (val, type, duration) {
      this.show(val, 'top', type, duration)
    },
    showShortCenter: function (val, type, duration) {
      this.show(val, null, type, duration)
    },
    bottom: function (val, type, duration) {
      this.show(val, 'bottom', type, duration)
    },
    center: function (val, type, duration) {
      this.show(val, null, type, duration)
    },
    top: function (val, type, duration) {
      this.show(val, 'top', type, duration)
    }
  }
  return new Toast()
})(window, document)
