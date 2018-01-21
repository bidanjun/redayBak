import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';


import { shallow, mount } from 'enzyme';

import { Auth } from './index';


// //这里的测试有问题
// //Auth目前不是组件，而是Model

// describe('Auth', () => {
//   Enzyme.configure({ adapter: new Adapter() });
//   let MockComponent;
//   beforeEach(() => {
//     MockComponent = () => <div />;
//     MockComponent.displayName = 'MockComponent';
//   });

//   it('renders its children when authenticated', () => {
//     const wrapper = shallow(
//       <Auth
//         composedComponent={MockComponent}
//         authenticated={true}
//       />,
//       { context: { router: { push: jest.fn() } } }
//     );
//     expect(wrapper.find('MockComponent').length).toEqual(1);
//   });

//   it('renders null when not authenticated', () => {
//     const wrapper = shallow(
//       <Auth
//         composedComponent={MockComponent}
//         authenticated={false}
//       />,
//       { context: { router: { push: jest.fn() } } }
//     );
//     expect(wrapper.find('MockComponent').length).toEqual(0);
//   });

// });

