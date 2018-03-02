import React from 'react';
//import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import {makeState,store } from './'
import counterModel from '../examples/reday-counter/counter.state';

// if use Enzyme
// import Enzyme, { mount } from 'enzyme'
// import serializer from 'enzyme-to-json/serializer'
// import Adapter from 'enzyme-adapter-react-16'

// Enzyme.configure({ adapter: new Adapter() })
// expect.addSnapshotSerializer(serializer)

const counter=new counterModel();


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

Counter =makeState('Counter', store,null,{counter})(Counter);

it('makeState should renders a snapshot', () => {
  const comp = renderer.create(<Counter />);
  expect(comp.toJSON()).toMatchSnapshot();
});

it('when state incement twice,counter should renders 2', () => {
  const comp = renderer.create(<Counter />);
  store.Counter.counter.setState(store.Counter.counter.increment)
  store.Counter.counter.setState(store.Counter.counter.increment)
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

