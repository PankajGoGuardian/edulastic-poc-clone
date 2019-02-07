import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

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

const Droppable = ({ connectDropTarget, children, style, className }) =>
  connectDropTarget(
    <div
      className={className}
      style={style}
    >
      {children}
    </div>
  );

Droppable.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  children: PropTypes.node,
  style: PropTypes.object,
  className: PropTypes.string
};

Droppable.defaultProps = {
  children: undefined,
  style: {},
  className: ''
};

export default DropTarget('item', specTarget, collectTarget)(Droppable);
