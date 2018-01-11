import Route  from 'route-parser';
import {Model} from '../store';

// 状态就是个url
export default class Router extends Model {
    constructor(routes,initialState={url:'/'},id='Router',withId=true){
        super(initialState,id,withId);

        // routes的键，也就是路径，用来创建Route-parser对象
        // 对应的组件存在handler，实际上是一个函数
        this.routes = Object.keys(routes).map((route) => {
            return { route : new Route(route), handler : routes[route] }
        })
    }

    // 加入render参数，避免在to之后执行model.render
    // 这样会出现4次警告：不能在render的过程中使用forceUpdate
    // 重定向修改浏览器地址，本身就会有重新绘
    setUrl = (urlString)=>{        
        //console.log('router,state is:',this.state)    
        this.state.url=urlString;
        this.dispatch({url:urlString})
        
        //this.redirect(this.state.url); 
    }

    // 只修改浏览器地址，触发事件，然后执行上面的setUrl
    // 以程序方式执行的时候，使用redirect
    // 按钮导航的时候使用setUrl
    redirect = (urlString,render=true)=>{

        let routeString = urlString;
        if (routeString.indexOf('#') === -1)
            routeString = '#' + routeString;
        //先改浏览器地址，再render,否则notFound页面会有警告信息。
        // 注意，直接赋值和replace不同，后者不保存历史。
        window.location.hash=routeString
    }
}