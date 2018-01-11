import React from 'react'
import Enzyme, { mount } from 'enzyme'
import serializer from 'enzyme-to-json/serializer'
import Adapter from 'enzyme-adapter-react-16'

import makeState, { store } from './makeState'

Enzyme.configure({ adapter: new Adapter() })
expect.addSnapshotSerializer(serializer)

const increment = state => ({ counter: state.counter + 1 })
test('state should be update when click', () => {
  const wrapper = mount(
    <div>
    {makeState({ counter: 0 }, 'Counter', store)(
      () => (
        <button onClick={() => store.Counter.setState(increment)}>{store.Counter.counter}</button>
      )
    )}
    </div>
  )
  expect(wrapper).toMatchSnapshot(`counte=0`)
  wrapper.find('button').simulate('click')
  expect(wrapper).toMatchSnapshot(`after click,counter=1`)
})