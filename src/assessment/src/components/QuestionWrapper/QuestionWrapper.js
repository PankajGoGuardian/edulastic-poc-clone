import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { OrderList } from '../OrderList';
import { MultipleChoice } from '../MultipleChoice';

import { addAnswer } from '../../actions/questions';

const QuestionWrapper = ({ type, data, ...restProps }) => {
  let questionProps = Object.assign(
    {
      item: data,
      smallSize: data.smallSize
    },
    restProps
  );

  const Question = type === 'multipleChoice' ? MultipleChoice : OrderList;
  return <Question {...questionProps} />;
};

QuestionWrapper.propTypes = {
  type: PropTypes.oneOf(['orderList', 'multipleChoice', 'image']),
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
