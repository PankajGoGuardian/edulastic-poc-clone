import React, { useEffect, useContext, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useDrag } from 'react-dnd'
import styled, { css } from 'styled-components'
import { themeColorHoverBlue } from '@edulastic/colors'
import { isEqual } from 'lodash'
import { AnswerContext } from '@edulastic/common'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { DndStateContext } from './CustomDndProvider'

const DragItem = ({
  data,
  children,
  disabled,
  activeItem,
  onClick,
  ...rest
}) => {
  const { isAnswerModifiable } = useContext(AnswerContext)
  const { state: { actived } = {}, setItem } = useContext(DndStateContext) || {}

  const [itemData, setItemData] = useState({
    data,
    type: 'item',
    preview: children,
  })

  const [startDragging, setStartDragging] = useState()

  const [{ isDragging }, drag, preview] = useDrag({
    item: itemData,
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
        const dimensions = {
          width: element.clientWidth,
          height: element.clientHeight,
        }

        setItemData({
          ...itemData,
          data,
          dimensions,
        })
        drag(element)
      }
    },
    [drag, startDragging]
  )

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [])

  const onClickHandler = (e) => {
    if (window.isMobileDevice) {
      if (setItem) {
        setItem({ type: 'SET_ACTIVE_DRAG_ITEM', data: itemData })
      }
    }
    if (onClick) {
      onClick(e)
    }
  }

  const onMouseEnterHandler = () => {
    setStartDragging(true)
  }

  const onMouseLeaveHandler = () => {
    setStartDragging(false)
  }

  const isActivated =
    actived && isEqual(actived.data, data) && !window.isMobileDevice

  return (
    <DragItemContainer
      data-cy="drag-item"
      data-dnd="edu-dragitem"
      tabIndex="0"
      isDragging={isDragging}
      isActivated={isActivated}
      ref={attach}
      onClick={onClickHandler}
      onMouseEnter={onMouseEnterHandler}
      onTouchStart={onMouseEnterHandler}
      onMouseMove={onMouseLeaveHandler}
      onTouchEnd={onMouseLeaveHandler}
      {...rest}
    >
      {children}
    </DragItemContainer>
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

const activeStyle = css`
  &.activated {
    & * {
      color: ${themeColorHoverBlue} !important;
    }
  }
`
const DragItemContainer = styled.div.attrs((props) => ({
  className: props.isActivated ? 'activated' : '',
}))`
  opacity: ${({ isDragging }) => (isDragging ? 0.2 : 1)};
  ${({ isActivated }) => isActivated && activeStyle}

  img.fr-dii {
    margin-left: 0px;
    margin-right: 0px;
    max-width: 100%;
  }
  p {
    padding-inline-end: 0px;
  }
`
