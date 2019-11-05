import React from "react";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";

const specTarget = {
  drop: (props, monitor) => {
    if (monitor.didDrop()) {
      return;
    }

    return props.drop();
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

const Droppable = ({ connectDropTarget, children, style, isOver }) =>
  connectDropTarget(
    <div
      style={{
        top: -5,
        display: "inline-flex",
        verticalAlign: "middle",
        borderRadius: 10,
        border: "2px dashed #E6E6E6",
        ...style,
        ...(isOver ? { boxShadow: "0 0 6px #75b4dd", border: "2px dashed #75b4dd" } : {})
      }}
    >
      {children}
    </div>
  );

Droppable.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  children: PropTypes.node,
  style: PropTypes.object
};

Droppable.defaultProps = {
  children: undefined,
  style: {}
};

export default DropTarget("item", specTarget, collectTarget)(Droppable);
