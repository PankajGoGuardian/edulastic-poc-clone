import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { DragLayer } from 'react-dnd'
import { white, dashBorderColor } from '@edulastic/colors'

function collect(monitor, { isResetOffset }) {
  const clientOffset = monitor.getClientOffset()
  const sourceClientOffset = monitor.getSourceClientOffset()

  const sourceOffset = isResetOffset
    ? monitor.getDifferenceFromInitialOffset()
    : monitor.getSourceClientOffset()

  // This is difference between parent top/left and item top/left
  // it's supposed to be used with isResetOffset true
  let difference = { x: 0, y: 0 }
  if (clientOffset && sourceClientOffset) {
    difference = {
      x: clientOffset.x - sourceClientOffset.x,
      y: clientOffset.y - sourceClientOffset.y,
    }
  }

  return {
    sourceOffset,
    difference,
  }
}

class DragPreview extends Component {
  render() {
    const {
      children,
      sourceOffset,
      isResetOffset,
      isDragging,
      difference,
    } = this.props

    return (
      <PreviewContainer
        isResetOffset={isResetOffset}
        isHidden={!isDragging}
        difference={difference}
        left={sourceOffset && sourceOffset.x}
        top={sourceOffset && sourceOffset.y}
      >
        {children}
      </PreviewContainer>
    )
  }
}

DragPreview.propTypes = {
  isDragging: PropTypes.bool,
  sourceOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  children: PropTypes.node.isRequired,
  isResetOffset: PropTypes.bool,
  difference: PropTypes.object,
}

DragPreview.defaultProps = {
  isDragging: false,
  sourceOffset: {},
  isResetOffset: false,
  difference: { x: 0, y: 0 },
}

export default DragLayer(collect)(DragPreview)

const PreviewContainer = styled.div`
  transform: ${({ left, top }) => `translate(${left || 0}px, ${top || 0}px)}`};
  display: ${({ isHidden }) => (isHidden ? 'none' : null)};
  background: ${white};
  border: 2px ${dashBorderColor} dotted;
  padding: 8px 20px;
  position: fixed;
  opacity: 0.5;
  z-index: 1000;
  left: ${({ isResetOffset, difference }) =>
    isResetOffset ? difference.x : 0};
  top: ${({ isResetOffset, difference }) => (isResetOffset ? difference.y : 0)};
  transition: none;
  pointer-events: none;
`
