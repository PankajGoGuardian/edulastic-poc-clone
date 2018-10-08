import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import QuestionReport from '../../Base/QuestionReport';
import MultipleChoiceEvaluation from '../Evaluation';
import MultipleChoiceDisplay from '../Display';

class MultipleChoiceReport extends QuestionReport {
  static propTypes = {
    showAnswer: PropTypes.bool,
    checkAnswer: PropTypes.bool,
    userSelections: PropTypes.array,
    handleMultiSelect: PropTypes.func,
    options: PropTypes.array.isRequired,
    question: PropTypes.string.isRequired,
  };

  static defaultProps = {
    showAnswer: false,
    checkAnswer: false,
    userSelections: [],
    handleMultiSelect: () => {},
    options: [],
    question: '',
  }

  state = {
    question: '',
    options: [],
    answers: [],
  };

  componentDidMount() {
    const { userSelections, showAnswer, options } = this.props;
    let answers = [];
    if (showAnswer) {
      const correctanswers = this.evaluationCmp.getCorrectAnswers();
      answers = this.getStateAnswersFromData(options, correctanswers);
    } else {
      answers = this.evaluationCmp.evaluateResponse(userSelections);
    }
    console.log('userSelections:', userSelections, answers);

    this.setState({ answers });
  }

  getStateAnswersFromData = (options, answers) => {
    const { valid_response } = answers;
    const stateAnswers = Array(options.length).fill(false);
    valid_response.value.forEach((item) => {
      stateAnswers[item] = true;
    });
    return stateAnswers;
  }

  render() {
    const { answers } = this.state;
    const { options, question, checkAnswer, showAnswer, userSelections, handleMultiSelect } = this.props;
    return (
      <MultipleChoiceEvaluation onRef={(ref) => { this.evaluationCmp = ref; }}>
        <Container disabled={showAnswer || checkAnswer}>
          <MultipleChoiceDisplay
            options={options}
            question={question}
            userSelections={userSelections}
            onChange={handleMultiSelect}
            answers={answers}
            showAnswer={showAnswer}
            checkAnswer={checkAnswer}
          />
        </Container>
      </MultipleChoiceEvaluation>
    );
  }
}

export default MultipleChoiceReport;

const Container = styled.div`
  pointer-events: ${props => (props.disabled ? 'none' : 'inherit')};
`;
