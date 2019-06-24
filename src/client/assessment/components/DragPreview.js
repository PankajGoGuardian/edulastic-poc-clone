import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { DragLayer } from "react-dnd";
import { white, dashBorderColor } from "@edulastic/colors";

function collect(monitor) {
  return {
    sourceOffset: monitor.getSourceClientOffset()
  };
}

class DragPreview extends Component {
  getLayerStyles() {
    const { sourceOffset } = this.props;

    return {
      transform: sourceOffset ? `translate(${sourceOffset.x}px, ${sourceOffset.y}px)` : ""
    };
  }

  render() {
    const { isDragging, children } = this.props;
    if (!isDragging) {
      return null;
    }

    return <PreviewContainer style={this.getLayerStyles()}>{children}</PreviewContainer>;
  }
}

DragPreview.propTypes = {
  isDragging: PropTypes.bool,
  sourceOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }),
  children: PropTypes.node.isRequired
};

DragPreview.defaultProps = {
  isDragging: false,
  sourceOffset: {}
};

export default DragLayer(collect)(DragPreview);

const PreviewContainer = styled.div`
  background: ${white};
  border: 2px ${dashBorderColor} dotted;
  padding: 8px 20px;
  position: fixed;
  opacity: 0.5;
  z-index: 1000;
  left: 0;
  top: 0;
  transition: none;
  pointer-events: none;
`;
