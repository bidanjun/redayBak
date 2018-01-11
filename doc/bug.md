
## [已修复] connect组件创建且连接后，mapProps不再执行，导致无法根据Store的变化刷新ui
  这里注意组件的生命周期：
  1. 构造函数：在构造的时候执行一次，以后不再执行
  2. ComponentDidMounted：在连接组件的时候执行一次，以后不再执行
    我们就是将更新逻辑在这里处理。这导致连接后的组件，不再更新
  3. componentWillReceiveProps：初始化渲染不执行，但每次接收到更新的props之前执行
    将更新逻辑移到这里，问题解决。
  注意，这意味着，我们或不需要处理state，而仅仅是更改属性。
  因为provider hoc注意，是新的组件，其属性传递给child的时候，会触发更新，根本不需要用setState触发？？

## [已修复]02.dispatch在传递给组件，作为属性时，this成为undefine
  dispatch(fn) {
  }
  修改为dispatch=(fn)=> {}
  this仅仅指类本身的this,原来的写法，this指函数dispatch的this.
  同时，setDispatch同样如此。

## [已修复]01.Router导致的警告:
  在使用redirect，修改浏览器地址，会触发hash-changed事件
  在这里我们会调用setUrl，从而引发render
  而redirect之后对状态的修改继续进行，极可能造成，组件在rending状态，继续执行setState
  这会触发警告，同时这些状态改变的语句并没有正常执行。