import React, { useEffect, useContext, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useDrag } from 'react-dnd'
import { AnswerContext } from '@edulastic/common'
import { getEmptyImage } from 'react-dnd-html5-backend'

const getStyles = (isDragging) => ({
  opacity: isDragging ? 0.2 : 1,
})

const DragItem = ({ data, children, disabled, ...rest }) => {
  const { isAnswerModifiable } = useContext(AnswerContext)
  const [itemSize, setItemSize] = useState()
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: 'item', data, dimensions: itemSize, preview: children },
    canDrag() {
      return isAnswerModifiable && !disabled
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const attach = useCallback(
    (element) => {
      if (element) {
        setItemSize({
          width: element.clientWidth,
          height: element.clientHeight,
        })
        drag(element)
      }
    },
    [drag]
  )

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [])

  return (
    <div
      data-cy="drag-item"
      ref={attach}
      style={getStyles(isDragging)}
      {...rest}
    >
      {children}
    </div>
  )
}

DragItem.propTypes = {
  children: PropTypes.node,
  size: PropTypes.object,
  data: PropTypes.string,
}

DragItem.defaultProps = {
  children: undefined,
  size: undefined,
  data: '',
}

export default DragItem
