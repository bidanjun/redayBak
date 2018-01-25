
import React from 'react'
import {store} from '../../reday'
import GrandChild from './grandChild'

export default (props)=>{
  return (
    <div>
       ____child: {store.Counter.state.counter}
       <GrandChild />
    </div>
  )
}