import React, { Component } from "react";
import { DragSource, DropTarget } from "react-dnd";

const dragSpec = {
  beginDrag(props) {
    return props.item;
  },
  endDrag(props, monitor, component) {
    const dragResult = monitor.getDropResult();
    if (dragResult) {
      return props.handleDrop(props.item);
    }
  }
};
const dragCollect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
};
const dropCollect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget()
  };
};

class Item extends Component {
  render() {
    const { item, connectDragSource, connectDropTarget, isDragging } = this.props;
    const opacity = isDragging ? 0.2 : 1;
    return connectDragSource(
      connectDropTarget(
        <div
          style={{
            opacity,
            padding: "0.5rem",
            background: "lightgrey",
            color: "black",
            margin: "0.2rem",
            textAlign: "center",
            cursor: "pointer"
          }}
        >
          {item._source.email}
        </div>
      )
    );
  }
}
Item = DragSource("item", dragSpec, dragCollect)(Item);
Item = DropTarget("item", {}, dropCollect)(Item);

export default Item;
