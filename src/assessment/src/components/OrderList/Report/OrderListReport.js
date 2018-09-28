import React, { Component } from 'react';
import PropTypes from 'prop-types';

import OrderListReportItem from './OrderListReportItem';

class OrderListReport extends Component {
  render() {
    const {
      questions,
      validation,
      previewIndexesList,
      validationState,
      showAnswers,
      questionsList,
    } = this.props;

    const getCorrect = (index) => {
      const questionText = questionsList[previewIndexesList[index]];
      const correctAnswer = questionsList[validationState.valid_response.value[index]];
      const altAnswers = validationState.alt_responses.reduce((acc, { value }) => {
        acc.push(questionsList[value[index]]);
        return acc;
      }, []);
      const answers = [correctAnswer, ...altAnswers];

      return answers.includes(questionText);
    };

    return (
      <div>
        {questions.map((q, i) => (
          <OrderListReportItem
            key={i}
            correct={getCorrect(i)}
            correctText={validation.valid_response.value[i]}
            showAnswers={showAnswers}
            index={i + 1}
          >
            {q}
          </OrderListReportItem>
        ))}
      </div>
    );
  }
}

OrderListReport.propTypes = {
  questions: PropTypes.array.isRequired,
  validation: PropTypes.object.isRequired,
  previewIndexesList: PropTypes.array.isRequired,
  validationState: PropTypes.object.isRequired,
  questionsList: PropTypes.array.isRequired,
  showAnswers: PropTypes.bool,
};
OrderListReport.defaultProps = {
  showAnswers: false,
};

export default OrderListReport;
