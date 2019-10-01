import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { DragLayer } from "react-dnd";
import { white, dashBorderColor } from "@edulastic/colors";

function collect(monitor, { isResetOffset }) {
  return {
    sourceOffset: isResetOffset ? monitor.getDifferenceFromInitialOffset() : monitor.getSourceClientOffset()
  };
}

function useDragScroll(sourceOffset) {
  const interval = useRef(null);

  // scroll the page when dragging element reaches top of the view port..
  useEffect(() => {
    const yOffset = sourceOffset?.y ?? Infinity;
    if (interval.current && yOffset > 30) {
      clearInterval(interval.current);
      interval.current = null;
    } else if (!interval.current && yOffset < 30) {
      interval.current = setInterval(() => window.scrollBy(0, -10), 50);
    }
  }, [sourceOffset]);
}

const DragPreview = ({ isDragging, children, sourceOffset }) => {
  useDragScroll(sourceOffset);

  if (!isDragging || !sourceOffset) {
    return null;
  }

  return (
    <PreviewContainer left={sourceOffset && sourceOffset.x} top={sourceOffset && sourceOffset.y}>
      {children}
    </PreviewContainer>
  );
};

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

const PreviewContainer = styled.div.attrs({
  style: ({ left, top }) => ({
    transform: `translate(${left || 0}px, ${top || 0}px)`
  })
})`
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
