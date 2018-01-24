
export default class refetch {
  static get(url, parameter) {
    return this._fetch(url, 'GET', parameter);
  }

  static post(url, parameter) {
    return this._fetch(url, 'POST', parameter);
  }

  static defaultHeaders = {};

  // if loggin,should add header here
  static addDefaultHeaders = (otherOptions)=>{
   refetch.defaultHeaders=  Object.assign({}, refetch.defaultHeaders, otherOptions);
  }

  // if logout,should reset header here
  static resetDefaultHeaders = (otherOptions)=>{
    refetch.defaultHeaders=  {};
   }

  static async _fetch(url, method='GET', parameter=null, otherConfig=null) {
    let options = refetch._getFetchOptions(method, parameter,otherConfig=null);
    try {
      let res=await fetch(url, options);
      if (res.ok) {
        return res.json();
      } else {
        let err=await res.text(); //这里必须await，否则返回的错误是promise
        throw err; //这里抛出异常，下面的catch会截获
      }

    }catch(err){
      // 服务端ctx.throw(400)的错误，没有到达这里，而是在上面res.ok=false分支处理
      //console.log('catch in refetch err is:',err)   
      throw(err)  // 截获上面抛出的异常，然后继续抛出
    }
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
    headers = Object.assign({}, headers, refetch.defaultHeaders)
    config = Object.assign({}, config, { headers }); //这里必须加上{}，否则增加的是headers的内容
    if (parameter) {
      if (method === 'POST')
        config = Object.assign({}, config, { body: JSON.stringify(parameter) });
      // Todo:如果是get，使用route-parser将其转换到url中        
    }
    return config;
  }
}
