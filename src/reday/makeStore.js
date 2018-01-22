
// makeStore，根据多个类实例或者object，创建一个单独的状态
// model如果有storeId字段，则加入状态时会附上该字段名，比如{counterLeft:{counter:0}}
// 如果没有，则直接加入状态，呈现为{counter:0}
// model得到state的指针和setState函数，前者可以访问整个状态，包括state.setState，这是组件原始的setState函数
// 后者是model使用的setState函数，如此在编写action的时候，无需考虑二级字段问题。
// 若没有复杂的业务逻辑，一个包括或不包括objectId字段的object,同样可简单用于makeStore
import React, { Component } from 'react';
import { store } from './'

//register state of a component to store
export const registerModel = (comp, models) => {
  let initialState = {}
  models.forEach(model => {
    if (!!model.storeId) {
      Object.defineProperty(model, 'state', {
        get: () => {
          return comp.state;
        }
      });

      // 用于处理storeId
      model.setState = (func) => {
        if (!model.storeId)
          return model.state.setState(func); //如果没有storeId,则直接的使用传来的函数

        //否则在这里处理storeId  
        model.state.setState((state, props) => {
          let result = func(state[model.storeId], props)//在storeId的层面，写action，这里先执行一遍得到结果
          return { [model.storeId]: { ...state[model.storeId], ...result } } //然后处理storeId
        })
      }
      console.log('model=',model)
    }

    // 此处不解开类的实例
    initialState = model.storeId ? { ...initialState, [model.storeId]: model } : { ...initialState, ...model }
  });
  comp.state = initialState;
  comp.setState = comp.setState.bind(comp)
  comp.state.setState = comp.setState;
}


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