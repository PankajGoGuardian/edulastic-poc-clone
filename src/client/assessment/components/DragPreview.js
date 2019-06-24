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
  render() {
    const { isDragging, children, sourceOffset } = this.props;
    if (!isDragging) {
      return null;
    }

    return (
      <PreviewContainer left={sourceOffset.x} top={sourceOffset.y}>
        {children}
      </PreviewContainer>
    );
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
  transform: ${({ left, top }) => `translate(${left || 0}px, ${top || 0}px)`};
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
