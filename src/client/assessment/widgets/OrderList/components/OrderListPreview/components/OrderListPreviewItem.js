import React from "react";
import PropTypes from "prop-types";
import { Popover } from "antd";
import { SortableElement } from "react-sortable-hoc";
import { MathFormulaDisplay, measureText } from "@edulastic/common";

import DragHandle from "./DragHandle";
import { IconWrapper } from "./IconWrapper";
import { Container } from "../styled/Container";
import { IndexBox } from "../styled/IndexBox";
import { StyledDragHandle } from "../styled/StyledDragHandle";
import { Text } from "../styled/Text";

export const PreviewItem = ({
  question,
  showDragHandle,
  smallSize,
  columns,
  styleType,
  cIndex,
  style,
  correct,
  stemNumeration,
  showAnswer,
  isPrintPreview = false
}) => {
  const content = (
    <Text
      styleType={styleType}
      showDragHandle={showDragHandle}
      smallSize={smallSize}
      correct={correct}
      showAnswer={showAnswer}
      {...style}
    >
      <MathFormulaDisplay style={{ margin: "auto", style }} dangerouslySetInnerHTML={{ __html: question }} />
    </Text>
  );
  const { width } = measureText(question, style);
  const showPopover = style.maxWidth < width;
  return (
    <Container
      columns={columns}
      id={`order-list-${cIndex}`}
      style={style}
      correct={correct}
      isPrintPreview={isPrintPreview}
    >
      {correct === undefined && showDragHandle && (
        <StyledDragHandle styleType={styleType} smallSize={smallSize}>
          <DragHandle smallSize={smallSize} />
        </StyledDragHandle>
      )}
      {(correct !== undefined || showAnswer) && (
        <IndexBox smallSize={smallSize} correct={correct} showAnswer={showAnswer}>
          {stemNumeration}
        </IndexBox>
      )}

      {showPopover ? <Popover content={content}>{content}</Popover> : content}

      {correct !== undefined && <IconWrapper correct={correct} isPrintPreview={isPrintPreview} />}
    </Container>
  );
};

PreviewItem.propTypes = {
  question: PropTypes.string.isRequired,
  cIndex: PropTypes.number.isRequired,
  showDragHandle: PropTypes.bool,
  smallSize: PropTypes.bool,
  columns: PropTypes.number,
  correct: PropTypes.bool,
  styleType: PropTypes.string,
  style: PropTypes.object.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  stemNumeration: PropTypes.string.isRequired
};

PreviewItem.defaultProps = {
  showDragHandle: true,
  styleType: "button",
  smallSize: false,
  correct: undefined,
  columns: 1
};

const OrderListPreviewItem = SortableElement(PreviewItem);

export default OrderListPreviewItem;
