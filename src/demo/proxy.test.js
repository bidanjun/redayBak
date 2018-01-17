
describe('object', () => {
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
});