
import React from 'react'
import {store} from '../../lib/reday'
import GrandChild from './grandChild'

export default (props)=>{
  return (
    <div>
       ____child: {store.Counter.counter}
       <GrandChild />
    </div>
  )
}