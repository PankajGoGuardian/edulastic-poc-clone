import React, { Component } from 'react';
import PropTypes from 'prop-types';

import QuestionEvaluation from '../../Base/QuestionEvaluation';

class MultipleChoiceEvaluation extends Component {
  static propTypes = {
    onRef: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
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
      <QuestionEvaluation onRef={(ref) => { this.evaluationCmp = ref; }}>
        { children }
      </QuestionEvaluation>
    );
  }

  getCorrectAnswers = () => this.evaluationCmp.getValidation();

  evaluateResponse = (studentResponse) => {
    const result = Array(studentResponse.length).fill(false);
    const { valid_response, alt_responses } = this.evaluationCmp.getValidation();
    valid_response.value.forEach((answer) => {
      result[answer] = true;
    });
    alt_responses.forEach((alt_response) => {
      alt_response.value.forEach((answer) => {
        result[answer] = true;
      });
    });
    return result;
  }
}

export default MultipleChoiceEvaluation;
