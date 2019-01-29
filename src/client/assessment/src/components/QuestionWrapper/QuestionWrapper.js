import React from 'react';
import PropTypes from 'prop-types';
import { questionType } from '@edulastic/constants';
import { OrderList } from '../OrderList';
import { SortList } from '../SortList';
import { MatchList } from '../MatchList';
import { Classification } from '../Classification';
import { MultipleChoice } from '../MultipleChoice';
import { ClozeDragDrop } from '../ClozeDragDrop';
import { ClozeImageDragDrop } from '../ClozeImageDragDrop';
import { ClozeImageDropDown } from '../ClozeImageDropDown';
import { ClozeImageText } from '../ClozeImageText';
import { Graph } from '../Graph';
import { ClozeDropDown } from '../ClozeDropDown';
import { ClozeText } from '../ClozeText';
import { ShortText } from '../ShortText';
import { TokenHighlight } from '../TokenHighlight';
import { Shading } from '../Shading';
import { Hotspot } from '../Hotspot';
import { HighlightImage } from '../HighlightImage';
import { Drawing } from '../Drawing';
import { EssayPlainText } from '../EssayPlainText';
import { EssayRichText } from '../EssayRichText';

import withAnswerSave from '../HOC/withAnswerSave';
import MatrixChoice from '../MatrixChoice/MatrixChoice';
import Protractor from '../Protractor';
import Passage from '../Passage';
import MathFormula from '../MathFormula';
import FormulaEssay from '../FormulaEssay';

const getQuestion = (type) => {
  switch (type) {
    case questionType.DRAWING:
      return Drawing;
    case questionType.HIGHLIGHT_IMAGE:
      return HighlightImage;
    case questionType.SHADING:
      return Shading;
    case questionType.HOTSPOT:
      return Hotspot;
    case questionType.TOKEN_HIGHLIGHT:
      return TokenHighlight;
    case questionType.SHORT_TEXT:
      return ShortText;
    case questionType.ESSAY_PLAIN_TEXT:
      return EssayPlainText;
    case questionType.ESSAY_RICH_TEXT:
      return EssayRichText;
    case questionType.MULTIPLE_CHOICE:
      return MultipleChoice;
    case questionType.CHOICE_MATRIX:
      return MatrixChoice;
    case questionType.SORT_LIST:
      return SortList;
    case questionType.CLASSIFICATION:
      return Classification;
    case questionType.MATCH_LIST:
      return MatchList;
    case questionType.ORDER_LIST:
      return OrderList;
    case questionType.CLOZE_DRAG_DROP:
      return ClozeDragDrop;
    case questionType.CLOZE_IMAGE_DRAG_DROP:
      return ClozeImageDragDrop;
    case questionType.PROTRACTOR:
      return Protractor;
    case questionType.CLOZE_IMAGE_DROP_DOWN:
      return ClozeImageDropDown;
    case questionType.CLOZE_IMAGE_TEXT:
      return ClozeImageText;
    case questionType.CLOZE_DROP_DOWN:
      return ClozeDropDown;
    case questionType.CLOZE_TEXT:
      return ClozeText;
    case questionType.PASSAGE:
      return Passage;
    case questionType.MATH:
      return MathFormula;
    case questionType.FORMULA_ESSAY:
      return FormulaEssay;
    case 'graph':
      return Graph;
    default:
      return null;
  }
};

const QuestionWrapper = ({ type, data, ...restProps }) => {
  const Question = getQuestion(type);
  return <Question item={data} {...restProps} />;
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
