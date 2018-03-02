import React, { Component } from 'react'

// 要点1：makeState可以同时返回组件和组件指针,return{component,thisOfComponent}
// export app=makeState,app.Render(wrappedComponent)和app.component.state
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
// initialModels是一个对象 {counter,leftCounter,rightCounter}
// initialState是一个对象，提供初始的
export const createState = (getComponent=null,initialState,initialModels, asyncAction=null,useState = true) => WrappedComponent => {

  return class State extends Component {

    displayName = `State(${WrappedComponent.name || WrappedComponent.displayName})`;

    constructor(props, context) {
      super(props, context); // we couldn't use this before super(props,context)

      this.state = initialState ? initialState : {}
      
      const modelIds = Object.keys(initialModels) //数组，每个action的名字
      modelIds.forEach((modelName)=>{
        this[modelName]=initialModels[modelName]; //这样将每个变量，按原来的名字保存在组件的this指针，便于访问
      })
      // 这里处理model的initialState,并将model保存在this指针
      let prevState={}
      modelIds.forEach((model)=>{
        
        //需要得到model的变量名

        if (!!this[model].fieldId)
          prevState = {[this[model].fieldId]:this[model].initialState, ...this.state}
        else prevState = {...this.state,...this[model].initialState}
        this[model].bindToComponent(this);
      })
      this.state={...prevState};


      this.initialAction=asyncAction; //这里保存，以便刷新
      registerThis(this); //if it has stateName,we'll register it in the storeObject



      // 处理异步状态
      if (asyncAction) //if has asyncAction,add pending,error,and data field to state
        this.state = {...this.state,
          data: null,
          pending: false,
          error: null,
        };      
      
      
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
export default (stateName, storeObject = store,initialState,initialModels, asyncAction=null,useState = true)=>WrappedComponent =>
  createState((comp)=>{
    if (stateName)
      storeObject[stateName]=comp;
  },initialState,initialModels, asyncAction,useState)(WrappedComponent) //notice here,we must use the WrappedComponent as argument

// here,we only provider state from asyncState
export const makeAsyncState = (asyncAction,stateName, storeObject = store)=>WrappedComponent =>
  createState((comp)=>{
    if (stateName)
      storeObject[stateName]=comp;
  },null,null, asyncAction,true)(WrappedComponent) //must have WrappedComponent here

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

