import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getStimulusSelector,
  getQuestionsListSelector,
} from '../../selectors/questionCommon';
import {
  updateStimulusAction,
  updateQuestionsListAction,
  clearQuestionsAction,
} from '../../actions/questionCommon';

class QuestionDisplay extends Component {
  static propTypes = {
    onRef: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    stimulus: PropTypes.string.isRequired,
    questionsList: PropTypes.array.isRequired,
    updateQuestionsList: PropTypes.func.isRequired,
    updateStimulus: PropTypes.func.isRequired,
    clearQuestion: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
  }

  componentWillUnmount() {
    const { onRef } = this.props;
    onRef(undefined);
  }

  render() {
    const { children, stimulus, questionsList } = this.props;
    return (
      <React.Fragment key={stimulus && questionsList}>
        { children }
      </React.Fragment>
    );
  }

  validateData = (data) => {
    const { question, options } = data;
    let validationQuestion = question;
    let validationOptions = options;
    if (question === null) {
      validationQuestion = '';
    }
    if (options === null) {
      validationOptions = [];
    }
    return {
      validationQuestion,
      validationOptions,
    };
  }

  initialize = () => {
    const { clearQuestion } = this.props;
    clearQuestion();
  }

  initializeData = (data) => {
    const { updateStimulus, updateQuestionsList } = this.props;
    const { validationQuestion, validationOptions } = this.validateData(data);
    if (validationQuestion !== undefined) updateStimulus(validationQuestion);
    if (validationOptions !== undefined) updateQuestionsList(validationOptions);
  }

  getResponse = () => {
    const { stimulus, questionsList } = this.props;
    console.log('stimulus, questionsList', stimulus, questionsList);
    return {
      question: stimulus,
      options: questionsList.map((label, index) => ({ value: index, label })),
    };
  }
}

const enhance = connect(
  state => ({
    stimulus: getStimulusSelector(state),
    questionsList: getQuestionsListSelector(state),
  }),
  {
    updateStimulus: updateStimulusAction,
    updateQuestionsList: updateQuestionsListAction,
    clearQuestion: clearQuestionsAction,
  },
);

export default enhance(QuestionDisplay);
