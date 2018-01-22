import React from 'react'
import {makeStore,compose,useState,store} from '../../reday'

// 在这里简单的忽略storeId
const increment=(state, props) => {
  return {counter:state.counter+1}
}

class counterLeft {
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

let counterFirst=new counterLeft('counterFirst')
//let counterSecond=new counterLeft()

const Counter = ({counter, handleIncrement}) => {
  return (
    <div>
      <button onClick={handleIncrement}> parent + </button>
      <span> {counter} </span>
    </div>
  )
}

export default compose(
  makeStore('appState',store,counterFirst),
  useState(()=>{
    return {
      counter:store.appState.counterFirst.counter,
      handleIncrement:store.appState.counterFirst.handleIncrement
    }
  }),
  

) (Counter)