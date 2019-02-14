import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { withTheme } from 'styled-components';

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
  isOver,
  style,
  children,
  noBorder,
  noTopBorder,
  theme
}) => {
  const border = `${
    !noBorder
      ? isOver
        ? `2px solid ${theme.dropContainer.isOverBorderColor}`
        : `2px dashed ${theme.dropContainer.isNotOverBorderColor}`
      : isOver
        ? `2px solid ${theme.dropContainer.isOverBorderColor}`
        : `2px solid ${theme.dropContainer.noBorderColor}`
  }`;

  return connectDropTarget(
    <div
      style={{
        zIndex: 1,
        ...style,
        border,
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
  drop: PropTypes.func.isRequired
};

DropContainer.defaultProps = {
  style: {},
  children: undefined,
  noBorder: false
};

export default withTheme(DropTarget('item', specTarget, collectTarget)(DropContainer));
