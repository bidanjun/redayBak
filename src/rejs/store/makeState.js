
// 自动的为状态增加函数，比如state.counter增加setCounter函数
// 这里同时将属性、状态和改变状态的函数，作为属性传递下去。
// from https://github.com/dai-shi/react-compose-state
import React from 'react';

const isFunction = fn => (typeof fn === 'function');
const capitalize = str => (str.charAt(0).toUpperCase() + str.slice(1));

const composeWithState = initialState => BaseComponent => (
  class extends React.PureComponent {
    constructor(props) {
      super(props);
      if (isFunction(initialState)) {
        this.state = initialState(props);
      } else {
        this.state = initialState;
      }
      this.state = this.state || {};
      this.stateSetters = {};
      Object.keys(this.state).forEach((key) => {
        this.stateSetters[`set${capitalize(key)}`] = (val) => {
          this.setState({ [key]: val });
        };
      });
    }
    render() {
      return (<BaseComponent {...this.props} {...this.state} {...this.stateSetters} />);
    }
  }
);

export default composeWithState;