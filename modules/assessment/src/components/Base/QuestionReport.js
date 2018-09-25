/* eslint-disable */
import { Component } from 'react';

import { QUESTION_PROBLEM, QUESTION_OPTIONS, QUESTION_ANSWERS } from '../../constants/others';

class QuestionReport extends Component {
  // - initialize(questionData)
  initialize(questionData) {}

  getResponse() {
    const problem = localStorage.getItem(QUESTION_PROBLEM);
    const options = localStorage.getItem(QUESTION_OPTIONS);
    const answers = localStorage.getItem(QUESTION_ANSWERS);

    return {
      question: problem,
      options: JSON.parse(options),
      answers: JSON.parse(answers),
    };
  }
}

export default QuestionReport;
