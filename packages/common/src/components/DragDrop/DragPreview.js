import React, { useContext, useRef } from 'react'
import { useDragLayer } from 'react-dnd'
import styled from 'styled-components'
import { get, isUndefined } from 'lodash'
import { ScrollContext, HorizontalScrollContext } from '@edulastic/common'

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  transform: 'scale(1) !important',
  height: '100%',
  opacity: 0.5,
}

const getItemStyles = (initialOffset, currentOffset, itemDimensions) => {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }
  const { x, y } = currentOffset
  const transform = `translate(${x - 10}px, ${y - 10}px)`
  return {
    transform,
    WebkitTransform: transform,
    ...itemDimensions,
  }
}

const getContainerTopBottom = (element) => {
  if (isUndefined(element?.offsetTop)) {
    return [70, window.innerHeight]
  }
  const rect = element.getBoundingClientRect()
  return [rect.top, rect.bottom]
}

const getContainerLeftRight = (element) => {
  if (isUndefined(element?.offsetLeft)) {
    return [70, window.innerWidth]
  }
  const rect = element.getBoundingClientRect()
  return [rect.left, rect.right]
}

/**
 * @param {boolean} showPoint
 * needed only for graph placement type and Number line types
 * dragging value is on dropcontainer, showPoint is true, otherwise it is false
 */
const CustomDragLayer = ({ showPoint, centerPoint }) => {
  const verticalInterval = useRef(null)
  const horizontalInterval = useRef(null)
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getClientOffset(),
      isDragging: monitor.isDragging(),
    })
  )

  const { getScrollElement } = useContext(ScrollContext)
  const scrollEl = getScrollElement()
  const horizontalScrollContext = useContext(HorizontalScrollContext)
  const horizontalScrollEl = horizontalScrollContext.getScrollElement()
  const itemDimensions = get(item, 'dimensions', { width: 0, height: 0 })

  const [top, bottom] = getContainerTopBottom(scrollEl)
  const [left, right] = getContainerLeftRight(horizontalScrollEl)

  // ------------- vertical drag scroll start -----------------
  if (scrollEl) {
    const containerTop = top
    const containerBottom = bottom - 15 // window.innerHeight - 50;
    const yOffset = get(currentOffset, 'y', null)
    const scrollByVertical = yOffset < containerTop ? -10 : 10

    if (
      !verticalInterval.current &&
      scrollByVertical &&
      yOffset &&
      (yOffset < containerTop || yOffset > containerBottom)
    ) {
      verticalInterval.current = setInterval(() => {
        scrollEl.scrollBy({
          top: scrollByVertical,
        })
      }, 50)
    } else if (
      verticalInterval.current &&
      ((yOffset > containerTop && yOffset < containerBottom) || !yOffset)
    ) {
      clearInterval(verticalInterval.current)
      verticalInterval.current = null
    }
  }
  // ------------- vertical drag scroll end ------------------

  // ------------- horizontal drag scroll start ------------------
  if (horizontalScrollEl) {
    const containerRight = right - 15
    const xOffset = get(currentOffset, 'x', null)
    const scrollByHorizontal = xOffset < left ? -10 : 10

    if (
      !horizontalInterval.current &&
      scrollByHorizontal &&
      xOffset &&
      (xOffset < left || xOffset > containerRight)
    ) {
      horizontalInterval.current = setInterval(() => {
        horizontalScrollEl.scrollBy({
          left: scrollByHorizontal,
        })
      }, 50)
    } else if (
      horizontalInterval.current &&
      ((xOffset > left && xOffset < containerRight) || !xOffset)
    ) {
      clearInterval(horizontalInterval.current)
      horizontalInterval.current = null
    }
  }
  // ------------- horizontal drag scroll end ------------------

  if (!isDragging) {
    return null
  }

  /**
   * prview is React element from dragItem.
   * please have a look at useDrag section of dragItem
   */
  const preview = get(item, 'preview')
  const style = getItemStyles(initialOffset, currentOffset, itemDimensions)

  return (
    <DragPreviewContainer style={layerStyles}>
      <div style={style}>
        <div className="edu-drag-preview">{preview}</div>
        {showPoint && (
          <DraggingPointer centerPoint={centerPoint}>
            <DraggingPoint />
          </DraggingPointer>
        )}
      </div>
    </DragPreviewContainer>
  )
}

export default CustomDragLayer

const DragPreviewContainer = styled.div`
  img.fr-dii {
    margin-left: 0px !important;
    margin-right: 0px !important;
    width: 100% !important;
    height: 100% !important;
  }
  p {
    padding-inline-end: 0px;
  }
  .edu-drag-preview {
    overflow: hidden;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    border-radius: 2px;
    background: white;
    border: 1px solid #000;
  }
`

// these components needed only for graph type
const DraggingPointer = styled.div`
  position: absolute;
  margin-top: -1px;
  left: ${({ centerPoint }) => (centerPoint ? '50%' : 'calc(25% - 6px)')};
  ${({ centerPoint }) => (centerPoint ? 'transform: translateX(-50%)' : '')};
  z-index: 1000;

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0px;
    width: 0;
    height: 0;
    border-top: 8px solid #434b5d;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 0px;
  }
  &::after {
    content: '';
    display: block;
    position: absolute;
    top: 0px;
    left: 1px;
    width: 0;
    height: 0;

    border-top: 7px solid white;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 0px;
  }
`

const DraggingPoint = styled.div`
  position: absolute;
  top: 8px;
  left: 1px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #434b5d;
`
