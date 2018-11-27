import React from 'react';
import PropTypes from 'prop-types';
import { OrderList } from '../OrderList';
import { SortList } from '../SortList';
import { MatchList } from '../MatchList';
import { Classification } from '../Classification';
import { MultipleChoice } from '../MultipleChoice';
import { ClozeDragDrop } from '../ClozeDragDrop';
import { ClozeImageDragDrop } from '../ClozeImageDragDrop';
import { ClozeDropDown } from '../ClozeDropDown';
import { ClozeText } from '../ClozeText';

import withAnswerSave from '../HOC/withAnswerSave';
import MatrixChoice from '../MatrixChoice/MatrixChoice';

const getQuestion = (type) => {
  switch (type) {
    case 'multipleChoice':
      return MultipleChoice;
    case 'choiceMatrix':
      return MatrixChoice;
    case 'sortList':
      return SortList;
    case 'classification':
      return Classification;
    case 'matchList':
      return MatchList;
    case 'orderList':
      return OrderList;
    case 'clozeDragDrop':
      return ClozeDragDrop;
    case 'clozeImageDragDrop':
      return ClozeImageDragDrop;
    case 'clozeDropDown':
      return ClozeDropDown;
    case 'clozeText':
      return ClozeText;
    default:
      return null;
  }
};

const QuestionWrapper = ({ type, data, ...restProps }) => {
  const questionProps = Object.assign(
    {
      item: data
    },
    restProps
  );
  const Question = getQuestion(type);
  return <Question {...questionProps} />;
};

QuestionWrapper.propTypes = {
  type: PropTypes.any,
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

export default React.memo(withAnswerSave(QuestionWrapper));
