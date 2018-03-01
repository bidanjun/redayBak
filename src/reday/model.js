
// 问题：缓存state，多次变更后一次setState
// temp=action(this.comp.state,this.comp.props)
// setState(()=>temp)

const actionWithField=(fieldId)=>(action)=>(state,props)=>{
  if (!!fieldId)
    return ({ [fieldId]: { ...state[fieldId], ...action(state[fieldId], props)}})
  else
    return {...action(state, props)}
}
// initialState // 初始状态
// initialAction不需要，这是创建组件的时候提供的，didmounted中一次性的执行
// fieldId 在组件状态中的字段名，如果为null，则状态中无字段
// comp 连接的组件
// action:所有的(state,props)=>格式的改变状态的函数
// 可以继承model，然后增加其它业务逻辑
// action不用自动生成代理，model.setState(函数名) 调用component的setState

export default class Model {

    // 构造函数中执行
    initialState = {};
    fieldId = null;    
    initialAction = null;

    // 连接到组件的时候执行
    component=null;
    setState=null;

    //action可以是本类静态的函数
    //不希望import Model的话，则在这里提供model的类名
    //继承的时候，initialState
    // 另外，实际创建组件的时候，fieldId可以直接使用model的名称，但这只能是一种简化写法
    // 比如 makeStore(app,counter,leftCounter),这里自动的将counter的state加上counter字段名。但这种方式却无法处理
    // 直接使用initialState的
    // 因此makeStore(initialState,initialModels)这样，提供两个选择，即需要命名的放在第二个，不需要字段名的放在前面
    // 比如 ({counter},{leftCounter,rightCounter})这样处理，前者直接的合并到state，后者则加上字段名
    // 但由于model的每项都有id....需要如此吗？
    // ({counter,leftCounter,rightCount})? 实际上不需要
    
    //结论，一个initialState就好，直接定义不需要字段的、不用model的初始状态
    // 一个initialModels，则由每个model自行定义fieldId
    
    constructor(initialState = {},fieldId=null) {
      this.fieldId = fieldId; //存放到Store的名称
      this.initialState = initialState;
    }

    bindToComponent=(comp)=>{
      this.component=comp;
      this.setState = comp.setState;
    }

    //这里调用组件的setState,但处理fieldId问题
    //model自带fieldId，则无需利用model的变量名,也无需提供代理
    setState=(action)=>(this.component.setState(actionWithField(this.fieldId)(action))) //这里这么处理

  }
  
  // 快速创建一个model,这里没有定制的业务逻辑，仅仅用setState(action)处理状态变更
  export function createModel(initialState={},fieldId=null,initialAction=null) {
      class model extends Model {
          constructor(){
              super(initialState,fieldId,initialAction)
          }
      }
      return new model();
  }

  //makeState，包括一个initialState和一个initialModel
  //将创建一个组件，承载state
  //多数情况下，我们简单的使用一个initialState
  //组件的指针将放置在store.组件名称里面，比如store.user
  //store是一个简单的{},也可以创建新的Store已隔离不同层次的状态集合


  