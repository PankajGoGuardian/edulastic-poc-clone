import React from "react";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";

const specTarget = {
  canDrop(props) {
    return !props.disableResponse;
  },
  drop: (props, monitor) => {
    if (monitor.didDrop()) {
      return;
    }
    const sourcePos = monitor.getSourceClientOffset();
    return props.drop({ ...props, position: sourcePos });
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

const DropContainer = ({ connectDropTarget, index, style, children, className, isOver }) =>
  connectDropTarget(
    <div
      id={`answerboard-dragdropbox-${index}`}
      style={{
        ...style,
        ...(isOver ? { boxShadow: "0 0 6px #75b4dd", background: "#f8f8f8", border: "2px dashed #b9b9b9" } : {})
      }}
      className={className}
    >
      {children}
    </div>
  );

DropContainer.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  style: PropTypes.object,
  children: PropTypes.node,
  drop: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
};

DropContainer.defaultProps = {
  style: {},
  children: undefined
};

export default DropTarget("metal", specTarget, collectTarget)(DropContainer);
