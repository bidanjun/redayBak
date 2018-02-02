
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

  it('proxy should instead the function', () => {

    let state = counter.intialState;
    const setState = (func) => {
      state = func(state);
    }
    let Counter = interceptObject(counter,setState);

    function interceptObject(obj,func) {
      let handler = {
        get(target, propKey, receiver) {
          const originMethod = target[propKey];

          //返回的是个函数,如果传入参数则为高阶函数
          return function (...args) {
            //args是一个数组,传入需要展开
            //若有参数需要执行originMethod,得到最终的action,也可origMethod.apply(this, args)
            //若没有参数，则不要执行originMethod
            return func(args.length>0 ? originMethod(...args):originMethod)
          };
        }
      };
      return new Proxy(obj, handler);
    }

    Counter.increment()
    expect(state).toBe(1)
    Counter.add(2)
    expect(state).toBe(3)
  })


});