import React from 'react'
import Child from './child'


import {compose,useState, makeState,store} from '../../reday'
import counterModel from './counter.state'

const Counter = ({counterValue, handleIncrement}) => {
  return (
    <div>
      <button onClick={handleIncrement}> parent + </button>
      <span> {counterValue} </span>
      <Child />
    </div>
  )
}




//useState(()=>({counter:store.Counter.counter})), 
//mapPrps必须使用函数，否则会先行计算，此时状态尚未建立
//同时注意右侧的括号不能省掉，否则相当于没有返回值
//注意compose中，makeState在前，useState在后
const counter=new counterModel() //默认为'counter'
export default compose(  
  makeState('Counter',store,null,{counter}),
  useState(()=>{
    console.log('enter mapProps,store.Counter.counter=',store.Counter.counter,'store.Counter.state=',store.Counter.state);
    return {
      counterValue:store.Counter.state.counter,
      handleIncrement:()=>store.Counter.counter.setState(store.Counter.counter.increment)
      }
    })
 
) (Counter)

//等同于如下的写法：
// export default  
//   makeState({counter:0},'Counter',store)(
//   useState(()=>({
//     counter:store.Counter.counter,
//     handleIncrement:()=>store.Counter.setState(increment)
//   }))(Counter))