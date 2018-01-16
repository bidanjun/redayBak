
// from here:
// https://github.com/opudalo/cookie/blob/master/src/index.js

export default class cookie {
  static check(name) {
    return document.cookie.indexOf(`${this._encode(name)}=`) !== -1 
  }

  static set(name, value, options = {}) {
    var str = `${this._encode(name)}=${this._encode(value)}`
    if (value == null) options.maxage = -1
    if (options.maxage) {
      options.expires = new Date(+new Date() + options.maxage)
    }

    if (options.path) str += '; path=' + options.path
    if (options.domain) str += '; domain=' + options.domain
    if (options.expires) str += '; expires=' + options.expires.toUTCString()
    else {
      // 默认设置1年过期..如果没有显式的指定
      var d = new Date();
      d.setTime(d.getTime() + 365*24*60*1000); // in milliseconds
      str += '; expires=' + d.toUTCString()
    }
    if (options.secure) str += '; secure'
    document.cookie = str
  }

  static setJson(name, value, options = {}) {
    let obj = JSON.stringify(value); 
    this.set(name,obj,options);
  }

  static get(name) {
    var cookies = this._parse(document.cookie)
    return !!name ? cookies[name] : cookies
  }

  static getJson(name) {
    let result=this.get(name);
    return JSON.parse(result);
  }

  static remove(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=this.get(name);
    if(cval!=null)
      this.set(name,cval,{expires:exp})
  }

  //private 
  static _parse(str) {
    var obj = {},
      pairs = str.split(/ *; */)

    if (!pairs[0]) return obj

    for (let pair of pairs) {
      pair = pair.split('=')
      obj[this._decode(pair[0])] = this._decode(pair[1])
    }
    return obj
  }

  static _encode(value) {
    try {
      return encodeURIComponent(value);
    } catch (e) {
      return null
    }
  }

  static _decode(value) {
    try {
      return decodeURIComponent(value);
    } catch (e) {
      return null
    }
  }
}