import React from 'react'
import {makeStore,compose,useState,store} from '../../reday'

class counterLeft {
  counter=0
  _state=null
  constructor (fieldName=null){
    this.fieldName=fieldName;
  }
  set state(value) {
    this._state=value;
  }
  get state () {
    return this._state;
  }
}

let counterLeft=counterLeft('counterLeft')
let counterRight=counterRight()

const increment=(fieldName)=>(state, props) => {
  return 
    {...state,[fieldName]:{counter: state.counter + 1}}
  }
const Counter = ({counter, handleIncrement}) => {
  return (
    <div>
      <button onClick={handleIncrement}> parent + </button>
      <span> {counter} </span>
    </div>
  )
}

export default compose(
  makeStore('appState',store,counterLeft,counterRight),
  useState(()=>{
    console.log('enter mapProps');
    return {
      counter:store.appState.counterLeft.counter,
      handleIncrement:()=>store.appState.setState(increment)
    }
  }),
  
) (Counter)