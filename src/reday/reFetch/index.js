
export default class refetch {
  static get(url, parameter) {
    return this._fetch(url, 'GET', parameter);
  }

  static post(url, parameter) {
    return this._fetch(url, 'POST', parameter);
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

  // add auth config,like this:
  //     if (Auth.currentUser) {
  //  headers = Object.assign({}, headers, { 'Authorization': `Bearer ${Auth.currentUser.token}` })}
  //  config = Object.assign({}, config, { headers }); //这里必须加上{}，否则增加的是headers的内容
  //      let headers = {
  //  'Accept': 'application/json',
  //  'Content-Type': 'application/json'}
  static _getFetchOptions = (method = 'GET',parameter=null, otherConfig=null) => {
    let config = {
      method: method,
    };
    
    // add otherConfig
    if (otherConfig)
      config = Object.assign({}, config, otherConfig);

    // add parameters
    if (parameter) {
      if (method === 'POST')
        config = Object.assign({}, config, { body: JSON.stringify(parameter) });
      // if get，we only need something like '/user/{id}'         
    }
    return config;
  }
}
