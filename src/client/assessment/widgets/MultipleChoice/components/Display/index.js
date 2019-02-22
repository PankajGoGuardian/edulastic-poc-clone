import React from 'react';
import PropTypes from 'prop-types';

import { QuestionHeader } from '../../../../styled/QuestionHeader';

import Options from './components/Options';

const Display = ({ qIndex, view, smallSize, question, uiStyle, ...restProps }) => (
  <div>
    <QuestionHeader qIndex={qIndex} smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />
    <Options view={view} smallSize={smallSize} question={question} uiStyle={uiStyle} {...restProps} />
  </div>
);

Display.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  showAnswer: PropTypes.bool,
  validation: PropTypes.object,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  question: PropTypes.string.isRequired,
  uiStyle: PropTypes.object
};

Display.defaultProps = {
  options: [],
  onChange: () => {},
  showAnswer: false,
  checkAnswer: false,
  validation: {},
  userSelections: [],
  smallSize: false,
  uiStyle: {
    type: 'standard',
    fontsize: 'normal',
    columns: 1,
    orientation: 'horizontal',
    choice_label: 'number'
  }
};

export default Display;
