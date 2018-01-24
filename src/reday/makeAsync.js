import React, { Component } from 'react'

// 执行一个promise,即参数action
// 使用场景：预先载入数据，或者点击按钮执行，fetch场景，可以再次封装refetch
// pendingComp，promise正在运行时，要呈现的组件
// errorComp,promise执行出错时，要呈现的组件
// emptyComp,promise成功执行，但返回的数据为空的时候，要呈现的组件
// 在上述三个条件之外，才显示正常的Comp组件
export const makeAsync = (action,stateName,storeObject=store,mapFunc=null,renderFunc) => (Comp) =>
  class withAsync extends Component {
    constructor(props) {
      super(props);

      this.state = {
        data: null,
        pending: false,
        error: null,
      };

       if (!!mapFunc) mapFunc(this);
      registerThis(this,stateName,storeObject)
    }

    async componentDidMount() {
      this.setState(()=>({ pending: true }));
      let result;
      try {
        let data=await action(this.props);
        this.setState(()=>({ data, pending: false,error:null }))
      }
      catch(error)
      {
        this.setState(()=>({ error, pending: false }))
      };
    }

    render() {
      return renderFunc(this.state,this.props)
    }
  }
  
  // 这里调用高阶组件，comp实际上就是这么传递过去的
export const makeAsyncstate = (action, stateName, storeObject = store, mapFunc = null, pendingComp = null, errorComp = null) => (comp) =>
  makeAsync(action, stateName, storeObject, mapFunc, (state, props) => {
      if (state.pending) {
        if (pendingComp) return pendingComp
        return <div>loading... </div>
      }
      if (state.error) {
        if (errorComp) return <errorComp error={state.error} />
        return <div>{state.error} </div>
  
      }
      // 这里同时将setState也传递下去了
      return <Comp  { ...state } { ...props } />
    })

  