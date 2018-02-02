
const intialState=0;
const add=(value)=>(state,props)=>{
  return  state+value
}
const increment=(state,props)=>{
  return state+1
}
export default {intialState,add,increment};