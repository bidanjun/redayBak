import React from 'react'
import Child from './child'


import {compose,useState, makeState,store} from '../../reday'

const initialState=(state,props)=>{
  console.log('initialState,state=',state)
  return 0;
}
const add=(value)=>(state,props)=>{
  return  state+value
}
const increment=(state,props)=>{
  return state+1
}
const decrement=(state,props)=>{
  return state-1
}
export const counter= {initialState,add,increment,decrement};



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
export default compose(  
  makeState({},'Counter',store,null,{counter}),
  useState(()=>{
    console.log('enter mapProps');
    return {
      counterValue:store.Counter.state.counter,
      handleIncrement:()=>{
        console.log('click button now,increment is:',store.Counter.counter.increment)
        return store.Counter.counter.increment()
      }
    }
  }),
  
) (Counter)

//等同于如下的写法：
// export default  
//   makeState({counter:0},'Counter',store)(
//   useState(()=>({
//     counter:store.Counter.counter,
//     handleIncrement:()=>store.Counter.setState(increment)
//   }))(Counter))