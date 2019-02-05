import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

import { dashBorderColor, green } from '@edulastic/colors';

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

const DropContainer = ({ connectDropTarget, isOver, style, children, noBorder, noTopBorder }) => {
  const border = `${
    !noBorder
      ? isOver
        ? `2px solid ${green}`
        : `2px dashed ${dashBorderColor}`
      : isOver
        ? `2px solid ${green}`
        : '2px solid transparent'
  }`;

  return connectDropTarget(
    <div
      style={{
        ...style,
        border,
        borderTopColor: noTopBorder && !isOver ? 'transparent' : border
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
  drop: PropTypes.func.isRequired
};

DropContainer.defaultProps = {
  style: {},
  children: undefined,
  noBorder: false
};

export default DropTarget('item', specTarget, collectTarget)(DropContainer);
