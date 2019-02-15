import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';

import { questionType } from '@edulastic/constants';

import { themes } from '../themes';

import { OrderList } from '../widgets/OrderList';
import { SortList } from '../widgets/SortList';
import { MatchList } from '../widgets/MatchList';
import { Classification } from '../widgets/Classification';
import { MultipleChoice } from '../widgets/MultipleChoice';
import { ClozeDragDrop } from '../widgets/ClozeDragDrop';
import { ClozeImageDragDrop } from '../widgets/ClozeImageDragDrop';
import { ClozeImageDropDown } from '../widgets/ClozeImageDropDown';
import { ClozeImageText } from '../widgets/ClozeImageText';
import { Graph } from './Graph';
import { ClozeDropDown } from '../widgets/ClozeDropDown';
import { ClozeText } from '../widgets/ClozeText';
import { ShortText } from '../widgets/ShortText';
import { TokenHighlight } from '../widgets/TokenHighlight';
import { Shading } from '../widgets/Shading';
import { Hotspot } from '../widgets/Hotspot';
import { HighlightImage } from '../widgets/HighlightImage';
import { Drawing } from './Drawing';
import { EssayPlainText } from '../widgets/EssayPlainText';
import { EssayRichText } from '../widgets/EssayRichText';

import withAnswerSave from './HOC/withAnswerSave';
import { MatrixChoice } from '../widgets/MatrixChoice';
import { Protractor } from '../widgets/Protractor';
import { Passage } from '../widgets/Passage';
import { MathFormula } from '../widgets/MathFormula';
import { FormulaEssay } from '../widgets/FormulaEssay';
import FeedbackBottom from './FeedbackBottom';
import FeedbackRight from './FeedbackRight';

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
const QuestionWrapper = ({ type, data, showFeedback, multiple, ...restProps }) => {
  const Question = getQuestion(type);
  return (
    <ThemeProvider theme={themes.default}>
      <Fragment>
        <div style={{ flex: 'auto' }}>
          <Question item={data} {...restProps} />
        </div>
        {showFeedback && (
          multiple ?
            <FeedbackBottom widget={data} /> :
            <FeedbackRight widget={data} />
        )}
      </Fragment>
    </ThemeProvider>
  );
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
