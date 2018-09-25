import PropTypes from 'prop-types';
import React from 'react';

import Container from './components/Container';
import QuestionReport from '../Base/QuestionReport';
import MultipleChoiceEvaluation from './Evaluation';
import QuestionWrapper from '../QuestionWrapper';

class MultipleChoiceReport extends QuestionReport {
  state = {
    question: '',
    options: [],
    answers: [],
  };

  componentDidMount() {
    const { options, question } = this.getResponse();
    const { userSelections } = this.props;
    const checkResult = MultipleChoiceEvaluation.evaluateResponse(userSelections);
    this.setState({ options, question, answers: checkResult });
  }

  render() {
    const { options, question, answers } = this.state;
    const { showAnswer, userSelections, handleMultiSelect } = this.props;
    return (
      <Container disabled={showAnswer}>
        <QuestionWrapper
          type="mcq"
          options={options}
          question={question}
          userSelections={userSelections}
          onChange={handleMultiSelect}
          answers={answers}
          showAnswer={showAnswer}
        />
      </Container>
    );
  }
}

MultipleChoiceReport.propTypes = {
  showAnswer: PropTypes.bool,
  handleMultiSelect: PropTypes.func,
};

export default MultipleChoiceReport;
