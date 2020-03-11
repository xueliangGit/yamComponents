# Baobao Bridge function Name

## *emit 方法

`Bridge.emit(fnName,param)`

`fnName:要执行的方法名字；`

`param： 执行的参数`

fnName已经有的值navigateBack，switchTab，navigateTo，reLaunch，redirectTo（同小程序作用）

navigateToWeb 去指定的web页面 

## getNative

`getNative 获取原声值`

`Bridge.getNative(type).then((res)=>{})`

`type 是获得值的名字；`

`方法返回一个promise`