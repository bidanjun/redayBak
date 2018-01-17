import React  from 'react'
import routeParser  from 'route-parser'
import {registerState,store} from '../'


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

    goto(newURI) {
      let currentURI = window.location.hash.substr(1);
    
      if (currentURI !== newURI) {
        this.setState({transitioning: true});
    
        window.location.replace(
          window.location.pathname + window.location.search + '#' + newURI
        );
      }
      console.log('goto')
    }

    createElement(Handler, props) {
        return <Handler {...this.props} {...props} />
    }
    updateState() {
        if (this._mounted ) this.setState({
          url : window.location.hash.slice(1),
          transitioning: false
        })
    }
    componentDidMount() {
        this._mounted = true
        window.addEventListener('hashchange', this.updateState.bind(this),false)
    }
    componentWillUnmount() {
        this._mounted = false
        window.removeEventListener('hashchange', this.updateState.bind(this),false) 
    }
}

// return HashRouter component
// we could use store.router.goto(url) to change the url
// and could type the url in browser,then show the expect component
// export default registerState('router',store,(comp)=>{
//     comp.state.goto=comp.goto.bind(comp)
// })(Router)

// here return a function
export const makeRouter=(stateName='router',storeObject=store)=>registerState(stateName,storeObject,(comp)=>{
    comp.state.goto=comp.goto.bind(comp)
})(Router)

// return HashRouter component
// we could use store.router.goto(url) to change the url
// and could type the url in browser,then show the expect component
export default makeRouter();

