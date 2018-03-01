// const initialState=(state,props)=>{
//   console.log('initialState,state=',state)
//   return 0;
// }
// const add=(value)=>(state,props)=>{
//   return  state+value
// }
// const increment=(state,props)=>{
//   return state+1
// }
// export default {initialState,add,increment};

import Model from '../reday/model'

export default class Counter extends Model{
  static initialState = 0

   //构造的时候，不用传入comp，因为这可能是个参数
  constructor (fieldId='Counter') {
    super(Counter.initialState,fieldId) //initialState已经确定，因此构造函数只需要fieldId
  }

  // action函数
  increment=(prevState,props)=>prevState+1
  add=(val)=>(prevState,props)=>prevState+val

  // 其它业务逻辑，这里返回一个字符串
  formatCounter=()=>`目前的状态是:{$this.comp.state}`
}
// bind的时候，需要将model变量加入到组件,这样用store.App.leftCounter这类方式简单的调用
// 也可以将store.app.leftCounter export出去，从而leftCounter.increment这类方式调用
// createState这里处理initialState和initialModels，前者用于简单的创建状态，传递props，后者则处理字段id
// 之后的makeState，则用两个参数，指出Store和组件的引用名称
// 不需要特别的makeStore,根据传入参数而定。
// 使用createState还可以将comp直接赋予某个变量，不存放在Store中。

  