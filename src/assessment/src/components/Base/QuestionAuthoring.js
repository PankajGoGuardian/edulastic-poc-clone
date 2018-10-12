/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  getStimulusSelector,
  getQuestionsListSelector,
  getValidationSelector,
  validationSelector,
} from '../../selectors/questionCommon';
import {
  updateStimulusAction,
  updateQuestionsListAction,
  updateValidationAction,
  clearQuestionsAction,
} from '../../actions/questionCommon';
import { setQuestionDataAction } from '../../../../author/src/actions/question';
import { getQuestionSelector } from '../../../../author/src/selectors/question';

class QuestionAuthoring extends Component {
  edited = false;

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }

  // - initialize(data): initialize with JSON data
  initializeData = data => {
    const { updateStimulus, updateQuestionsList, updateValidation, question } = this.props;
    const { validationQuestion, validationOptions, validationAnswers } = this.validateData(data);
    updateStimulus(validationQuestion);
    updateQuestionsList(validationOptions);
    updateValidation(validationAnswers);
    this.setData(question.data);
  };

  initialize = () => {
    const { clearQuestions } = this.props;
    clearQuestions();
  };

  validateData(data) {
    const { question, options, answers } = data;

    console.log('validate data:', question, options, answers);

    let validationQuestion = question;
    let validationAnswers = answers;
    let validationOptions = options;
    if (question === null) {
      validationQuestion = '';
    }
    if (options === null) {
      validationOptions = [];
    }
    if (validationAnswers === {} || validationAnswers === null) {
      validationAnswers = {
        valid_response: {
          score: 1,
          value: [],
        },
        alt_responses: [],
      };
    }
    return {
      validationQuestion,
      validationOptions,
      validationAnswers,
    };
  }

  setData = data => {
    const {
      updateStimulus,
      updateQuestionsList,
      updateValidation,
      question,
      setQuestionData,
    } = this.props;
    setQuestionData({ ...question.data, stimulus: data.question });
    const { validationQuestion, validationOptions, validationAnswers } = this.validateData(data);
    if (validationQuestion !== undefined) updateStimulus(validationQuestion);
    if (validationOptions !== undefined) updateQuestionsList(validationOptions);
    if (validationAnswers !== undefined) updateValidation(validationAnswers);
  };

  // - getData(): returns the question and correct answer JSON in one object
  getData = () => {
    const { stimulus, questionsList, validation } = this.props;
    return {
      question: stimulus,
      options: questionsList,
      answers: validation,
    };
  };

  // - getQuestion(): returns only the question JSON
  getQuestion = () => {
    const { stimulus, questionsList } = this.props;
    return {
      question: stimulus,
      options: questionsList,
    };
  };

  // - getCorrectAnswer(): returns only the correct answer JSON
  getCorrectAnswer = () => {
    const { validation } = this.props;
    return validation;
  };

  // - hasChanged(): boolean to indicate whether the content has been edited
  hasChanged = () => {
    return this.edited;
  };

  // - setChanged(state): set it to false after a save etc.
  setChanged = state => {};

  // - clear(): clear everything and set to defaults
  clear() {
    const { clearQuestionsAction } = this.props;
    clearQuestionsAction();
  }

  // - undo(): undo the last change
  undo() {}

  // - redo(): redo the last change
  redo() {}
}

const enhance = connect(
  state => ({
    stimulus: getStimulusSelector(state),
    questionsList: getQuestionsListSelector(state),
    validation: getValidationSelector(state),
    validationState: validationSelector(state),
    question: getQuestionSelector(state),
  }),
  {
    updateStimulus: updateStimulusAction,
    updateQuestionsList: updateQuestionsListAction,
    updateValidation: updateValidationAction,
    clearQuestions: clearQuestionsAction,
    setQuestionData: setQuestionDataAction,
  },
);

export default enhance(QuestionAuthoring);
