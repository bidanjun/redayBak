import React from 'react'
import {store,useState} from '../../reday'

import counter from './counter.state'

// 纯手工的方式处理id:
// handleDecrement:()=>{
//   return store.Counter.setState((state)=>({counter:counter.decrement(state.counter)}))
// }

export default useState(()=>{
  console.log('enter mapProps');
  return {
    counterValue:store.Counter.state.counter,
    handleDecrement:()=>{
      return store.Counter.counter.setState(store.Counter.counter.decrement)
    }
  }
})( (props)=>{

  return (
    <div>
       ________grandChild: {store.Counter.state.counter}
       <button onClick={props.handleDecrement}>  - </button>
    </div>
  )
})