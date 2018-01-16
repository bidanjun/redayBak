import React from 'react'
import {store} from '../../lib/reday'

export default (props)=>{
  const handleDecrement = ()=>{
    store.Counter.setState((state,props)=> {
      return {
        counter:state.counter-1
      }    
    })
  }
  return (
    <div>
       ________grandChild: {store.Counter.counter}
       <button onClick={handleDecrement}>  - </button>
    </div>
  )
}