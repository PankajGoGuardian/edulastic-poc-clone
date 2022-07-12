import React, { useEffect, useContext, useCallback } from 'react'
import {
  greyThemeLighter,
  themeColorBlue,
  lightGrey12,
} from '@edulastic/colors'
import { isObject } from 'lodash'
import styled, { css, withTheme } from 'styled-components'
import PropTypes from 'prop-types'
import { useDrop } from 'react-dnd'
import { DndStateContext } from './CustomDndProvider'

const DropContainer = ({
  style,
  drop: onDrop,
  hover,
  children,
  index,
  borderColor,
  showHoverBorder,
  noBorder,
  className,
  ...rest
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'item',
    drop(item, monitor) {
      if (monitor.didDrop()) {
        return
      }
      if (typeof drop === 'function') {
        const itemPos = monitor.getClientOffset()
        const { data, dimensions } = item

        let itemRect = { ...(itemPos || {}) }
        if (isObject(dimensions)) {
          itemRect = { ...itemRect, ...dimensions }
        }
        onDrop({ data, itemRect }, index)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  const ctx = useContext(DndStateContext)
  const { state: { actived } = {}, setItem } = ctx || {}

  const attach = useCallback((element) => drop(element), [drop])

  useEffect(() => {
    if (hover) {
      hover(isOver)
    }
  }, [hover, isOver])

  useEffect(() => {
    return () => {
      if (setItem) {
        setItem({ type: 'REMOVE_ACTIVE_DRAG_ITEM' })
      }
    }
  }, [])

  const overrideBorderColor = isOver
    ? themeColorBlue
    : borderColor || 'transparent'

  const mergedStyle = {
    ...style,
    background:
      rest.evaluationBackgroundColor || style.background || greyThemeLighter,
  }

  const onClickHandler = (e) => {
    if (window.$ && window.isMobileDevice) {
      const dragItems = jQuery('*[data-dnd="edu-dragitem"]').toArray()
      const isInItemContainer = dragItems.some((itemCont) =>
        itemCont.contains(e.target)
      )

      if (actived && !isInItemContainer) {
        const { data, dimensions } = actived
        onDrop(
          {
            data,
            itemRect: dimensions,
          },
          index
        )
        setItem({ type: 'REMOVE_ACTIVE_DRAG_ITEM' })
      }
    }
  }

  return (
    <Container
      {...rest}
      className={`${className} drop-target-box`}
      ref={attach}
      style={mergedStyle}
      id={`drop-container-${index}`}
      borderColor={overrideBorderColor}
      showHoverBorder={showHoverBorder}
      noBorder={noBorder}
      onClick={onClickHandler}
      hasActived={!!actived}
      data-dnd="edu-droparea"
    >
      {children}
    </Container>
  )
}

DropContainer.propTypes = {
  children: PropTypes.node,
  drop: PropTypes.func,
  style: PropTypes.object,
  isOver: PropTypes.bool,
  index: PropTypes.number,
  className: PropTypes.string,
  borderColor: PropTypes.string,
}

DropContainer.defaultProps = {
  children: undefined,
  isOver: false,
  drop: () => null,
  style: {},
  index: null,
  className: '',
  borderColor: lightGrey12,
}

export default withTheme(DropContainer)

const hoverStyle = css`
  &:hover {
    border-color: red;
  }
`

const Container = styled.div`
  position: relative;
  font-size: ${({ theme }) => theme.fontSize};
  border: ${({ noBorder }) => !noBorder && '3px dashed'};
  border-radius: 2px;
  border-color: ${({ borderColor }) => borderColor};
  ${({ showHoverBorder }) => showHoverBorder && hoverStyle}
  cursor: ${({ hasActived }) => hasActived && 'grabbing'};
`
