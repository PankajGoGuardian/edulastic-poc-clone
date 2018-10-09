import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { OrderList } from '../OrderList';
import { MultipleChoice } from '../MultipleChoice';

const QuestionWrapper = ({ type, data, ...restProps }) => {
  let questionProps = Object.assign(
    {
      item: data,
      smallSize: data.smallSize
    },
    restProps
  );

  const Question = type === 'mcq' ? MultipleChoice : OrderList;
  return <Question {...questionProps} />;
};

QuestionWrapper.propTypes = {
  type: PropTypes.oneOf(['orderList', 'mcq', 'image']),
  view: PropTypes.string.isRequired,
  isNew: PropTypes.bool,
  data: PropTypes.object,
  saveClicked: PropTypes.bool
};

QuestionWrapper.defaultProps = {
  isNew: false,
  type: null,
  data: {},
  saveClicked: false
};

export default QuestionWrapper;
