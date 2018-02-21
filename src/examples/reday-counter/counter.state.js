
const initialState=(state,props)=>{
  console.log('initialState,state=',state)
  return 0;
}
const add=(value)=>(state,props)=>{
  return  state+value
}
const increment=(state,props)=>{
  return state+1
}
const decrement=(state,props)=>{
  return state-1
}
export const counter= {initialState,add,increment,decrement};