import React, { Component } from 'react';
import PropTypes from 'prop-types';

import QuestionHeader from '../common/QuestionHeader';
import Options from './Options';

const MultipleChoiceDisplay = props => (
  <div>
    <QuestionHeader smallSize={props.smallSize}>
      {props.question}
    </QuestionHeader>
    <Options {...props} />
  </div>
);

MultipleChoiceDisplay.propTypes = {
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

MultipleChoiceDisplay.defaultProps = {
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
    orientation: 'horizontal'
  }
};

export default React.memo(MultipleChoiceDisplay);
