//这里使用singleten模式，提供全局唯一的Store
//这样的好处是，可以任意的访问currentUser的属性，即使不在组件内。
let storeObject;
const getStore = () => {
    if (!storeObject)
        storeObject = {
        };
    return storeObject;
}
export default getStore(); //这样直接获得storeObject实例

export const registerToStore=(model,name)=>{
    if (!getStore()[name]) {
        getStore()[name]=model
    }
}

export const removeFromStore=(name)=>{
    if (getStore()[name])
      delete getStore()[name]
}

// app之类顶层组件， provider hoc在mapToState中使用
// 先得到这个，然后再加入其他自定义的状态即可。
export const initStore=(fn)=>{
    let result={};
    Object.keys(getStore()).forEach(function (key) {
        result[key]=getStore()[key].state;
        getStore()[key].setDispatch(fn);
    });
    return result;
}

