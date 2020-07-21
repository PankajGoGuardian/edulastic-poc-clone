import React, { Component } from "react";
import PropTypes from "prop-types";
import { SortableContainer } from "react-sortable-hoc";
import { compose } from "redux";
import { get, isEmpty } from "lodash";
import { ChoiceDimensions } from "@edulastic/constants";
import styled from "styled-components";

import OrderListPreviewItem, { PreviewItem } from "./components/OrderListPreviewItem";

const {
  maxWidth: defaultMaxW,
  minWidth: defaultMinW,
  minHeight: defaultMinH,
  maxHeight: defaultMaxH
} = ChoiceDimensions;
class OrderListPreview extends Component {
  render() {
    const {
      questions,
      smallSize,
      listStyle,
      columns,
      disableResponse,
      styleType,
      uiStyle,
      evaluation,
      getStemNumeration,
      showAnswer,
      isPrintPreview,
      options
    } = this.props;

    const listItemMinWidth = get(uiStyle, "choiceMinWidth", defaultMinW);
    const listItemMaxWidth = get(uiStyle, "choiceMaxWidth", defaultMaxW);

    const isInline = styleType === "inline";
    const numOfQuestions = questions.length || 1;

    const listContainerStyle = {
      paddingLeft: "20px",
      minWidth: listItemMinWidth,
      maxWidth: isInline ? numOfQuestions * listItemMaxWidth : listItemMaxWidth
    };

    const listItemStyle = {
      minHeight: defaultMinH,
      maxHeight: defaultMaxH,
      minWidth: listItemMinWidth,
      maxWidth: listItemMaxWidth
    };

    return (
      <OrderListWrapper
        data-cy="order-preview-container"
        id="order-preview-container"
        style={listStyle}
        styleType={styleType}
      >
        <div style={listContainerStyle}>
          {questions &&
            !!questions.length &&
            questions.map((q, i) => {
              const itemProps = {
                key: i,
                smallSize,
                columns,
                styleType,
                cIndex: i,
                showAnswer,
                style: listItemStyle,
                showDragHandle: false,
                question: showAnswer ? q : options[q],
                stemNumeration: getStemNumeration(uiStyle.validationStemNumeration, i),
                isPrintPreview
              };
              return showAnswer ? (
                <div className="__prevent-page-break">
                  <PreviewItem {...itemProps} />
                </div>
              ) : (
                <OrderListPreviewItem
                  {...itemProps}
                  index={i}
                  showDragHandle
                  showAnswer={false}
                  disabled={disableResponse}
                  checked={!isEmpty(evaluation)}
                  correct={evaluation[q]}
                />
              );
            })}
        </div>
      </OrderListWrapper>
    );
  }
}

const OrderListWrapper = styled.div`
  display: flex;
  div {
    display: ${props => (props.styleType === "inline" ? "flex" : null)};
    flex-direction: ${props => (props.styleType === "inline" ? "row" : null)};
    flex-wrap: nowrap;
    flex-shrink: 0;
  }
  align-items: ${props => (props.styleType === "inline" ? "center" : "flex-start")};
  justify-content: stretch;
`;

OrderListPreview.propTypes = {
  listStyle: PropTypes.object.isRequired,
  uiStyle: PropTypes.object.isRequired,
  evaluation: PropTypes.object,
  getStemNumeration: PropTypes.func.isRequired,
  questions: PropTypes.array,
  showAnswer: PropTypes.bool,
  smallSize: PropTypes.bool,
  disableResponse: PropTypes.bool,
  columns: PropTypes.number,
  styleType: PropTypes.string
};

OrderListPreview.defaultProps = {
  questions: [],
  evaluation: [],
  showAnswer: false,
  smallSize: false,
  disableResponse: false,
  columns: 1,
  styleType: "button"
};

const enhance = compose(SortableContainer);

export default enhance(OrderListPreview);
