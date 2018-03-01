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
  