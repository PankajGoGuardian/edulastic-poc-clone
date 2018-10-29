import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortableContainer } from 'react-sortable-hoc';

import OrderListReportItem from './OrderListReportItem';

class OrderListReport extends Component {
  get rendererQuestions() {
    const { previewIndexesList, questionsList } = this.props;

    return previewIndexesList.map(index => questionsList[index]);
  }

  render() {
    const {
      validation,
      previewIndexesList,
      validationState,
      showAnswers,
      questionsList,
      evaluation
    } = this.props;

    console.log('evaluation here at here ', evaluation);
    const getCorrect = index => {
      const questionText = questionsList[previewIndexesList[index]];
      const correctAnswer =
        questionsList[validationState.valid_response.value[index]];
      const altAnswers = validationState.alt_responses.reduce(
        (acc, { value }) => {
          acc.push(questionsList[value[index]]);
          return acc;
        },
        []
      );
      const answers = [correctAnswer, ...altAnswers];

      return answers.includes(questionText);
    };

    return (
      <div>
        {this.rendererQuestions.map((q, i) => (
          <OrderListReportItem
            key={i}
            correct={evaluation && evaluation[i]}
            correctText={validation.valid_response.value[i]}
            showAnswers={showAnswers}
            index={i}
            ind={i + 1}
          >
            {q}
          </OrderListReportItem>
        ))}
      </div>
    );
  }
}

OrderListReport.propTypes = {
  validation: PropTypes.object.isRequired,
  previewIndexesList: PropTypes.array.isRequired,
  validationState: PropTypes.object.isRequired,
  questionsList: PropTypes.array.isRequired,
  showAnswers: PropTypes.bool,
  evaluation: PropTypes.array
};
OrderListReport.defaultProps = {
  showAnswers: false
};

export default SortableContainer(OrderListReport);
