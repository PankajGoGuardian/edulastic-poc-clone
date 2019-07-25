import React, { Component } from "react";
import PropTypes from "prop-types";
import { SortableContainer } from "react-sortable-hoc";

import OrderListReportItem from "./components/OrderListReportItem";

class OrderListReport extends Component {
  get rendererQuestions() {
    const { previewIndexesList, questionsList } = this.props;

    return previewIndexesList.map(index => questionsList[index]);
  }

  render() {
    const { validation, showAnswers, evaluation, list, listStyle, columns, disableResponse, styleType } = this.props;

    return (
      <div style={listStyle}>
        {this.rendererQuestions.map((q, i) => (
          <OrderListReportItem
            key={i}
            columns={columns}
            disabled={disableResponse}
            listStyle={listStyle}
            styleType={styleType}
            correct={evaluation && evaluation[i]}
            correctText={showAnswers && list[validation.valid_response.value[i]]}
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
  questionsList: PropTypes.array.isRequired,
  list: PropTypes.array.isRequired,
  previewIndexesList: PropTypes.array.isRequired,
  listStyle: PropTypes.object.isRequired,
  validation: PropTypes.object,
  showAnswers: PropTypes.bool,
  disableResponse: PropTypes.bool,
  evaluation: PropTypes.array,
  columns: PropTypes.number,
  styleType: PropTypes.string
};
OrderListReport.defaultProps = {
  showAnswers: false,
  disableResponse: false,
  evaluation: [],
  validation: {},
  columns: 1,
  styleType: "button"
};

export default SortableContainer(OrderListReport);
