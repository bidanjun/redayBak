
## what's reday
redux is so bad,so I made reday to manage state of react app. yes, it's very simple,and could do anything that redux can do,without so manay duplicated code that redux made.and the core of reday only have two small files,it's based on the state of react itself,small that mean it could runing  stability,if there's bug here,it should belong to react itself,please report to facebook anyway.

## you only need to know makeState and useState

    import {store,makeState,useState} from 'reday'
    
    // if you had a component named Counter,here is state by reday
    export default makeState({counter:0},'Counter')(Counter)
    yes,store.Counter is a getter of this component state,and store.Counter.setState is the setState of this component

    //if you want use the state in the component tree    
    const increment=(state, props) => ({counter: state.counter + 1})
    export default useState(
        (props)=>({
            counter:store.Counter.counter,
            handleIncrease:store.Counter.setState(increment)
        })(Counter)
    )

    //if you want makeState and use it,that's it
    export default compose(  
      makeState({counter:0},'Counter',store),
      useState(()=>({
        counter:store.Counter.counter,
        handleIncrement:()=>store.Counter.setState(increment)
    })),
    )(Counter)

## more clearly Flux: state+action=>state
  use redux,you must write too many code,and a bundle of concept,such as reducer,dispather,action,action type...yes,they tell us a framework named Flux.  

  but,state+action=>state is so simple,why made those things that we don't need? state is the state of react Component,we using functional setState by react itself,action is pure function like:
    const increment=(state, props) => ({counter: state.counter + 1})
  
  we saved all state and setState of component default in store,store.Counter.setState(increment),could change the state of parent or grandparent component.
  no dispatcher  
  no action type and action name,just a function as action  
  no reducer here  
  no need createStore ,store is only an object like {}  
  no need Provider,you just import {store},then could access state in the component tree,Flux now only  
  for:state+action=>state  
  


