
const actionWithField=(fieldId)=>(action)=>(state,props)=>{
  if (!!fieldId)
    return ({ [fieldId]: action(state[fieldId], props)}) 
  else
    return action(state, props)
}

export default class Model {

    initialState = {};
    fieldId = null;    

    component=null;
    setState=null;
   
    constructor(initialState = {},fieldId=null) {
      this.fieldId = fieldId; 
      this.initialState = initialState;
    }

    bindToComponent=(comp)=>{
      this.component=comp;
    }

    setState=(action)=>{
      if (!!this.fieldId) {
        this.component.setState(actionWithField(this.fieldId)(action))
      }
      else this.component.setState(action)
    }
  }
  
  // simplely create a model with initialState and fieldId
  export function createModel(initialState={},fieldId=null) {
      class model extends Model {
          constructor(){
              super(initialState,fieldId)
          }
      }
      return new model();
  }




  