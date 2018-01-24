
import {Auth} from '../auth';

export default class refetch {

  static get(url, parameter) {
    return this._fetch(url, 'GET', parameter);
  }

  static post(url, parameter) {
    return this._fetch(url, 'POST', parameter);
  }

  static async _fetch(url, method, parameter) {

    //!!!问题：静态函数的this.  与实例有关吗？使用是正确的，但概念还不清晰
    ///let options = this._getFetchOptions(method, parameter);

    let options = refetch._getFetchOptions(method, parameter);
    // 返回的是一个Promise
    // 事实上new Promise不需要，因为fetch本身返回的也是promise
    try {
      let res=await fetch(url, options);
      if (res.ok) {
        //console.log('refetch:res is ok')
        return res.json();
      } else {
        let err=await res.text(); //这里必须await，否则返回的错误是promise
        //console.log('refetch:error is:',err);
        throw err; //这里抛出异常，下面的catch会截获
      }

    }catch(err){
      // 服务端ctx.throw(400)的错误，没有到达这里，而是在上面res.ok=false分支处理
      //console.log('catch in refetch err is:',err)   
      throw(err)  // 截获上面抛出的异常，然后继续抛出

    }
    // return new Promise((resolve, reject) => {
    //   fetch(url, options).then(res => {
    //     if (res.ok) {
    //       return res.json();
    //     } else {
    //       let err=res.text();

    //       //console.log('error is:',err);
    //       reject(err);
    //       // 这里抛出后，前端无法识别，得到的是undefine
    //       // throw new Error(`${res.status}, ${res.statusText}`); //如果要处理服务端异常，这里重新抛出
    //     }
    //   })
    //     .then(json => {
    //       resolve(json);
    //     })
    //     .catch(err => {
    //       //console.log('reject here,err is:',err)
    //       // 这里reject之后，后续如何处理？？
    //       return reject(err);
    //     });
    // });

  }
  // 封装Fetch的options
  // method无所谓,header的头两部分是固定的，唯一header中要增加jwt部分
  // 这个方法需要转换post的body
  // 设计？与auth如何解耦，同时方便？如何保存header不用每次处理？
  // setHeader就好？
  static _getFetchOptions = (method = 'GET', parameter) => {
    let config = {
      method: method,
    };
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (Auth.currentUser) {
      headers = Object.assign({}, headers, { 'Authorization': `Bearer ${Auth.currentUser.token}` })
    }
    config = Object.assign({}, config, { headers }); //这里必须加上{}，否则增加的是headers的内容
    if (parameter) {
      if (method === 'POST')
        config = Object.assign({}, config, { body: JSON.stringify(parameter) });
      // Todo:如果是get，使用route-parser将其转换到url中        
    }
    return config;
  }
}

// 1. 服务端抛出异常的时候，fetch这里不会得到异常，判断的方法是res.ok=false
// 抛出异常的状态码为res.status,文字为res.statusText

// 2. res.json() 注意只执行一次，第二次执行会出错，也不能再执行res.text()之类。
// 意思是将res的数据转换为json，这是获取json响应的唯一方法
