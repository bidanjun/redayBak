import React, { Component } from 'react'
import PropTypes from 'prop-types'

// 此处的models是一组字符串，表示context的id
const withModel = (...models) => (Wrapper) => {
  class WithModel extends Component {
    componentDidMount() {
      // if (!this.unsubscribe)
      //   this.unsubscribe = {};
      // models.forEach((id) => {
      //   this.unsubscribe[id] = this.context[id].model.subscribe(() => this.forceUpdate())
      // })
    }

    componentWillUnmount() {
      // Object.keys(this.unsubscribe).forEach((unsub) => {
      //   this.unsubscribe[unsub]();
      // });
    }

    render() {
      return (
        <Wrapper {...this.props} {...this.context} />
      )
    }
  }

  const types = {};
  models.forEach((id) => {
    types[id] = PropTypes.object;
  })
  WithModel.contextTypes = types;
  return WithModel
}

export default withModel;