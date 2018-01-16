import React, { Component } from 'react'

// default store,you could made other store same way
export const store = {};

//register state of a component to store
const registerThis = (comp,stateName, storeObejct = store)=>{  
  comp.setState = comp.setState.bind(comp)
  comp.state.setState = comp.setState;
  Object.defineProperty(storeObejct, stateName, {
    get: () => {
      return this.state;
    }
  });
}

//an hoc to create state for wrappedComponent
//most times we use this to make state,and access anywhere by store
// mapFunc could bind some function of component to state : (comp)=>{
// comp.state.func=comp.func.bind(comp);
// comp.state.anotherFunc=comp.anotherFunc.bind(comp)};
//so we could use these function outside component
export default (initialState, stateName, storeObejct = store,mapFunc = null) => WrappedComponent => {
  class State extends Component {
    constructor(props, context) {
      super(props, context);
      this.state = initialState ? initialState : {}
      if (!!mapFunc) mapFunc(this);
      registerThis(this,stateName,storeObejct)
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
        />
      )
    }
  }
  State.displayName = `State(${WrappedComponent.name || WrappedComponent.displayName})`;
  return State
}


// get the state of a component,and register to store
export const registerState= (stateName,storeObjet=store,mapFunc=null)=>(WrappedComponent)=> {
  class Register extends WrappedComponent {
    constructor(props,context) {
      super(props, context);
      if (!!mapFunc) mapFunc(this);
      registerThis(this,stateName,storeObjet)
    }
    render() {
      return super.render()
    }
  }
  Register.displayName = `Register(${WrappedComponent.name || WrappedComponent.displayName})`;
  return Register
}

