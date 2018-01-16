import React from 'react'
import { provider } from '../../reday';
import { counterLeft } from './counter.state';
import CounterDeep from './counterDeep';

const Counter = (props) => {
  return (
    <div id='counter'>
      <h2>Count: {props.counter} another.hide.counter is: {props.another.hide.counter}</h2>
      <h2> counterLeft.another.hide.counter is: {props.counterLeft.another.hide.counter} </h2>
      <button onClick={e => props.dec()} children='-' />
      <button onClick={e => props.inc()} children='+' />
      <CounterDeep />
    </div>
  )
}

//如果将某个实例的全部状态传递过去：return counterLeft.state就好
//如果多个实例传递...merge它们再返回。
//这里也可以任意的定义计算字段，甚至在不同的model中
const mapStates = fn => {
  counterLeft.setDispatch(fn);
  return ({
    counterLeft:counterLeft.state,
    counter: counterLeft.state.counter,
    another: { hide: { counter: counterLeft.state.another.hide.counter } }
  })
}
//console.log(Object.keys(counterLeft));
const mapProps = () => ({
  dec: counterLeft.dec,
  inc: counterLeft.inc,
  decDeep: counterLeft.decDeep,
  incDeep: counterLeft.incDeep
});

export default provider(mapStates, mapProps)(Counter)