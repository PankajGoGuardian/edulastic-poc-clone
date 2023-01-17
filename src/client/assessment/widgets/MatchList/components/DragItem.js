import React, { Fragment, useRef, useEffect, useState } from 'react'
import { Popover } from 'antd'
import { MathFormulaDisplay, measureText, DragDrop } from '@edulastic/common'
import { Index } from '../styled/Index'
import { IconClose } from '../styled/IconClose'
import { IconCheck } from '../styled/IconCheck'
import { Wrapper } from '../styled/Wrapper'

const DragItem = ({
  item,
  flag,
  correct,
  preview,
  showAnswer,
  renderIndex,
  displayIndex,
  getStyles,
  width,
  margin,
  flex,
  centerContent,
}) => {
  const currentActiveItem = useRef(null)

  const [isActive, setActive] = useState(false)

  const [boxWidth, setBoxWidth] = useState(0)
  const { width: textWidth } = measureText(item?.label)

  const showPopover = boxWidth ? textWidth > boxWidth : false

  const itemView = (
    <Wrapper>
      <MathFormulaDisplay
        centerContent={centerContent}
        dangerouslySetInnerHTML={{ __html: item?.label || '' }}
      />
    </Wrapper>
  )

  const handleOnHover = (ev) => {
    if (['mouseenter', 'touchstart'].includes(ev?.type)) {
      setActive(true)
      return
    }
    setActive(false)
  }

  // Cleanup
  useEffect(
    () => () => {
      const currentRef = currentActiveItem.current
      if (!currentRef || !showPopover) return
      currentRef.removeEventListener('mouseenter', handleOnHover)
      currentRef.removeEventListener('mouseleave', handleOnHover)
      currentRef.removeEventListener('mousedown', handleOnHover)
      currentRef.removeEventListener('touchstart', handleOnHover)
      currentRef.removeEventListener('touchmove', handleOnHover)
      currentRef.removeEventListener('touchend', handleOnHover)
    },
    []
  )

  useEffect(() => {
    const currentRef = currentActiveItem.current
    if (!currentRef) return
    setBoxWidth(currentRef.clientWidth)
  }, [currentActiveItem?.current?.clientWidth])

  useEffect(() => {
    const currentRef = currentActiveItem.current
    if (!currentRef || !showPopover) return
    currentRef.addEventListener('mouseenter', handleOnHover)
    currentRef.addEventListener('mouseleave', handleOnHover)
    currentRef.addEventListener('mousedown', handleOnHover)
    currentRef.addEventListener('touchstart', handleOnHover)
    currentRef.addEventListener('touchmove', handleOnHover)
    currentRef.addEventListener('touchend', handleOnHover)
  }, [showPopover])

  const getContent = (
    <div
      className="drag-drop-item-match-list"
      data-cy={`drag-drop-item-${renderIndex}`}
      ref={currentActiveItem}
      style={getStyles({ flag, _preview: preview, correct, width })}
    >
      {correct !== undefined && preview && showAnswer && (
        <Index preview={preview} correct={correct}>
          {displayIndex}
        </Index>
      )}
      {itemView}
      {correct !== undefined && (
        <div style={{ marginRight: 15, opacity: preview ? '1' : '0' }}>
          {correct && <IconCheck aria-label=", Correct answer" />}
          {!correct && <IconClose aria-label=", Incorrect answer" />}
        </div>
      )}
    </div>
  )

  const dragItemProps = item
    ? {
        data: {
          item,
          sourceFlag: flag,
          sourceIndex: renderIndex,
        },
        flag,
        style: { margin, flex },
        key: item.value,
      }
    : {}

  const DragItemCont = item ? DragDrop.DragItem : Fragment

  return (
    <DragItemCont {...dragItemProps}>
      <Popover visible={showPopover && !!isActive} content={getContent}>
        {getContent}
      </Popover>
    </DragItemCont>
  )
}

export default DragItem
