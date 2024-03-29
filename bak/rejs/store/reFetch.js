
import auth from '../auth';

export default class refetch {

  static get(url, parameter) {
    return this._fetch(url, 'GET', parameter);
  }

  static post(url, parameter) {
    return this._fetch(url, 'POST', parameter);
  }

  static _fetch(url, method, parameter) {

    //!!!问题：静态函数的this.  与实例有关吗？使用是正确的，但概念还不清晰
    ///let options = this._getFetchOptions(method, parameter);

    let options = refetch._getFetchOptions(method, parameter);
    // 返回的是一个Promise
    // 事实上new Promise不需要，因为fetch本身返回的也是promise
    return new Promise((resolve, reject) => {
      fetch(url, options).then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`${res.status}, ${res.statusText}`); //如果要处理服务端异常，这里重新抛出
        }
      })
        .then(json => {
          resolve(json);
        })
        .catch(err => {
          //console.log('reject here,err is:',err)
          reject(err);
        });
    });

  }
  // 封装Fetch的options
  static _getFetchOptions = (method = 'GET', parameter) => {
    let config = {
      method: method,
    };
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (auth.currentUser) {
      headers = Object.assign({}, headers, { 'Authorization': `Bearer ${auth.currentUser.token}` })
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
