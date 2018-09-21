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

    console.log('validationState', validationState);
    console.log('questionsList', questionsList);
    console.log('previewIndexesList', previewIndexesList);

    return (
      <div>
        {questions.map((q, i) => (
          <OrderListReportItem
            key={i}
            correct={questionsList[i] === questionsList[validationState.valid_response.value[i]]}
            correctText={validation.valid_response.value[i]}
            showAnswers={showAnswers}
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
