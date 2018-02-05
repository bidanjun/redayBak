import React from 'react'
import {store,useState} from '../../reday'

export default useState(()=>{
  console.log('enter mapProps');
  return {
    counterValue:store.Counter.state.counter,
    handleDecrement:()=>{
      console.log('click button now,increment is:',store.Counter.counter.increment)
      return store.Counter.counter.decrement()
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