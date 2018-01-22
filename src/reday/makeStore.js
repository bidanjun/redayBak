
// makeStore，根据多个类实例，创建一个单独的状态
// class必须有fieldName字段，用于决定其是直接加入状态，还是需要一个字段名
// class同时得到state的指针，这样可以访问相应的状态和setState方法
// 如果有fieldName，则action需要为两级，一级自动的处理fieldName，便于action统一书写

//需要测试一下



// 创建一个state
// 该state按照字段划分
import React, { Component } from 'react';
import {store} from './'

//register state of a component to store
export const registerModel = (comp,models)=>{  
  let initialState={}


  models.forEach(model => {
   
    Object.defineProperty(model, 'state', {
      get: () => {
        return comp.state;
      }
    }); 
   
    // 此处不解开类的实例
    initialState=model.fieldName?{...initialState,[model.fieldName]:model}:{...initialState,...model}
    console.log('initialState=',initialState)
 
  });
  comp.state=initialState;
  comp.setState = comp.setState.bind(comp)
  comp.state.setState = comp.setState;  
}


//给出initialState
//获得state
//提供业务逻辑和action

// !!整个本身就当作状态，有field加上，没有直接展开
// 当整个加到state的时候，则组件本身，具有它的全部功能
// 这样甚至连initState都不需要
// 换言之this.state={...state,[fieldName]:...user}
// 若fieldName===null，则(...state,...user)

// model只需要fieldName，创建时为null，则不能用于makeStore
// 注意：stateName和storeName由makeState和makeStore决定！！
// 初始状态和fieldName用来构建初始状态，
// state和store的名字可以任意
// 用于组合构建initialState
// 当单独使用的时候fieldName无用
// 同时model应该提供初始状态，该状态全部实例公用
// 实例field存在的时候，makeStore处理它，makeState无需提供，若提供则makeState同样的按字段处理
// 总的来说，多个状态用makeStore，单个用makeState
// export class model {
//   constructor (fieldName=null) {
//     this.fieldName=fieldName;
//   }
//   static get initialState() {
//     return {}
//   }
//   get initialState() {
//     return model.initialState
//   }
// }

// 此刻makeStore决定storeName和stateName
// model决定fieldName,若fieldName为空则整体移入
export default (stateName,storeObejct=store,...models) => WrappedComponent => {
  class Store extends Component {
    constructor(props, context) {

      super(props, context);
      this.state = {}
      console.log('...models=',models)
     
      registerModel(this,models);

      //add setStateAsync,so we could use async/await
      this.state.setStateAsync = (func) => {
        return new Promise((resolve) => {
          this.setState(func, resolve)
        });
      }
      Object.defineProperty(storeObejct, stateName, {
        get: () => {
          return this.state;
        }
      });
      console.log('makeStore|constructor=>store=',store.appState)
    }

    render() {
      console.log('makeState|render=>')
      return (
        <WrappedComponent
          {...this.props}
        />
      )
    }


  }

  Store.displayName = `Store(${WrappedComponent.name || WrappedComponent.displayName})`;
  return Store

}