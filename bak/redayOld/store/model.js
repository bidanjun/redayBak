import {registerToStore,removeFromStore} from './store';
import {isFunction} from '../util'; //,capitalize

export default class Model {
    constructor(initialState = {},id=null,withId=true) {
      this.withId=withId; //绑定到组件时，是否需要加上id
      this.state = initialState; //model的state直接用initailState覆盖
      this.id = id; //存放到Store的名称
      this.update = null; //绑定前是null，绑定传入组件的setState 

      //注册到Store
      if (!!id) {
        registerToStore(this,this.id);
      }
      // else {
      //   throw new Error('您必须提供id');
      // }

      // 这里在actions中，为每个状态创建setter
      // 这未必是需要的
      // this.actions = {};
      // Object.keys(this.state).forEach((key) => {
      //   this.actions[`set${capitalize(key)}`] = (val) => {
      //     this.dispatch( () => {
      //       this.state[key] = val;
      //       return {  [key]: val  };
      //     });
      //   };
      // });
    } 

    unRegister=()=>{
      if (!!this.id)
        removeFromStore(this.id);
    }
 
    // 这里由project调用即可
    setDispatch=(fn)=> {
      this.update = fn; // 改成箭头函数，否则dispatch传递给其它组件时，this会是undefine
    }
  
    dispatch=(fn)=> {
        if (isFunction(fn))
          this.update(this,fn);
        else //如果是object
          this.update(this,()=>fn); 
    }  
  }
  
  // 使用initialState快速创建一个model
  export function createModel(initialState={},id=null,withId=true) {
      class model extends Model {
          constructor(){
              super(initialState,id,withId)
          }
      }
      return new model();
  }

// 异步Model
// 除了现有状态外，加上pending、data、error三个状态

export class asyncModel extends Model {
  // pending初始化为true
  // 否则：第一次render的时候，会出现data和error为null，而pending为false的情况
  // 这会导致withAsync需要单独的判断
  constructor(initialState ={}, id=null,withId=false) {
    super(Object.assign({
      pending: false,
      data: null,
      error: null
    },initialState),id,withId);
  }

  // run函数只在click事件和DidComponet之类中执行
  run = (target) => {
    this.state.pending=true;
    this.dispatch({pending:this.state.pending});
    return target.then((res) => {
      this.state.pending = false;
      this.state.data = res;
      this.dispatch({ pending: this.state.pending, data: this.state.data });
    }).catch((err) => {
      this.state.pending = false;
      this.state.error = err;
      this.dispatch({ pending: this.state.pending, error: this.state.error });
      throw err; //必须抛出，否则登录窗体之类捕获不到异常
    })
  }
}