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

// default beforeRender
//这里pendingComp如何传递？测试一下！！
const beforeRenderDefault=(comp,pendingComp,errorComp)=>{
  if (comp.state.pending) {
    if (pendingComp) return pendingComp
    return <div>loading... </div>
  }
  if (comp.state.error) {
    if (errorComp) return <errorComp error={comp.state.error} />
    return <div>{comp.state.error} </div>

  }
  // 这里同时将setState也传递下去了
  // return <Comp  { ...comp.state } { ...comp.props } />
}
//an hoc to create state for wrappedComponent
//most times we use this to make state,and access anywhere by store
// mapFunc could bind some function of component to state : (comp)=>{
// comp.state.func=comp.func.bind(comp);
// comp.state.anotherFunc=comp.anotherFunc.bind(comp)};
//so we could use these function outside component
// beforeRender可以提供一个默认值，处理pending,progress,error这3个组件全局保持一致
// empty可以调用这个默认值
// 另外一个render函数则是login和rbac情况
export default (initialState, stateName, storeObject = store,beforeMount=null,beforeRender=beforeRenderDefault,beforeUnmount=null) => WrappedComponent => {
  class State extends Component {
    constructor(props, context) {
      
      super(props, context); // we couldn't use this before super(props,context)
      this.state = initialState ? initialState : {}
      if (beforeMount)
        this.state = {
          ...this.state,
          data: null,
          pending: false,

          pendingToatal:-1, //若需要处理进度
          pendingCounter:-1,

          error: null,
        };
      registerThis(this,stateName,storeObject)
      // console.log('makeState|constructor=>')
    }

    async componentDidMount() {
      if (beforeMount) {
        this.setState(() => ({ pending: true }));

        // 这样获得的数据是{data:结果}
        try {
          let data = await this.props.mount(this.props);
          this.setState(() => ({ data, pending: false, error: null }))
        }
        catch (error) {
          this.setState(() => ({ error, pending: false }))
        };
      }
    }

    render() {
      console.log('makeState|render=>')

      // 如果需要处理条件render
      let renderOther=null;      
      if (beforeMount && beforeRender) {
        renderOther=beforeRender(this)

        //对于权限判断，可在renderOther中处理
        //data:false...这样很明显，我们没有得到授权，renderOther返回null
        if (renderOther || renderOther===null) //仅当renderOther不为空或null的时候，才返回renderOther
          return renderOther;
      }

      // 如果renderOther没有拦截，则返回正常组件
      // 但这里明显有问题，我们如何处理返回null的情形？
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



