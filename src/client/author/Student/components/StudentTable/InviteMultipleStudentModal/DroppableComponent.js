import React, { Component } from "react";
import { DropTarget } from "react-dnd";

const dropCollect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget()
  };
};

class TargetContainer extends Component {
  render() {
    const { connectDropTarget, isDragging } = this.props;
    return connectDropTarget(<div style={{ width: "100%", minHeight: "300px" }}>{this.props.children}</div>);
  }
}
TargetContainer = DropTarget("item", {}, dropCollect)(TargetContainer);
export default TargetContainer;
