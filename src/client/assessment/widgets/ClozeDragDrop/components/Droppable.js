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

const Droppable = ({ connectDropTarget, children, style }) =>
  connectDropTarget(
    <div
      style={{
        top: -5,
        display: "inline-flex",
        verticalAlign: "middle",
        ...style
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
