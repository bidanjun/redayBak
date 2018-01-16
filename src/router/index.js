import React  from 'react'
import routeParser  from 'route-parser'
import {registerState,store} from '../reday'


export class Router extends React.Component {
    constructor(props) {
        super(props)
        let routes = Object.keys(this.props.routes).map((route) => {
            return { route : new routeParser(route), handler : this.props.routes[route] }
        })
        this.state = {
          url : window.location.hash.slice(1),
          transitioning:false,
          routes : routes 
        }
    }
    render() {
        return this.getComponent() 
    }
    getComponent() {
        let url  = this.state.url === '' ? '/' : this.state.url
        return this.state.routes.reduce((def, route) => {
            let props = route.route.match(url)
            if (props) return this.createElement(route.handler, props)
            return def
        },<div>404 not found</div>)
    }

    navigated() {
      // Strip leading and trailing '/'
      let normalizedHash = window.location.hash.replace(/^#\/?|\/$/g, '');
    
      if (normalizedHash === '') {
        // Redirect for default route
        this.goto('/')
      }
      else {
        // Otherwise update our application state
        this.setState({location: normalizedHash.split('/'), transitioning: false});
      }
    }

    goto(newURI) {
      let currentURI = window.location.hash.substr(1);
    
      if (currentURI !== newURI) {
        this.setState({transitioning: true});
    
        window.location.replace(
          window.location.pathname + window.location.search + '#' + newURI
        );
      }
    }

    createElement(Handler, props) {
        return <Handler {...this.props} {...props} />
    }
    updateState() {
        if (this._mounted) this.setState({ url : window.location.hash.slice(1) })
    }
    componentDidMount() {
        this._mounted = true
        window.addEventListener('hashchange', this.updateState.bind(this))
    }
    componentWillUnmount() {
        this._mounted = false
        window.removeEventListener('hashchange', this.navigated.bind(this),false) 
    }
}

export default registerState('router',store,(comp)=>{comp.state.goto=comp.goto.bind(comp)})(Router)

