import React from 'react';
import PropTypes from 'prop-types';
import { OrderList } from '../OrderList';
import { MultipleChoice } from '../MultipleChoice';
import { ClozeDragDrop } from '../ClozeDragDrop';
import { ClozeImageDragDrop } from '../ClozeImageDragDrop';
import withAnswerSave from '../HOC/withAnswerSave';

const QuestionWrapper = ({ type, data, ...restProps }) => {
  const questionProps = Object.assign(
    {
      item: data,
    },
    restProps,
  );

  let Question;
  switch (type) {
    case 'multipleChoice': {
      Question = MultipleChoice;
      break;
    }
    case 'orderList': {
      Question = OrderList;
      break;
    }
    case 'clozeDragDrop': {
      Question = ClozeDragDrop;
      break;
    }
    case 'clozeImageDragDrop': {
      Question = ClozeImageDragDrop;
      break;
    }
    default:
  }
  return <Question {...questionProps} />;
};

QuestionWrapper.propTypes = {
  type: PropTypes.any,
  view: PropTypes.string.isRequired,
  isNew: PropTypes.bool,
  data: PropTypes.object,
  saveClicked: PropTypes.bool,
  testItem: PropTypes.bool,
};

QuestionWrapper.defaultProps = {
  isNew: false,
  type: null,
  data: {},
  saveClicked: false,
  testItem: false,
};

export default React.memo(withAnswerSave(QuestionWrapper));
