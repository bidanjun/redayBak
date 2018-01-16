
// 这是组件，用来划定一块用于导航的区域
// 必须提供Router属性
/*
from :https://github.com/asbjornenge/tiny-react-router/blob/master/Router.js
*/
import React from 'react';

export default ({Router}) => {
    class HashRouter extends React.Component {

        render() {
            return this.getComponent()
        }
        getComponent() {
            if (Router.state.url !== window.location.hash.slice(1)) {
                Router.state.url = window.location.hash.slice(1);
            }

            let url = Router.state.url === '' ? '/' : Router.state.url

            return Router.routes.reduce((def, route) => {
                let arg = route.route.match(url)
                if (arg) return this.createElement(route.handler, arg)
                return def
            }, <div>404 not found</div>)
        }
        createElement(Handler, props) {
            return <Handler {...this.props} {...props} />
        }
        updateState() {
            if (this._mounted && Router.state.url !== window.location.hash.slice(1)) {
                Router.setUrl({ url : window.location.hash.slice(1) });
            }
        }
        componentDidMount() {
            this._mounted = true
            window.addEventListener('hashchange', this.updateState.bind(this))           
        }
        componentWillUnmount() {
            this._mounted = false
            window.removeEventListener('hashchange', this.updateState.bind(this)) 
        }
    }

    return <HashRouter />;
}

