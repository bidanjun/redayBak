
import counter from './counter';
import { setFlagsFromString } from 'v8';

describe('proxy', () => {
  it('proxy should instead the origin object', () => {

    // first we define an object
    const values={
      pending:false,
      rejected:false,
      resolved:true
    }

    // we define the handles
    const handler= {
      get (obj,prop) {
        const value = obj[prop];
        console.log(`GET ${prop} = ${value}`);
        return value;
      },

      set (obj,prop,value) {
        obj[prop]=value;
        console.log(`SET ${prop} = ${value}`);
        return value;

      }
    }

    const proxy = new Proxy(values, handler);
    expect(proxy.pending).toBe(false);
    proxy.pending=true;
    expect(proxy.pending).toBe(true);
    expect(values.pending).toBe(true);
  })

  it('proxy should instead the function', () => {

    let tracedObj = interceptObject(counter);
    let state=counter.intialState;
    const setState=(func)=>{
      console.log('state is:',state)
      state=func(state);
      console.log('state in setState is:',state)
    }
    function interceptObject(obj) {
      let handler = {
          get(target, propKey, receiver) {
              const origMethod = target[propKey];

              //返回的是个函数
              return function (...args) {
                console.log('args=',args,'origMethod is:',origMethod)
                  if (args.length>0) {
                    //args是一个数组
                    //传入需要展开
                    return setState(origMethod(...args))  //如果不用...args而是args，则变成字符串，1+2变成了字符串12
                    //return setState(origMethod.apply(this, args)) //否则传入的整数变成字符串
                    //console.log('result is:',result)
                    //return result;

                  } //高阶
                  else{
                    return setState(origMethod)
                    //return setState(origMethod.apply(this, args));
                  }
                  // let result = origMethod.apply(this, args);
                  // console.log(propKey + JSON.stringify(args)
                  //     + ' -> ' + JSON.stringify(result));
                  // return result;
              };
          }
      };
      return new Proxy(obj, handler);
  }

  let obj = {
    multiply(x, y) {
        return x * y;
    },
    squared(x) {
        return this.multiply(x, x);
    },
};



  
let result=tracedObj.increment()
  
  expect(state).toBe(1)
  result=tracedObj.add(2)
  console.log('result is:',result,'typeof result is:',typeof(result))
  expect(state).toBe(3)


  })


});