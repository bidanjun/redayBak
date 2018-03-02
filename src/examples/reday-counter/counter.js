import React from 'react'
import { compose, useState, makeState, store } from '../../reday'
import counterModel from './counter.state'
import Child from './child'

// first,the origion Component
const Counter = ({ counterValue, handleIncrement }) => {
  return (
    <div>
      <button onClick={handleIncrement}> parent + </button>
      <span> {counterValue} </span>
      <Child />
    </div>
  )
}

// add a model,and export it
export const counter = new counterModel() //默认为'counter'

// at the end,export the hoc for the origion component
// now this hoc have the initialState of model in its state
// we could access the hoc by store.Counter
// and access the model by store.Counter.counter,or only use the exported counter instance
export default compose(
  makeState('Counter', store, null, { counter }),
  useState(() => {
    return {
      counterValue: store.Counter.state.counter,
      handleIncrement: () => counter.setState(counter.increment)
    }
  })
)(Counter)
