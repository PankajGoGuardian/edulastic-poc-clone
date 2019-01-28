import React from 'react';
import {
  shallow
  // mount
} from 'enzyme';

import CorrectAnswers from '../CorrectAnswers';

import configureStore from '../../../../../../configureStore';

// const { store } = configureStore();

describe('<CorrectAnswers />', () => {
  const renderedComponent = shallow(<CorrectAnswers />);
  expect(renderedComponent.length).toEqual(1);
});
