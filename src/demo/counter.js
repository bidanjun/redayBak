
const intialState=0;
const add=(value)=>(state,props)=>{
  console.log('add:state is ',state,'value is:',value)
  return  state+value
}
const increment=(state,props)=>{
  console.log('exnter increment,state is:',state)
  return state+1
}
export default {intialState,add,increment};