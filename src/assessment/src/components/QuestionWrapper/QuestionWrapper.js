import React from 'react';
import PropTypes from 'prop-types';
import { OrderList } from '../OrderList';
import { MultipleChoice } from '../MultipleChoice';
import withAnswerSave from '../HOC/withAnswerSave';

const QuestionWrapper = ({ type, data, ...restProps }) => {
  const questionProps = Object.assign(
    {
      item: data
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
  saveClicked: PropTypes.bool,
  testItem: PropTypes.bool
};

QuestionWrapper.defaultProps = {
  isNew: false,
  type: null,
  data: {},
  saveClicked: false,
  testItem: false
};

export default withAnswerSave(QuestionWrapper);
