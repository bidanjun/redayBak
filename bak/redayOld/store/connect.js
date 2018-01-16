import React from 'react'
import { isFunction } from '../util'

// mapProps，为下级组件提供属性
// ...models，将model的状态，映射到组件的状态中。model中操纵状态的函数，在mapProps里传递。
export const connect = (mapProps = null, ...models) => Component => {
  class Connected extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.mapped = {};

      //Todo:这里可以考虑由model提供合并方法，类似redux,否则就Object.assign
      models.forEach((model) => {
        if (model.withId)
          this.state = Object.assign(this.state, { [model.id]: model.state });
        else
          this.state = Object.assign(this.state, model.state)
        model.setDispatch(this.update);
      });

      this.mapProps = mapProps;
      if (this.mapProps)
        this.mapped = isFunction(this.mapProps) ?
          this.mapProps(this.props) : this.mapProps;
    }

    // 这比较重要，dispatch直接对initialState的格式操作就好
    // 同时可以使用原来组件的属性和状态值，比如 {counter:state.counter+1}就成为可能
    // 将update函数，绑定到model，而不是直接绑定setState
    // 如果model映射过去带id,则为其加上id后合并到state
    update = (model, func) => {
      if (!model.withId) {
        model.state = Object.assign(model.state, func(this.state, this.props));
        this.setState(() => model.state);
      }
      else {
        model.state = Object.assign(model.state, func(this.state[model.id], this.props));
        this.setState(() => ({ [model.id]: model.state }));
      }
    }

    // 自作聪明，mapped应该在render中处理
    // 由于Connect组件，并没接收新的属性,下面的代码是完全不执行的
    // componentWillReceiveProps() {
    //   console.log('enter componentWillReceiveProps')
    //   //注意这里无需处理state,因为setState传递给了所有model
    //   //model修改state的时候会触发render
    //   //而render将会使用新的state,map到下级组件

    //   // 将map逻辑从构造函数中移动到这里
    //   // 这样，在已经构造的情形下，每次改变props才会重新计算
    //   if (this.mapProps) 
    //     this.mapped = isFunction(this.mapProps)? 
    //       this.mapProps(this.props):this.mapProps;  
    //   console.log('the mapped is:',this.mapped)  
    // }

    //组件被卸载的时候，让setState函数设为什么都不做
    //避免在unMount状态下调用setState触发错误提示
    //这种方法，不用考虑mount，因为重新mount后setState将恢复  
    componentWillUnmount() {
      //重写组件的setState方法，直接返回空
      this.setState = (state, callback) => {
        return;
      };
    }

    render() {
      if (this.mapProps)
        this.mapped = isFunction(this.mapProps) ?
          this.mapProps(this.props) : this.mapProps;

      // console.log('this.props',this.props);
      // console.log('this.state',this.state);
      // console.log('this.mapped',this.mapped);

      //将this.state放在前面，同名则使用mapped替代。
      // 事实上state是否要转换成属性下传，未必需要。
      return (
        <Component
          {...this.props}
          {...this.state}
          {...this.mapped}

        />
      )
    }
  }
  return Connected
}

// 只提供状态
// 如果只映射属性，则models不提供即可。
export default function provider(...models) {
  return connect(null, models); //不映射属性，只提供状态
}