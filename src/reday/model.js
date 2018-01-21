// model 提供initial state
// 每个实例均保存一个state，包括withId为true/false的情况，据此提供setState((state,props)=>)
// 同时保存一些参数，与实例有关或无关
// 这里要注意：构建整体全局状态的时候，需要使用getter
// makeState后，该状态需要关联各个model的，具体将state指针传递给model
// model在有了state指针后，即可执行setState((state,props)=>)
// 同时由于有了model的实例导出，只要引用Store即可。。状态直接将对象放到store?

// 创建复合状态的时候，从getter函数获取初始状态，并将state赋予实例

// 提供store、state、field名称
// 对于state名称者无所谓
// 对于field名称者提供action的简化写法
// model可以有多个实例
// model可以连接state
// model可提供多个函数，可以是静态函数
import {store} from './'
//model基类，作为状态和action之间的桥梁
class model {
  constructor(stateName,fieldName=null,storeObject=store){
    
  }
  
  // 需要静态
  static get initialState() {
    return null;
  }

  //将实例与状态绑定
  registerState(state) {
    this.state=state;
  }



  
}