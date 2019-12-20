import React from "react";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import { withTheme } from "styled-components";

const specTarget = {
  drop: (props, monitor) => {
    if (monitor.didDrop()) {
      return;
    }

    return props.drop(props);
  }
};

function collectTarget(connector, monitor) {
  return {
    connectDropTarget: connector.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop()
  };
}

const DropContainer = ({
  connectDropTarget,
  index,
  isOver,
  flag,
  style,
  children,
  noBorder,
  noTopBorder,
  theme,
  borderNone
}) => {
  const border = `${
    !noBorder
      ? isOver
        ? `2px dashed ${theme.dropContainer.isOverBorderColor}`
        : `2px dashed transparent`
      : isOver
      ? `2px solid ${theme.dropContainer.isOverBorderColor}`
      : `2px solid ${theme.dropContainer.isNotOverBorderColor}`
  }`;

  return connectDropTarget(
    <div
      data-cy={`drag-drop-board-${index}`}
      id={`drag-drop-board-${index}${flag === "selected" ? "-target" : ""}`}
      style={{
        zIndex: 50,
        ...style,
        border: borderNone ? "none" : border,
        borderTopColor: noTopBorder && !isOver ? theme.dropContainer.noBorderColor : border,
        width: "100%"
      }}
    >
      {children}
    </div>
  );
};

DropContainer.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  style: PropTypes.object,
  children: PropTypes.node,
  noBorder: PropTypes.bool,
  drop: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  index: PropTypes.number
};

DropContainer.defaultProps = {
  style: {},
  children: undefined,
  noBorder: false
};

export default withTheme(DropTarget("item", specTarget, collectTarget)(DropContainer));
