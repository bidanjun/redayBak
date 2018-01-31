

const actionWithField=(field)=>(action)=>(state,props)=>{
  if (!!field)
    return ({ [field]: { ...state[field], ...action(state[field], props)}})
  else
    return {...action(state, props)}
}

export class model {
  // 继承的时候，必须覆盖
  static get initialState() {
    return null;
  }
  fieldName=null;
  component=null; //组件，构建状态的时候，需要这里的initialState  
  setState=(action)=>(this.component.setState(actionWithField(this.fieldName)(action))) //这里这么处理
 
  constructor(fieldName=null) {
    this.fieldName=fieldName;
  }
  

  // 继承之后只需要写相应的action

}

//makeStore(stateName,storeObject,...models)//若字段形式，其实不需要stateName，直接将这些字段放置在state里
//比如state.user,state.router等
//组件同时通过models.user,models.router来访问? 或者直接组件.user之类访问?

export const makeStore=(storeObject,...models)=>{

}