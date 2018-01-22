import React from 'react'
import {makeStore,compose,useState,store} from '../../reday'

// 在这里简单的忽略storeId
const increment=(state, props) => {
  return {counter:state.counter+1}
}

export class counterState {
  storeId=null
  state=null //指向组件state的指针
  setState = null
  constructor (storeId=null){
    this.storeId=storeId;
  }

  // 有意义的状态
  counter=0

  //action可直接调用
  handleIncrement=()=>this.setState(increment)

}

// objectState.setState(increment)可以执行
// 但this.setState(increment)报错
let objectState = {
  storeId:'objectCounter',
  objectIncrement:()=>{
    console.log('this is:',this)
    objectState.setState(increment)
  },

  counter:0
}

let counterFirst=new counterState('counterFirst')
//let counterSecond=new counterLeft()

export const Counter = ({counter, handleIncrement,objectCounter,objectIncrement}) => {
  return (
    <div>
      <button onClick={handleIncrement}> class counter + </button>
      <span> {counter} </span>

      <button onClick={objectIncrement}> object counter + </button>
      <span> {objectCounter} </span>
    </div>
  )
}

export default compose(
  makeStore('appState',store,counterFirst,objectState),
  useState(()=>{
    return {
      objectCounter:store.appState.objectCounter.counter,
      objectIncrement:store.appState.objectCounter.objectIncrement,
      counter:store.appState.counterFirst.counter,
      handleIncrement:store.appState.counterFirst.handleIncrement
    }
  }),
  

) (Counter)