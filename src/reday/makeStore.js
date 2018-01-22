
// makeStore，根据多个类实例，创建一个单独的状态
// class必须有storeId字段，用于决定其是直接加入状态，还是需要一个字段名
// class同时得到state的指针，这样可以访问相应的状态和setState方法
// 如果有storeId，则action需要为两级，一级自动的处理storeId，便于action统一书写

//需要测试一下



// 创建一个state
// 该state按照字段划分
import React, { Component } from 'react';
import { store } from './'

//register state of a component to store
// model的构造函数只需要一个storeId
// model的成员是initialState
// model可以使用this.state,该state由makeStore传递过去
// model没有其它的限制，我们可以提供一个修改多级状态的帮助函数
export const registerModel = (comp, models) => {
  let initialState = {}


  models.forEach(model => {

    Object.defineProperty(model, 'state', {
      get: () => {
        return comp.state;
      }
    });

    // 此处不解开类的实例
    initialState = model.storeId ? { ...initialState, [model.storeId]: model } : { ...initialState, ...model }
  });
  comp.state = initialState;
  comp.setState = comp.setState.bind(comp)
  comp.state.setState = comp.setState;
}


//给出initialState
//获得state
//提供业务逻辑和action

// !!整个本身就当作状态，有field加上，没有直接展开
// 当整个加到state的时候，则组件本身，具有它的全部功能
// 这样甚至连initState都不需要
// 换言之this.state={...state,[storeId]:...user}
// 若storeId===null，则(...state,...user)

// model只需要storeId，创建时为null，则不能用于makeStore
// 注意：stateName和storeName由makeState和makeStore决定！！
// 初始状态和storeId用来构建初始状态，
// state和store的名字可以任意
// 用于组合构建initialState
// 当单独使用的时候storeId无用
// 同时model应该提供初始状态，该状态全部实例公用
// 实例field存在的时候，makeStore处理它，makeState无需提供，若提供则makeState同样的按字段处理
// 总的来说，多个状态用makeStore，单个用makeState
// export class model {
//   constructor (storeId=null) {
//     this.storeId=storeId;
//   }
//   static get initialState() {
//     return {}
//   }
//   get initialState() {
//     return model.initialState
//   }
// }

// 此刻makeStore决定storeName和stateName
// model决定storeId,若storeId为空则整体移入
export default (stateName, storeObejct = store, ...models) => WrappedComponent => {
  class Store extends Component {
    constructor(props, context) {

      super(props, context);
      this.state = {}
      registerModel(this, models);

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
      //console.log('makeStore|constructor=>store=', store.appState)
    }

    render() {
      // 这里不将state作为属性传递下去
      // console.log('makeState|render=>')
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