import React, { Component } from 'react';


// 执行一个promise,即参数action
// 使用场景：预先载入数据，或者点击按钮执行，fetch场景，可以再次封装refetch
// pendingComp，promise正在运行时，要呈现的组件
// errorComp,promise执行出错时，要呈现的组件
// emptyComp,promise成功执行，但返回的数据为空的时候，要呈现的组件
// 在上述三个条件之外，才显示正常的Comp组件
const runAsync = (action,pendingComp=null,errorComp=null,emptyComp=null) => (Comp) =>
  class withAsync extends Component {
    constructor(props) {
      super(props);

      this.state = {
        data: {},
        pending: false,
        error: null,
      };
    }

    componentDidMount() {
      this.setState({ pending: true });
      action(this.props).then(data => {
          this.setState({ data, pending: false })
      })
      .catch(error => this.setState({ error, pending: false }));
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

      if (!this.state.data){
          if (emptyComp) return emptyComp;
          return <div>没有数据 </div>
      }

      return <Comp { ...this.props } { ...this.state } />
    }
  }

  export default runAsync;
