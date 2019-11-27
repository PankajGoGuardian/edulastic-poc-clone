import React from "react";
import { DragSource } from "react-dnd";
import PropTypes from "prop-types";
import { isMobileDevice } from "@edulastic/common";
import DragPreview from "../../../components/SourceDragPreview";

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
  },
  canDrag(props) {
    return !props.disableResponse;
  }
};

const Draggable = ({ connectDragSource, title, data, children, className, style, ...restProps }) =>
  data &&
  connectDragSource(
    <div title={title} className={className} style={style} draggable>
      {isMobileDevice() && <DragPreview {...restProps}>{children}</DragPreview>}
      {children}
    </div>
  );

Draggable.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  data: PropTypes.any.isRequired,
  title: PropTypes.any.isRequired,
  children: PropTypes.node,
  className: PropTypes.string
};

Draggable.defaultProps = {
  children: undefined,
  className: ""
};

export default DragSource("item", specSource, collectSource)(Draggable);
