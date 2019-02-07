import React from 'react';
import { DragSource } from 'react-dnd';
import PropTypes from 'prop-types';

function collectSource(connector, monitor) {
  return {
    connectDragSource: connector.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const specSource = {
  beginDrag(props) {
    return { data: props.data };
  },

  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }

    const { dropTargetIndex } = monitor.getDropResult();

    props.onDrop(props.data, dropTargetIndex);
  }
};

const Draggable = ({ connectDragSource, data, children, style }) =>
  data &&
  connectDragSource(
    <div style={style}>
      {children}
    </div>
  );

Draggable.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  data: PropTypes.any.isRequired,
  children: PropTypes.node,
  style: PropTypes.object
};

Draggable.defaultProps = {
  children: undefined,
  style: {}
};

export default DragSource('item', specSource, collectSource)(Draggable);
