import React from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";
import { DropTarget } from "react-dnd";
import { compose } from "redux";

import { MathSpan } from "@edulastic/common";

import DragItem from "./DragItem";

const specTarget = {
  drop: (props, monitor) => {
    if (monitor.didDrop()) {
      return;
    }

    return props.drop(props);
  }
};

const collectTarget = (connector, monitor) => ({
  connectDropTarget: connector.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop()
});

const ResponseBoxLayout = ({
  smallSize,
  responses,
  fontSize,
  dragHandler,
  onDrop,
  transparentResponses,
  connectDropTarget,
  isOver,
  responseContainerPosition
}) => {
  const horizontallyAligned = responseContainerPosition === "left" || responseContainerPosition === "right";
  return connectDropTarget(
    <div
      className="responses_box"
      data-cy="responses-box"
      style={{
        padding: smallSize ? "5px 10px" : horizontallyAligned ? 10 : 16,
        height: horizontallyAligned && "100%",
        border: "2px dashed transparent",
        ...(isOver ? { boxShadow: "0 0 6px #75b4dd", border: "2px dashed #75b4dd" } : {})
      }}
    >
      {responses.map((option = "", index) => (
        <div
          key={index}
          className={transparentResponses ? "draggable_box_transparent" : "draggable_box"}
          style={{
            fontSize: smallSize ? 10 : fontSize,
            width: horizontallyAligned && "100%"
          }}
        >
          {!dragHandler && (
            <DragItem index={index} onDrop={onDrop} item={option} data={`${option}_null_${index}`}>
              <MathSpan dangerouslySetInnerHTML={{ __html: option }} />
            </DragItem>
          )}
          {dragHandler && (
            <DragItem index={index} onDrop={onDrop} item={option} data={`${option}_null_${index}`}>
              <i className="fa fa-arrows-alt" style={{ fontSize: 12 }} />
              <MathSpan dangerouslySetInnerHTML={{ __html: option }} />
            </DragItem>
          )}
        </div>
      ))}
    </div>
  );
};

ResponseBoxLayout.propTypes = {
  responses: PropTypes.array,
  fontSize: PropTypes.string,
  onDrop: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  dragHandler: PropTypes.bool,
  transparentResponses: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  responseContainerPosition: PropTypes.string
};

ResponseBoxLayout.defaultProps = {
  responses: [],
  fontSize: "13px",
  smallSize: false,
  dragHandler: false,
  transparentResponses: false,
  responseContainerPosition: "bottom"
};

const enhance = compose(
  withTheme,
  React.memo,
  DropTarget("metal", specTarget, collectTarget)
);

export default enhance(ResponseBoxLayout);
