import { Model } from '../store';
import rbac from './rbacList';
import cookie from './cookie';
import { reFetch } from '../store'

// login user/password的rest路径
// autologin路径
// logout
// 这些可设置默认值，比如/api/user/login,autlogin,logout，这样无需设定这几个参数即可创建

export class Auth extends Model {

    // 构造函数初始化state，不得dispatch
    constructor(initialState = {
        currentUser: null
    },loginUrl = '/api/user/login',
        logoutUrl = '/api/user/logout',
        autoLoginUrl = '/api/user/autoLogin',
        registerUrl = '/api/user/register') {
        //由于Auth是全局唯一的，我们不允许创建多个，故不提供id参数
        super(initialState,'Auth');
        this.loginUrl = loginUrl;
        this.logoutUrl = logoutUrl;
        this.autoLoginUrl = autoLoginUrl;
        this.registerUrl = registerUrl

        this.token = null;
        this.rbac = rbac;
        this.can = this.can;

        if (this.state.currentUser === null && cookie.check('current')) {
            this.state.currentUser = this.load();

            //load如果是异步函数的话，这里很可能出错
            if (!(this.state.currentUser && this.state.currentUser.id))
                this.state.currentUser = null;
        }
    }

    // 将currentUser保存在cookie中
    save = () => {
        if (this.currentUser !== null) {
            cookie.setJson('current', this.state.currentUser);
        }
    }

    //启动的时候读取cookie，如果已经保存，则将其读出
    // 要注意，fetch的header需要带token访问的
    load = () => {
        //if (cookie.check('current'))
        if (this.state.currentUser === null) {
            return this.state.currentUser = cookie.getJson('current');
            //this.render();
        }
        return null;
    }

    // 这里应是异步函数，使用await获取
    login = (id, password, isRemember) => {
        //需要return，才能返回promise
        return reFetch.post(this.loginUrl, { id, password })
            .then(res => { //这里的res已经是json数据，同时这里也表示成功
                if (res.user) {
                    //console.log('auth.js中，url和res.user存在，是：',this.loginUrl,res.user)
                    this.state.currentUser = res.user;
                    //if (isRemember) //!!! 任何时候都保存到cookie
                    this.save();
                    this.dispatch({ currentUser: this.state.currentUser });
                    
                    return null;
                } else
                {
                    //console.log('auth.js中，res.user不存在，在此抛出错误是:res.error',res.error,this.loginUrl)
                    throw res.error //论理说是不存在的，因为res.ok=false在refetch里已经抛出异常了
                }
            }).catch((res)=>{
                //console.log('auth.js中,login触发异常,error is:',res);
                throw res;
            })
    }

    signUp = (id, password, name, email) => {
        return reFetch.post(this.registerUrl, { id, password, name, email })
            .then(res => { //这里的res已经是json数据，同时这里也表示成功
                if (res.user) {
                    this.state.currentUser = res.user;
                    //if (isRemember) //!!! 任何时候都保存到cookie
                    this.save();
                    this.dispatch({ currentUser: this.state.currentUser });
                    return null;

                } else {
                    //console.log('at register,error is:',res)
                    throw (res) //论理说是不存在的，因为res.ok=false在refetch里已经抛出异常了
                }
            })
    }

    logout = () => {
        this.state.currentUser = null;
        cookie.remove('current');
        this.dispatch({ currentUser: this.state.currentUser });
    };

    isLogin = () => {
        //console.log('this.state.currentUser=',this.state.currentUser)
        return this.state.currentUser !== null;
    };

    can = async (action) => {
        if (!this.isLogin()) {
            return false;
        }
        return await this.rbac.can(this.state.currentUser.role, action)
    };
}

//这里使用singleten模式，提供全局唯一的Auth Model
//这样的好处是，可以任意的访问currentUser的属性，即使不在组件内。
let AuthObject;
const getAuth = () => {
    if (!AuthObject)
        AuthObject = new Auth({
            currentUser: null
        });
    return AuthObject;
};
export default getAuth(); //这样直接获得AuthObject实例，不需要执行

