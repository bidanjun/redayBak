import React from 'react'

export const isFunction = fn => (typeof fn === 'function');

// mapProps，shoud be a function,provider props for component
export default (mapProps = null) => Component => {
  class UseState extends React.Component {
    constructor(props, context) {
      super(props, context);
      if (!isFunction(mapProps))
        throw new Error('mapProps should be a function')
      this.mapped = {};
      this.mapProps = mapProps;
    }
    componentWillUnmount() {
      this.setState = (state, callback) => {
        return;
      };
    }

    render() {
      if (this.mapProps)
        this.mapped = this.mapProps(this.props);

      return (
        <Component
          {...this.props}
          {...this.mapped}

        />
      )
    }
  }

  UseState.displayName = `UseState(${Component.name || Component.displayName})`;
  return UseState
}

