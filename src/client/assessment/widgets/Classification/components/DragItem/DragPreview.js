import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DragLayer } from 'react-dnd'

function collect(monitor, { isResetOffset }) {
  return {
    sourceOffset: isResetOffset
      ? monitor.getDifferenceFromInitialOffset()
      : monitor.getSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    item: monitor.getItem(),
  }
}

const DragPreview = ({ isDragging, children, sourceOffset }) => (
  <PreviewContainer
    hide={!isDragging || !sourceOffset}
    left={sourceOffset && sourceOffset.x}
    top={sourceOffset && sourceOffset.y}
  >
    {children}
  </PreviewContainer>
)

DragPreview.propTypes = {
  isDragging: PropTypes.bool,
  sourceOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  children: PropTypes.node.isRequired,
}

DragPreview.defaultProps = {
  isDragging: false,
  sourceOffset: {},
}

export default DragLayer(collect)(DragPreview)

const PreviewContainer = styled.div.attrs(({ left, top, hide }) => ({
  style: {
    transform: `translate(${left || 0}px, ${top || 0}px)`,
    display: hide ? 'none' : 'block',
  },
}))`
  position: fixed;
  opacity: 0.5;
  z-index: 1000;
  left: 0;
  top: 0;
  transition: none;
  pointer-events: none;
`
