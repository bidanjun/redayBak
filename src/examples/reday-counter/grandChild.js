import React from 'react'
import {store,useState} from '../../reday'
import {counter} from './counter'

// here,store.Counter=undefined
// we should import counter from counter.js
// let counter=store.Counter.counter;

// but we could use store.Counter.counter in jsx
// because it have been construct before render

export default useState(()=>{
  return {
    counterValue:store.Counter.state.counter,
    handleDecrement:()=>{
      return counter.setState(counter.decrement)
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