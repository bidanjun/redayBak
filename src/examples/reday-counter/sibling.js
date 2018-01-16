import React from 'react'
import {store} from '../../lib/reday'

export default (props)=>{
  return (
    <div>
      sibling:{store.Counter.counter}
    </div>
  )
}