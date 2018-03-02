
export default class refetch {
  static get(url, parameter) {
    return this._fetch(url, 'GET', parameter);
  }

  static post(url, parameter) {
    return this._fetch(url, 'POST', parameter);
  }

  static defaultHeaders = {};

  // if loggin,should add header here
  static addDefaultHeaders = (otherOptions) => {
    refetch.defaultHeaders = Object.assign({}, refetch.defaultHeaders, otherOptions);
  }

  // if logout,should reset header here
  static resetDefaultHeaders = (otherOptions) => {
    refetch.defaultHeaders = {};
  }

  static async _fetch(url, method = 'GET', parameter = null, otherConfig = null) {
    let options = refetch._getFetchOptions(method, parameter, otherConfig = null);
    try {
      let res = await fetch(url, options);
      if (res.ok) {
        return res.json();
      } else {
        let err = await res.text(); //这里必须await，否则返回的错误是promise
        throw err; //这里抛出异常，下面的catch会截获
      }

    } catch (err) {
      // error from ctx.throw(400) will catch in res.ok=false branch
      //console.log('catch in refetch err is:',err)   
      throw (err)
    }
  }

  static _getFetchOptions = (method = 'GET', parameter) => {
    let config = {
      method: method,
    };
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    headers = Object.assign({}, headers, refetch.defaultHeaders)
    config = Object.assign({}, config, { headers });
    if (parameter) {
      if (method === 'POST')
        config = Object.assign({}, config, { body: JSON.stringify(parameter) });
    }
    return config;
  }
}
