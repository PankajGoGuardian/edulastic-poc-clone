import React, { Component } from 'react';
import PropTypes from 'prop-types';

import QuestionHeader from '../common/QuestionHeader';
import Options from './Options';

class MultipleChoiceDisplay extends Component {
  render() {
    const {
      showAnswer,
      checkAnswer,
      userSelections,
      smallSize,
      onChange,
      options,
      validation,
      question,
      uiStyle,
      evaluation
    } = this.props;

    return (
      <div>
        <QuestionHeader smallSize={smallSize}>{question}</QuestionHeader>
        <Options
          smallSize={smallSize}
          addAnswer={this.selectAnswer}
          options={options}
          showAnswer={showAnswer}
          checkAnswer={checkAnswer}
          userSelections={userSelections}
          validation={validation}
          onChange={onChange}
          uiStyle={uiStyle}
          evaluation={evaluation}
        />
      </div>
    );
  }
}

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

export default MultipleChoiceDisplay;
