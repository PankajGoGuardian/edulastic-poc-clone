import React from "react";
import PropTypes from "prop-types";
import { SortableElement } from "react-sortable-hoc";
import { MathFormulaDisplay } from "@edulastic/common";

import { Container } from "../styled/Container";
import { StyledDragHandle } from "../styled/StyledDragHandle";
import { Text } from "../styled/Text";
import DragHandle from "./DragHandle";

const OrderListPreviewItem = SortableElement(({ children, showDragHandle, smallSize, columns, styleType, cIndex }) => (
  <Container columns={columns} id={`order-list-${cIndex}`}>
    {showDragHandle && (
      <StyledDragHandle styleType={styleType} smallSize={smallSize}>
        <DragHandle smallSize={smallSize} />
      </StyledDragHandle>
    )}
    <Text styleType={styleType} showDragHandle={showDragHandle} smallSize={smallSize}>
      <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: children }} />
    </Text>
  </Container>
));

OrderListPreviewItem.propTypes = {
  children: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  showDragHandle: PropTypes.bool,
  smallSize: PropTypes.bool,
  columns: PropTypes.number,
  styleType: PropTypes.string
};

OrderListPreviewItem.defaultProps = {
  showDragHandle: true,
  styleType: "button",
  smallSize: false,
  columns: 1
};

export default OrderListPreviewItem;
