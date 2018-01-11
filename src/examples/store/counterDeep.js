import React from 'react'
import {connect } from '../../reday';

import {counterLeft} from './counter.state';

const CounterDeep = (props) => {

  //console.log('render child')
  return (
    <div >
      <h2>Counter from child: {props.counter}</h2>
      <button onClick={e => props.dec()} children='-' />
      <button onClick={e => props.inc()} children='+' />

      <h2>Counter for deep child state: {props.deepCounter}</h2>
      <button onClick={e => props.decDeep()} children='-' />
      <button onClick={e => props.incDeep()} children='+' />
      
      <button onClick={e => props.actions.setCounter(10)} children='set counter to 10 ' />
    </div>
  )
}

  const mapProps=()=>({
    actions:counterLeft.actions,
    counter:counterLeft.state.counter,
    dec:counterLeft.dec,
    inc:counterLeft.inc,
    deepCounter:counterLeft.state.another.hide.counter,
    decDeep:counterLeft.decDeep,
    incDeep:counterLeft.incDeep,  
  });
  
  export default connect(mapProps)(CounterDeep)