
import counter from './counter';

describe('proxy', () => {
  it('proxy should instead the origin object', () => {

    // first we define an object
    const values = {
      pending: false,
      rejected: false,
      resolved: true
    }

    // we define the handles
    const handler = {
      get(obj, prop) {
        const value = obj[prop];
        console.log(`GET ${prop} = ${value}`);
        return value;
      },

      set(obj, prop, value) {
        obj[prop] = value;
        console.log(`SET ${prop} = ${value}`);
        return value;

      }
    }

    const proxy = new Proxy(values, handler);
    expect(proxy.pending).toBe(false);
    proxy.pending = true;
    expect(proxy.pending).toBe(true);
    expect(values.pending).toBe(true);
  })

  // 注意这里只能处理2阶函数，3阶就会失败
  it('proxy should instead the function', () => {

    let state = 0;
    const setState = (func) => {
      state = func(state);
    }   


    // withid除了处理返回值，还要处理传入的值
    // action不单纯用state,而是[id]
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

    //测试没有id的情况
    let Counter = interceptObject(counter,setState);
    console.log('Counter.intialState is:',Counter.initialState)
    Counter.initialState();
    console.log('initialState is:',state)
    Counter.increment()
    expect(state).toEqual(1)
    Counter.add(2)
    expect(state).toEqual(3)

    //测试id为counter的情况
  
    //state={counter:0}
    let leftCounter = interceptObject(counter,setState,'counter');
    leftCounter.initialState();
    leftCounter.increment()
    expect(state).toEqual({counter:1})
    leftCounter.add(2)
    expect(state).toEqual({counter:3})

    //state={secondCounter:0}
    let secondCounter = interceptObject(counter,setState,'secondCounter');
    secondCounter.initialState();
    secondCounter.increment();
    expect(state).toEqual({secondCounter:1})
    console.log('state of second Counter is:',state)
    secondCounter.add(2)
    console.log('state of second Counter is:',state)
    expect(state).toEqual({secondCounter:3})

  

    // expect(secondCounter)
    // Counter.increment()
    // expect(state).toBe(1)
    // Counter.add(2)
    // expect(state).toBe(3)
  })


});