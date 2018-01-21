import React from 'react';

import Auth from './auth';
import {connect} from '../store';

// 使用Auth对象，这里需要登记重绘？
const needLogin = (WrappedComponent) => {
    class WithLogin extends React.Component {
        render() {  
            // //console.log('currentUser is ',this.props.Auth.currentUser);          
            if (this.props.Auth.isLogin()) {
                // 如果后面要使用Hoc，这里返回的必须是组件本身，不能是<WrappedComponent ...props>这类。
                // return <WrappedComponent {...this.props} />;
                return WrappedComponent;
            } else {
                return null;
            }
        }
    }

    const mapProps=()=>({
        Auth:Auth
    });
    const AddAuth=connect(mapProps)(WithLogin);
    return <AddAuth />; //这里返回组件
}
export default needLogin;