import React from 'react';
import {asyncModel} from '../store';
import Auth from './auth';

import {connect} from '../store'



// 使用Auth对象，这里需要登记重绘？
const can =(action)=>(WrappedComponent) => {
    class WithCan extends React.Component {

        componentDidMount(){
            this.props.Wait.run(this.props.Auth.can(action));
        }
        //  componentDidMount(){
        //      this.props.Wait.run(this.props.Auth.can(action));
        //  }
         render() {  
             
            let {Wait} =this.props;
            if (Wait.state.pending) {
                // pending的时候，调用两次can，是对的，因为我们判断了两次条件
                // //console.log('pending now,props is:',this.props);
                return <div>loading... </div>
            }
            if (Wait.state.error!==null)
                return <div> {Wait.state.error} </div>
            
            //同样,resolve之后也调用了两次can
            if (Wait.state.data !==null && !Wait.state.data)
                return null;
            
            return WrappedComponent;
        }
    }

    
  const Waiter=new asyncModel();
   const mapProps=()=>({
        Wait:Waiter,
        Auth:Auth
    })
   
    
    const AddAuth=connect(mapProps,Waiter)(WithCan);
    
    return <AddAuth />; //这里返回组件
}
export default can;