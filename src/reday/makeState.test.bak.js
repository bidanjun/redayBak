import React from 'react';
//import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import {makeState,store } from './'

// import Enzyme, { mount } from 'enzyme'
// import serializer from 'enzyme-to-json/serializer'
// import Adapter from 'enzyme-adapter-react-16'



// Enzyme.configure({ adapter: new Adapter() })
// expect.addSnapshotSerializer(serializer)

const increment = state => ({ counter: state.counter + 1 })

let Counter=({counter,increment}) => {
  increment = () => {
    store.Counter.setState(increment)
  }
  return (
      <span>
        Value: {counter}
        <button onClick={increment}>+</button>
      </span>
    );
}

Counter =makeState({ counter: 0 }, 'Counter', store)(Counter);

it('makeState should renders a snapshot', () => {
  const comp = renderer.create(<Counter />);
  expect(comp.toJSON()).toMatchSnapshot();
});

it('when state incement twice,counter should renders 2', () => {
  const comp = renderer.create(<Counter />);
  store.Counter.setState(increment)
  store.Counter.setState(increment)
  expect(comp.toJSON()).toMatchSnapshot();
});

// const increment = state => ({ counter: state.counter + 1 })
// test('state should be update when click', () => {
//   const comp = makeState({ counter: 0 }, 'Counter', store)(
//     () => (      
//       <button onClick={() => store.Counter.setState(increment)}>{store.Counter.counter}</button>
//     )
//   )
//   const wrapper = mount(<comp />)
 
//   expect(wrapper).toMatchSnapshot(`before click ,counter=0,result is:`)
//   wrapper.find('comp').simulate('click')
//   expect(wrapper).toMatchSnapshot(`after click,counter=1,result is:`)
// })

// 这里简单的使用Counter类，静态函数保存action、initialState、defaultId，动态的保留comp和id,为comp创建与id相同的代理

class counter {
  static initialState=0
  static defualtId='counter'
  
  component=null;
  id=counter.defualtId;

  constructor(comp=null,id=defaultId) {
    this.component=comp
    this.id=id
  }
  setComp(comp,id) {
    //为comp增加同名的代理，处理counter.increment之类
  }

  static increment=(state)=>state+1
  static add=(num)=>(state)=>state+num

}

counter=new Counter()
leftCounter = new Counter()
//makeState({counter,leftCounter}) //状态中包括counter和leftCounter两个字段，同时包括counnter和leftCounter两个代理
// 使用initialState创建组件状态
// 使用counter

//counter.add(1)等同于:counter.comp.setState(counter.add(1))并处理id

//对于store.app，包括
// counter,leftCounter等组件，这些组件持有状态
// store.app作为组件本身，包括counter,leftCounter等model的代理，这些代理可以执行setState并处理id

// class model = {
//   static initialState=null;
//   static initialFieldId=null;
  
//   id=null;
//   comp=null;
//   setComp(comp,id) //这里同时处理id

// }
//继承自model
//增加static