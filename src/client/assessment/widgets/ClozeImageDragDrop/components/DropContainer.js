import React from "react";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";

const specTarget = {
  canDrop(props) {
    return props.disableResponse ? !props.disableResponse : true;
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
        ...(isOver ? { boxShadow: "0 0 6px #75b4dd", border: "2px dashed #75b4dd" } : {})
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
