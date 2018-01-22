import React from 'react'
import {makeStore,compose,useState,store} from '../../reday'

class counterLeft {
  counter=0
  fieldName=null
  state=null //指向组件state的指针
  constructor (fieldName=null){
    this.fieldName=fieldName;
  }

  handleIncrement=()=>this.state.setState(increment(this.fieldName))

}

let counterFirst=new counterLeft('counterFirst')
//let counterSecond=new counterLeft()

const increment=(fieldName)=>(state, props) => {
  console.log('currentState:',state)

  // 步骤1，修改counter,但要保留[fieldName]的其它内容
  // 否则除了counter之外的其它字段、函数消失
  let result={[fieldName]:{...state[fieldName],counter:state[fieldName].counter+1}} //因此这里需要保留全部，然后修改counter
  
  
  // 不需要，我们仅仅提供需要修改的部分即可，不需要构建完整的
  //let merged={...state,...result} //用后面的覆盖前面的
  return result// 注意不可写成{...result,...state}
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
  makeStore('appState',store,counterFirst),
  useState(()=>{
    return {
      counter:store.appState.counterFirst.counter,
      handleIncrement:store.appState.counterFirst.handleIncrement
    }
  }),
  

) (Counter)