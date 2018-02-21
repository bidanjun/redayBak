

const withId=(id)=>(action)=>(state,props)=>{
  if (!!id) return {[id]:action(state[id],props)}
  else return action(state,props)
}

function interceptObject(obj,func,returnId) {
  let id=returnId; //在这里保存参数
      // 这里的action没有参数，必须确定为(state,props)=>形式


  let handler = {
    get(target, propKey, receiver) {
      const originMethod = target[propKey];
      console.log('target is:',target,'propkey is:',propKey)

      //返回的是个函数,如果传入参数则为高阶函数
      return function (...args) {
        //args是一个数组,传入需要展开
        //若有参数需要执行originMethod,得到最终的action,也可origMethod.apply(this, args)
        //若没有参数，则不要执行originMethod
        console.log('args=',args,'originMethod=',originMethod,'action=',withId(id)(args.length>0 ? originMethod(...args):originMethod))
        return func(withId(id)(args.length>0 ? originMethod(...args):originMethod))
      };
    }
  };
  return new Proxy(obj, handler);
}

// 返回一个object，其中每个都是一个代理，自动的绑定到某个组件并处理id,自动的拦截并运行setState
// actions参数类似 {counter,user}等
// 
export default function bindAction(comp,actions) {
      // 这里需要判断，只有actions不为空，才做处理
      const result={}
      if (!!actions) {
        const actionKeys = Object.keys(actions) //数组，每个action的名字
        //如果actions不是空的，如{counter,leftCounter:...counter}
        //则调用其initialState,合并到state
        for (let i = 0; i < actionKeys.length; i++) {
          
          // 不处理initialState
          //this.state = Object.assign({}, this.state, withId(actionKeys[i])(actions[actionKeys[i]].initialState)(this.state))

          //创建setState代理。
          result[actionKeys[i]] = interceptObject(actions[actionKeys[i]], comp.setState, actionKeys[i]);
        }
      }
      return result;

}

