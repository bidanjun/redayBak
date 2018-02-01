import React, { Component } from 'react'

// default store,you could made other store same way
export const store = {};



// register component with state to a store
export const registerThis = (comp, stateName = null, storeObject = store) => {
  comp.setState = comp.setState.bind(comp); //::
  comp.setStateAsync = (action) => {
    return new Promise((resolve) => {
      comp.setState(action, resolve)
    });
  }
  comp.setStateAsync = comp.setStateAsync.bind(this);
  if (stateName)
    storeObject[stateName] = comp;
}

//create a component that has state
// initialState is a object,
// getInstance,like (component)=>{},you could get the instance and save it
// useState is true by default,will map all state to child's props
// asyncActions is a function that return a promise,if it's not null ,it will be exceute
// in componentDidMount,and we'll add pending and error,data states to the state
export const createState = (initialState, getComponent=null, useState = true,asyncAction=null) => WrappedComponent => {

  return class State extends Component {

    displayName = `State(${WrappedComponent.name || WrappedComponent.displayName})`;

    constructor(props, context) {
      super(props, context); // we couldn't use this before super(props,context)

      this.state = initialState ? initialState : {}
      if (asyncAction) //if has asyncAction,add pending,error,and data field to state
        this.state = {...this.state,
          data: null,
          pending: false,
          error: null,
        };      
      
      registerThis(this); //if it has stateName,we'll register it in the storeObject
      getComponent(this); // here you could get the instance of the component,and save it by yourself
    }

    async componentDidMount() {
      if (!!asyncAction) {
        this.setState(() => ({ pending: true }));

        // the data store in the state,with fieldName 'data'
        try {
          let data = await asyncAction(this.props);
          this.setState(() => ({ data, pending: false, error: null }))
        }
        catch (error) {
          this.setState(() => ({ error, pending: false }))
        };
      }
    }

    render() {
      let toProps={}
      if (useState || asyncAction)
        toProps={...this.state}

      return (
        <WrappedComponent
          {...toProps} {...this.props} {...{setState:this.setState}}
        />
      )
    }
  }//end State component 
}

//the default makeState hoc
//if you provider a asyncAction,that mean we'll excute it at componentDidMount
export default (initialState, stateName, storeObject = store,asyncAction=null)=>WrappedComponent =>
  createState(initialState,(comp)=>{
    if (stateName)
      storeObject[stateName]=comp;
  },true,asyncAction)(WrappedComponent) //notice here,we must use the WrappedComponent as argument

// here,we only provider state from asyncState
export const makeAsyncState = (asyncAction,stateName, storeObject = store)=>WrappedComponent =>
  createState({},(comp)=>{
    if (stateName)
      storeObject[stateName]=comp;
  },true,asyncAction)(WrappedComponent) //must have WrappedComponent here

// get the state of a component,and register to store
export const registerState= (stateName=null,storeObject=store)=>(WrappedComponent)=> {
  class Register extends WrappedComponent {
    constructor(props,context) {
      super(props, context);
      registerThis(this,stateName,storeObject)
    }

    render() {
      return super.render()
    }
  }
  Register.displayName = `Register(${WrappedComponent.name || WrappedComponent.displayName})`;
  return Register
}

export const actionWithField=(field)=>(action)=>(state,props)=>{
  if (!!field)
    return ({ [field]: { ...state[field], ...action(state[field], props)}})
  else
    return {...action(state, props)}
}

// 包装action,加上id处理
// 注意，同时兼顾了原action的参数。
export const withId=(comp,field)=>(...args)=>(action)=>(state,props)=>{
  if (!!field)
    return ({ [field]: { ...state[field], ...action(state[field], props)(args)}})
  else
    return {...action(state, props)(args)}
}

//这样遍历传入的counter之类action集合，对于每个函数，用withId包装即可

// 传入的参数，是object,包括一个initialState,一组action
// 类似
// counter.js
// initState=0
// const increment=(value)=>(state,props)=>state+value
// const add=increment(1)
// export default  {initState,increment,add}

// import counter from './counter'
// 则counter是一个对象。在state里是{counter:0}
// 如果import leftCounter from './counter',则在state里会是{leftCounter:0}

//这里一次性的为其组件增加counter对象，包括和counter同名的函数，但使用withId包裹，使用组件的setState
//如此获取counter状态，用appState.state.counter
//修改counter状态用appState.user.increment(3) //setState自动执行了,且处理了状态中的id
export const makeNestedState=(stateName,storeObject,...models)=>{
  models.map((model)=>{
    
  })

}