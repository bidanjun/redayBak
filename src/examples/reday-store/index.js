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

  // 用于处理storeId
  setState=(func)=> {
    if (!this.storeId)
      return this.state.setState(func); //如果没有storeId,则直接的使用传来的函数
    
      //否则在这里处理storeId  
    this.state.setState((state,props)=>{
      let result=func(state[this.storeId],props)//在storeId的层面，写action，这里先执行一遍得到结果
      return {[this.storeId]:{...state[this.storeId],...result}} //然后处理storeId
    })  
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