import { Component } from 'react';
import { QUESTION_PROBLEM, QUESTION_OPTIONS } from '../../../constants/others';
class QuestionDisplay extends Component {
  // - initialize(questionData)
  initialize(questionData) {

  }

  // - getResponse(): get the student response JSON
  getResponse() {
    const problem = localStorage.getItem(QUESTION_PROBLEM);
    const options = localStorage.getItem(QUESTION_OPTIONS);
    return {
      question: problem,
      options: JSON.parse(options)
    };
  }
};

export default QuestionDisplay;
