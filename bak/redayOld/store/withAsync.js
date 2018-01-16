import React from 'react';
import {asyncModel} from './model';
import {connect} from './'
// Hoc，为组件提供执行Promise的功能
// 首次将执行promise，得到数据后，调用load需要带true参数，否则不会执行。
// 正确获取数据后，会给组件提供一个属性，如果modelWillConnect已经命名，属性就是这个名字
// 否则属性名称为model,而model.data包括从服务端返回的数据

// 设计思维紊乱，准备逐步替换
// 组件预先载入数据，即执行一个promise,载入过程中显示waiting组件，出错显示error组件,没有数据显示empty组件
// 只有预先载入数据正常，才显示被其包装的组件
// 因此这里实在不需要有asyncModel的概念，设计为一个Component，loading之类的，由状态替换即可。
export default (modelWillConnect,action, refresh=true,pendingRender = null, catchRender = null, emptyRender = null) =>
  (WrappedComponent) => {
    
    // 数据的id和属性的id如果相等，则不重复读入
    // 有数据，且设为不刷新，则不重新读入
    class WithAsync extends React.Component {
      componentDidMount() {
        let {excute} = this.props;
        let {data} = this.props[!!modelWillConnect?modelWillConnect.id:'model'];
        
        //如果属性中有id字段，而已经读取的data中也有id字段，且两者一致的时候，不重新读取
        if (this.props.id && data && 
          (data.id+'')===(this.props.id+''))
          return;
         if (!refresh && data!==null)
           return;
         
        excute(action(this.props)); //action需要带上props参数
      }
      render() {
        // 注意waitAsync，不作为属性往下传递，这部分工作在外面执行的
        let {pending,error,data} = this.props[!!modelWillConnect?modelWillConnect.id:'model'];
        // 第一次渲染必须显示loading,要加上以下的判断:    
        // !waitAsync.state.pending && !waitAsync.state.data && !waitAsync.state.error)
        // 但这样导致错误不能截获
        if (pending ||(
          !pending && !data && !error)) {
          if (pendingRender)
            return pendingRender;
          return <div>loading... </div>
        }
        if (error){
          console.log('error in server:',error);
          return <div> {'请检查服务器是否启动，不能读取数据...'} </div>

        }
          

        // 这里处理条件render?
        // if (waitAsync.data !== null && !waitAsync.data)
        //   return null;
        // data={waitAsync.state.data} 

        if (data)
            return (<WrappedComponent {...this.props} />);
        //注意两种方式，比如data是一个数组，则{...data}将数组的每个元素映射下去。
        //另一种如下：将data这个数组，作为data属性往下传递
        // console.log('now bug here,wait.state=',waitAsync.state)
        // console.log('props is:',this.props)
        return null;
        
      }
    }

    let model;
    if (!!modelWillConnect)
      model=modelWillConnect;
    else
      model=new asyncModel({},'model',true);

    //1. 这里比较多余,model.run直接在组件中执行就好了，不需要特地增加一个
    const mapProps = () => ({
      excute: model.run
    }) 
    return connect(mapProps,model)(WithAsync)

    // const mapProps = () => ({
    //   waitAsync: waitAsync
    // })    
    // //在函数中，返回类本身
    // if (!!model)
    //   return connect(mapProps)(WithAsync)
    // else
    //   return connect(mapProps, waitAsync)(WithAsync)
}




// const conditionFn = (props) => !props.todos;

// const withCondition = (conditionalRenderingFn) => (Component) => (props) =>
//   conditionalRenderingFn(props)
//     ? null
//     : <Component { ...props } />

// const withEither = (conditionalRenderingFn, EitherComponent) => (Component) => (props) =>
//   conditionalRenderingFn(props)
//     ? <EitherComponent />
//     : <Component { ...props } />