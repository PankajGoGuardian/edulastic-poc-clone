import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MultipleChoiceDisplay from '../Display';

class MultipleChoiceReport extends Component {
  static propTypes = {
    showAnswer: PropTypes.bool,
    checkAnswer: PropTypes.bool,
    userSelections: PropTypes.array,
    handleMultiSelect: PropTypes.func,
    options: PropTypes.array,
    question: PropTypes.string,
    validation: PropTypes.object.isRequired,
  };

  static defaultProps = {
    showAnswer: false,
    checkAnswer: false,
    userSelections: [],
    handleMultiSelect: () => {},
    options: [],
    question: '',
  };

  render() {
    const {
      options,
      question,
      checkAnswer,
      showAnswer,
      userSelections,
      handleMultiSelect,
      validation,
    } = this.props;
    return (
      <div>
        <Container disabled={showAnswer || checkAnswer}>
          <MultipleChoiceDisplay
            options={options}
            question={question}
            userSelections={userSelections}
            onChange={handleMultiSelect}
            validation={validation}
            showAnswer={showAnswer}
            checkAnswer={checkAnswer}
          />
        </Container>
      </div>
    );
  }
}

export default MultipleChoiceReport;

const Container = styled.div`
  pointer-events: ${props => (props.disabled ? 'none' : 'inherit')};
`;
