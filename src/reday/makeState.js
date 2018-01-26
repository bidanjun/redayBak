import React, { Component } from 'react'

// default store,you could made other store same way
export const store = {};

//register state of a component to store
export const registerThis = (comp,stateName, storeObejct = store)=>{
  if (!stateName)
    return; //we could only pass the state to child as props
  comp.setState = comp.setState.bind(comp)
  storeObejct[stateName]=comp;
  // Object.defineProperty(storeObejct, stateName, {
  //   get: () => {
  //     return comp;
  //   }
  // });

  //add setStateAsync,so we could use async/await
  //异步setState，便于await后执行，或中途取消
  comp.setStateAsync=(func)=>{
    return new Promise((resolve) => {
      comp.setState(func, resolve)
    });
  }
}

//an hoc to create state for wrappedComponent
//most times we use this to make state,and access anywhere by store
// mapFunc could bind some function of component to state : (comp)=>{
// comp.state.func=comp.func.bind(comp);
// comp.state.anotherFunc=comp.anotherFunc.bind(comp)};
//so we could use these function outside component
export default (initialState, stateName, storeObject = store) => WrappedComponent => {
  class State extends Component {
    constructor(props, context) {
      
      super(props, context); // we couldn't use this before super(props,context)
      this.state = initialState ? initialState : {}
      registerThis(this,stateName,storeObject)
      // console.log('makeState|constructor=>')
    }

    render() {
      console.log('makeState|render=>')
      return (
        <WrappedComponent
          {...this.state} {...this.props}
        />
      )
    }
  }
  console.log('makeState|hoc=>') //这里store为空，因为State类的构造方法还没有执行
  State.displayName = `State(${WrappedComponent.name || WrappedComponent.displayName})`;
  return State
}


// get the state of a component,and register to store
export const registerState= (stateName,storeObjet=store)=>(WrappedComponent)=> {
  class Register extends WrappedComponent {
    constructor(props,context) {
      super(props, context);
      registerThis(this,stateName,storeObjet)
    }
    render() {
      return super.render()
    }
  }
  Register.displayName = `Register(${WrappedComponent.name || WrappedComponent.displayName})`;
  return Register
}



