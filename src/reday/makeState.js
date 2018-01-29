import React, { Component } from 'react'

// default store,you could made other store same way
export const store = {};

//直接使用，可将component的指针，传递给一个单一的变量
export const createState = (initialState, getComponent, useState = true) => WrappedComponent => {

  return class State extends Component {

    displayName = `State(${WrappedComponent.name || WrappedComponent.displayName})`;

    constructor(props, context) {
      super(props, context); // we couldn't use this before super(props,context)
      this.state = initialState ? initialState : {}
      this.setState = this.setState.bind(this); //::
      this.setStateAsync = (action) => {
        return new Promise((resolve) => {
          this.setState(action, resolve)
        });
      }
      this.setStateAsync = this.setStateAsync.bind(this);
      getComponent(this); //这里将组件指针传递出去
    }

    render() {
      let toProps={}
      if (useState)
        toProps={...this.state}

      return (
        <WrappedComponent
          {...toProps} {...this.props}
        />
      )
    }
  }//end State component 
}

// 这里默认的使用makeState
export default (initialState, stateName, storeObject = store)=>WrappedComponent =>
  createState(initialState,(comp)=>{
    if (stateName)
    storeObject[stateName]=comp;
  })(WrappedComponent) //注意如何复用hoc，这里用到WrappedComponent

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



