import React from 'react';
import { shallow } from 'enzyme';

import TestList from '../TestList';

describe('<TestList />', () => {
  it('should render properly', () => {
    const renderedComponent = shallow(<TestList />);
    expect(renderedComponent.length).toEqual(1);
  });
});
