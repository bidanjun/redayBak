import React from 'react'
import Counter from './counter';
import Sibling from './sibling'

// when we add two Counter tag
// first Counter couldn't increment
// because we make two store.Counter
// this is a bug,we must makeState only when store.Counter isn't exist.
// but,when we want two defrence <Counter />
// how could we do it? the same state here.
export default ()=>{
  return (
    <div>
      <Counter />
      <Sibling />
      <Counter />
     </div>
  )
}