
import Model from '../../reday/model'

export default class CounterModel extends Model{
  static initialState = 0

   //构造的时候，不用传入comp，因为这可能是个参数
  constructor (fieldId='counter') {
    super(CounterModel.initialState,fieldId) //initialState已经确定，因此构造函数只需要fieldId
  }

  // action函数
  increment=(prevState,props)=>prevState+1
  add=(val)=>(prevState,props)=>prevState+val
  decrement=(state,props)=>state-1

  // 其它业务逻辑，这里返回一个字符串
  formatCounter=()=>`目前的状态是:{$this.comp.state}`
}

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
// const decrement=(state,props)=>{
//   return state-1
// }
// export const counter= {initialState,add,increment,decrement};