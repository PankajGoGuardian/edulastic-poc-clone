import React from 'react'
import { withTheme } from 'styled-components'
import { response } from '@edulastic/constants'
import { DragDrop } from '@edulastic/common'
import { Pointer } from '../../../styled/Pointer'
import { Point } from '../../../styled/Point'
import { Triangle } from '../../../styled/Triangle'

import AnswerContainer from './AnswerContainer'

const { DragItem, DropContainer } = DragDrop

const ResponseContainers = ({
  responseContainers,
  showDropItemBorder,
  smallSize,
  isWrapText,
  transparentBackground,
  theme,
  userAnswers,
  showDashedBorder,
  dragItemStyle,
  onDrop,
  fontSize,
  isPrintMode,
  imageWidth,
  imageHeight,
  options,
  backgroundColor = '',
}) => {
  const getContainerStyle = (container) => {
    const responseContainerLeft = smallSize
      ? container.left / 2
      : container.left
    const top = smallSize ? container.top / 2 : container.top
    const width = container.width || response.minWidth
    // setting min-height so no need to set auto, height 35px is default (required) value getting set in display section
    const height = isWrapText ? '35px' : container.height || '35px'
    const btnStyle = {
      position: 'absolute',
      top: isPrintMode ? `${(top / imageHeight) * 100}%` : top,
      left: isPrintMode
        ? `${(responseContainerLeft / imageWidth) * 100}%`
        : responseContainerLeft,
      maxWidth: response.maxWidth,
      width: isPrintMode ? `${(width / imageWidth) * 100}%` : width,
      minHeight:
        isPrintMode && !`${height}`.includes('auto')
          ? `${(height / imageHeight) * 100}%`
          : height,
      background: transparentBackground
        ? 'transparent'
        : backgroundColor ||
          theme.widgets.clozeImageDragDrop.responseBoxBgColor,
      border: showDropItemBorder
        ? showDashedBorder
          ? `dashed 2px ${theme.widgets.clozeImageDragDrop.dropContainerDashedBorderColor}`
          : `solid 1px ${theme.widgets.clozeImageDragDrop.dropContainerSolidBorderColor}`
        : 'unset',
      borderRadius: 5,
      display: 'flex',
      padding: '5px',
      zIndex: 21,
    }

    return btnStyle
  }

  return responseContainers.map((container, index) => {
    const userAnswer =
      userAnswers.find((ans) => ans?.responseBoxID === container.id) || {}
    const { optionIds = [] } = userAnswer
    const answers = optionIds.reduce((acc, id) => {
      const option = options.find((opt) => opt.id === id)
      if (option) {
        acc.push(option)
      }
      return acc
    }, [])

    return (
      <div style={{ position: 'relative' }}>
        <DropContainer
          key={container.id}
          style={getContainerStyle(container)}
          drop={onDrop}
          index={index}
        >
          {container.label && (
            <span className="sr-only">Drop target {container.label}</span>
          )}
          {answers.map((answer, item_index) => (
            <DragItem
              style={dragItemStyle}
              key={answer.id}
              data={{
                option: answer,
                fromContainerIndex: index,
                fromRespIndex: item_index,
              }}
            >
              <AnswerContainer
                fontSize={fontSize}
                answer={answer.value}
                height={container.height}
                width={container.width}
              />
            </DragItem>
          ))}
          <Pointer
            className={container.pointerPosition}
            width={container.width}
          >
            <Point />
            <Triangle />
          </Pointer>
        </DropContainer>
      </div>
    )
  })
}

export default withTheme(ResponseContainers)
