import React, { Component } from 'react'

// default store,you could made other store same way
export const store = {};

export default (initialState, stateName, storeObejct = store) => WrappedComponent => {
  class State extends Component {
    constructor(props, context) {
      super(props, context);
      this.state = initialState ? initialState : {}
      this.setState = this.setState.bind(this)
      this.state.setState = this.setState;

      Object.defineProperty(storeObejct, stateName, {
        get: () => {
          return this.state;
        }
      });
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
        />
      )
    }
  }
  State.displayName = `State(${Component.name || Component.displayName})`;
  return State
}



