import React from 'react'

export const isFunction = fn => (typeof fn === 'function');

// mapProps，shoud be a function,provider props for component
export default (mapProps = null) => WrappedComponent => {
  class UseState extends React.Component {
    constructor(props, context) {
      
      super(props, context);
      if (!isFunction(mapProps))
        throw new Error('mapProps should be a function')
      this.mapped = {};
      this.mapProps = mapProps;
      //console.log('useState|constructor=>')
    }
    // componentWillUnmount() {
    //   this.setState = (state, callback) => {
    //     return;
    //   };
    // }

    render() {
      //console.log('useState|render=>')
      if (this.mapProps)
        this.mapped = this.mapProps(this.props);

      return (
        <WrappedComponent
          {...this.props}
          {...this.mapped}

        />
      )
    }
  }

  //console.log('useState|hoc=>')
  UseState.displayName = `UseState(${WrappedComponent.name || WrappedComponent.displayName})`;
  return UseState
}