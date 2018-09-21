import { Component } from 'react';
import PropTypes from 'prop-types';

class Assessment extends Component {
  questionSelectChange = (e) => {
    const { gotoQuestion } = this.props;
    const currentQuestion = parseInt(e.target.value, 10);
    gotoQuestion(currentQuestion);
  };

  moveToNext = () => {
    const { currentQuestion, gotoQuestion } = this.props;
    if (!this.isLast()) gotoQuestion(currentQuestion + 1);
  };

  moveToPrev = () => {
    const { currentQuestion, gotoQuestion } = this.props;
    if (!this.isFirst()) gotoQuestion(currentQuestion - 1);
  };

  isLast() {
    const { currentQuestion, questions } = this.props;
    return currentQuestion === questions.length - 1;
  }

  isFirst() {
    const { currentQuestion } = this.props;
    return currentQuestion === 0;
  }
}

Assessment.propTypes = {
  gotoQuestion: PropTypes.func.isRequired,
  questions: PropTypes.array.isRequired,
  currentQuestion: PropTypes.any.isRequired,
};

export default Assessment;
