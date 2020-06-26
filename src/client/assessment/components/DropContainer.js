import React from "react";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import { withTheme } from "styled-components";

const specTarget = {
  drop: (props, monitor) => {
    if (monitor.didDrop()) {
      return;
    }
    return props.drop(props, monitor.getItem());
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
  width,
  index,
  isOver,
  flag,
  style,
  children,
  noBorder,
  noTopBorder,
  theme,
  borderNone,
  isPlaylist
}) => {
  const border = `${
    !noBorder
      ? isOver
        ? `1px dashed ${theme.dropContainer.isOverBorderColor}`
        : `1px dashed ${isPlaylist ? "transparent" : theme.dropContainer.isNotOverBorderColor}`
      : isOver
      ? `1px solid ${theme.dropContainer.isOverBorderColor}`
      : `1px solid ${theme.dropContainer.isNotOverBorderColor}`
  }`;

  return connectDropTarget(
    <div
      data-cy={`drag-drop-board-${index}`}
      id={`drag-drop-board-${index}${flag === "selected" ? "-target" : ""}`}
      style={{
        width: width || "100%",
        zIndex: 50,
        ...style,
        border: borderNone ? "none" : border,
        background: isPlaylist ? "unset" : "#f8f8f8",
        borderTopColor: noTopBorder && !isOver ? theme.dropContainer.noBorderColor : border
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
