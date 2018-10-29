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
    const { validation, showAnswers, evaluation } = this.props;

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
  questionsList: PropTypes.array.isRequired,
  previewIndexesList: PropTypes.array.isRequired,
  showAnswers: PropTypes.bool,
  evaluation: PropTypes.array,
};
OrderListReport.defaultProps = {
  showAnswers: false,
  evaluation: [],
};

export default SortableContainer(OrderListReport);
