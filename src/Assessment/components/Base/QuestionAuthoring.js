import { Component } from 'react';

import { QUESTION_PROBLEM, QUESTION_OPTIONS, QUESTION_ANSWERS } from '../../../constants/others';
class QuestionAuthoring extends Component {
  edited = false;
  // - initialize(data): initialize with JSON data
  initialize(data) {
    let {question = '', options = [], answers = []} = data;

    localStorage.setItem(QUESTION_PROBLEM, question);
    localStorage.setItem(QUESTION_OPTIONS, JSON.stringify(options));
    localStorage.setItem(QUESTION_ANSWERS, JSON.stringify(answers));
  }

  setData(data) {
    const {question, options, answers} = data;
    if (question) localStorage.setItem(QUESTION_PROBLEM, question);
    if (options) localStorage.setItem(QUESTION_OPTIONS, JSON.stringify(options));
    if (answers) localStorage.setItem(QUESTION_ANSWERS, JSON.stringify(answers));
  }
  // - getData(): returns the question and correct answer JSON in one object
  getData() {
    const problem = localStorage.getItem(QUESTION_PROBLEM);
    const options = localStorage.getItem(QUESTION_OPTIONS);
    const answers = localStorage.getItem(QUESTION_ANSWERS);
    return {
      question: {
        stimulus: problem,
        options: JSON.parse(options)
      },
      answers: JSON.parse(answers)
    }
  }
  // - getQuestion(): returns only the question JSON
  getQuestion() {
    const problem = localStorage.getItem(QUESTION_PROBLEM);
    const options = localStorage.getItem(QUESTION_OPTIONS);
    return {
      question: {
        stimulus: problem,
        options: JSON.parse(options)
      }
    };
  }
  // - getCorrectAnswer(): returns only the correct answer JSON
  getCorrectAnswer() {
    const answers = localStorage.getItem(QUESTION_ANSWERS);
    return JSON.parse(answers);
  }
  // - hasChanged(): boolean to indicate whether the content has been edited
  hasChanged() {
    return this.edited;
  }
  // - setChanged(state): set it to false after a save etc.
  setChanged(state) {

  }
  // - clear(): clear everything and set to defaults
  clear() {
    localStorage.removeItem(QUESTION_PROBLEM);
    localStorage.removeItem(QUESTION_ANSWERS);
    localStorage.removeItem(QUESTION_OPTIONS);
  }
  // - undo(): undo the last change
  undo() {

  }
  // - redo(): redo the last change
  redo() {

  }
};

export default QuestionAuthoring;
