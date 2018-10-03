import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getValidationSelector,
} from '../../selectors/questionCommon';
import {
  updateValidationAction,
} from '../../actions/questionCommon';

class QuestionEvaluation extends Component {
  static propTypes = {
    onRef: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    validation: PropTypes.object.isRequired,
    updateValidation: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
  }

  componentWillUnmount() {
    const { onRef } = this.props;
    onRef(undefined);
  }

  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        { children }
      </React.Fragment>
    );
  }

  validateData = (data) => {
    const { answers } = data;
    let validationAnswers = answers;
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
      validationAnswers,
    };
  }


  // - initialize(questionData)
  initialize = (questionData) => {
    const { validationAnswers } = this.validateData(questionData);
    const { updateValidation } = this.props;
    updateValidation(validationAnswers);
  }

  getValidation = () => {
    const { validation } = this.props;
    return validation;
  };

  // evaluate(studentResponse): returns the score using the model selected for the question
  evaluate = (studentResponse) => {
    console.log(studentResponse);
  }
}

const enhance = connect(
  state => ({
    validation: getValidationSelector(state),
  }),
  {
    updateValidation: updateValidationAction,
  },
);

export default enhance(QuestionEvaluation);
