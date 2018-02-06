import React, { Component } from 'react'

// default store,you could made other store same way
export const store = {};


const withId=(id)=>(action)=>(state,props)=>{
  if (!!id) return {[id]:action(state[id],props)}
  else return action(state,props)
}

function interceptObject(obj,func,returnId) {
  let id=returnId; //在这里保存参数
      // 这里的action没有参数，必须确定为(state,props)=>形式


  let handler = {
    get(target, propKey, receiver) {
      const originMethod = target[propKey];
      console.log('target is:',target,'propkey is:',propKey)

      //返回的是个函数,如果传入参数则为高阶函数
      return function (...args) {
        //args是一个数组,传入需要展开
        //若有参数需要执行originMethod,得到最终的action,也可origMethod.apply(this, args)
        //若没有参数，则不要执行originMethod
        console.log('args=',args,'originMethod=',originMethod,'action=',withId(id)(args.length>0 ? originMethod(...args):originMethod))
        return func(withId(id)(args.length>0 ? originMethod(...args):originMethod))
      };
    }
  };
  return new Proxy(obj, handler);
}


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
export const createState = (initialState, getComponent=null,asyncAction=null,actions, useState = true) => WrappedComponent => {

  return class State extends Component {

    displayName = `State(${WrappedComponent.name || WrappedComponent.displayName})`;

    constructor(props, context) {
      super(props, context); // we couldn't use this before super(props,context)

      this.state = initialState ? initialState : {}
      registerThis(this); //if it has stateName,we'll register it in the storeObject

      // 这里需要判断，只有actions不为空，才做处理
      if (!!actions) {
        const actionKeys = Object.keys(actions) //数组，每个action的名字
        //如果actions不是空的，如{counter,leftCounter:...counter}
        //则调用其initialState,合并到state
        for (let i = 0; i < actionKeys.length; i++) {
          this.state = Object.assign({}, this.state, withId(actionKeys[i])(actions[actionKeys[i]].initialState)(this.state))
          //然后创建setState代理。
          this[actionKeys[i]] = interceptObject(actions[actionKeys[i]], this.setState, actionKeys[i]);
        }
      }

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
export default (initialState, stateName, storeObject = store,asyncAction=null,actions)=>WrappedComponent =>
  createState(initialState,(comp)=>{
    if (stateName)
      storeObject[stateName]=comp;
  },asyncAction,actions,true)(WrappedComponent) //notice here,we must use the WrappedComponent as argument

// here,we only provider state from asyncState
export const makeAsyncState = (asyncAction,stateName, storeObject = store)=>WrappedComponent =>
  createState({},(comp)=>{
    if (stateName)
      storeObject[stateName]=comp;
  },asyncAction,null,true)(WrappedComponent) //must have WrappedComponent here

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

