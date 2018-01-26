import React from 'react'
import {store} from '../../reday'

export default (props)=>{
  return (
    <div>
      sibling:{store.Counter.state.counter}
    </div>
  )
}