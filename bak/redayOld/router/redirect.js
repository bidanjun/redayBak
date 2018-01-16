
import React,{Component} from 'react';
import {connect} from '../';

const redirect = (url,router=null) => {

    class Redirect extends Component {
        componentDidMount() {
            this.props.redirect(url);
        }
        render() {
            return null;
        }
    }

    // ！！！不能用小写enhance
    const mapProps=()=>({
        redirect:router.redirect
    })
    const Enhance=connect(mapProps)(Redirect);

    // !!!这里必须返回组件形式，而不是简单的返回类Redirect或Enhance
    return <Enhance />;
}
export default redirect;