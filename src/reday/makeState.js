import React, { Component } from 'react'

// default store,you could made other store same way
export const store = {};

//register state of a component to store
const registerThis = (comp,stateName, storeObejct = store)=>{  
  comp.setState = comp.setState.bind(comp)
  comp.state.setState = comp.setState;

  //add setStateAsync,so we could use async/await
  comp.state.setStateAsync=(func)=>{
    return new Promise((resolve) => {
      comp.setState(func, resolve)
    });
  }
  Object.defineProperty(storeObejct, stateName, {
    get: () => {
      return comp.state;
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
      console.log('makeState|constructor=>')
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
  console.log('makeState|hoc=>') //这里store为空，因为State类的构造方法还没有执行
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

import React, { Component } from 'react';


// 执行一个promise,即参数action
// 使用场景：预先载入数据，或者点击按钮执行，fetch场景，可以再次封装refetch
// pendingComp，promise正在运行时，要呈现的组件
// errorComp,promise执行出错时，要呈现的组件
// emptyComp,promise成功执行，但返回的数据为空的时候，要呈现的组件
// 在上述三个条件之外，才显示正常的Comp组件
const makeAsyncState = (action,pendingComp=null,errorComp=null) => (Comp) =>
  class withAsync extends Component {
    constructor(props) {
      super(props);

      this.state = {
        data: {},
        pending: false,
        error: null,
      };
    }

    async componentDidMount() {
      this.setState(()=>{ pending: true });
      let result;
      try {
        result=await action(this.props);
        this.setState({ ...result, pending: false,error:null })
      }
      catch(error)
      {
        this.setState({ error, pending: false })
      };
    }

    render() {
      if (this.state.pending) {
          if (pendingComp) return pendingComp
          return <div>loading... </div>
      }
      if (this.state.error){
          if (errorComp) return <errorComp error={this.state.error} />
          return <div>{this.state.error} </div>

      }

      return <Comp { ...this.props } { ...this.state } />
    }
  }

