import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Popover } from 'antd'
import styled from 'styled-components'
import { greyThemeLight } from '@edulastic/colors'
import { DragDrop, MathSpan, measureText } from '@edulastic/common'
import { response as Dimensions } from '@edulastic/constants'
import getImageDimensionsHook from '../../../hooks/imageDimensions'
import { ResponseContainer } from '../styled/ResponseContainer'

const { DropContainer, DragItem } = DragDrop

const TemplateBox = ({ resprops, id }) => {
  if (!id) {
    return 'NOID'
  }
  const {
    hasGroupResponses,
    responsecontainerindividuals = [],
    responseBtnStyle,
    options,
    userAnswers,
    onDrop,
    responseIDs,
    isReviewTab,
    cAnswers,
    maxWidth,
  } = resprops
  const { index: dropTargetIndex } =
    responseIDs.find((response) => response.id === id) || {}
  const response =
    responsecontainerindividuals.find((resp) => resp.id === id) || {}
  const height =
    (response && response.heightpx) ||
    responseBtnStyle.heightpx ||
    Dimensions.minHeight
  const width =
    (response && response.widthpx) ||
    responseBtnStyle.widthpx ||
    Dimensions.minWidth
  const style = {
    ...responseBtnStyle,
    minHeight: response ? height : 'auto',
    maxHeight: response ? height : 'auto',
    minWidth: response ? width : 'auto',
    maxWidth: maxWidth || 'auto',
    padding: '5px',
  }

  const getData = (attr) => {
    const answers = isReviewTab ? cAnswers : userAnswers
    if (answers[dropTargetIndex]) {
      // group all the options together in case groupResponses is checked
      const source = hasGroupResponses
        ? options.flatMap((_) => _.options)
        : options
      // when groupResponses is checked, it has an object having data
      // else it is a plain string
      const key = hasGroupResponses
        ? answers[dropTargetIndex].data
        : answers[dropTargetIndex]
      const foundedItem = source.find((option) => option.value === key)
      if (foundedItem) {
        return attr === 'value' ? foundedItem.value : foundedItem.label
      }
    }
  }

  const getDataForGroup = (attr) => {
    const answers = isReviewTab ? cAnswers : userAnswers
    if (answers[dropTargetIndex] && answers[dropTargetIndex].data) {
      const foundedGroup = options.find((option) =>
        option.options.find(
          (inOption) => inOption.value === answers[dropTargetIndex].data
        )
      )
      if (foundedGroup) {
        const foundItem = foundedGroup.options.find(
          (inOption) => inOption.value === answers[dropTargetIndex].data
        )
        if (foundItem) {
          return attr === 'value' ? foundItem.value : foundItem.label
        }
      }
    }
  }

  const label = getData('label' || '')
  const imageDimensions = getImageDimensionsHook(label)

  const boxHeight = response ? height : responseBtnStyle.heightpx
  const {
    scrollWidth: contentWidth,
    scrollHeight: contentHeight,
  } = measureText(label, style)

  const content = useMemo(() => {
    return <MathSpan dangerouslySetInnerHTML={{ __html: label }} />
  }, [label])

  const widthOverflow = contentWidth > style.maxWidth
  const heightOverflow =
    imageDimensions.height > boxHeight || contentHeight > boxHeight
  const showPopover = label && (widthOverflow || heightOverflow)

  const itemValue = !hasGroupResponses
    ? getData('value')
    : getDataForGroup('value')

  const itemData = !hasGroupResponses
    ? `${itemValue}_${dropTargetIndex}_fromResp`
    : `${itemValue}_${
        userAnswers[dropTargetIndex] && userAnswers[dropTargetIndex].group
      }_${dropTargetIndex}_fromResp`

  return (
    <StyledDropContainer
      drop={onDrop}
      showHoverBorder
      borderColor={greyThemeLight}
      minHeight={boxHeight}
      maxHeight={Dimensions.maxHeight}
      minWidth={style.minWidth}
      maxWidth={style.maxWidth}
      index={dropTargetIndex}
    >
      {itemValue && (
        <StyledDragItem data={itemData}>
          <ResponseContainer>
            {showPopover && (
              <Popover placement="bottomLeft" content={content}>
                {content}
              </Popover>
            )}
            {!showPopover && content}
          </ResponseContainer>
        </StyledDragItem>
      )}
    </StyledDropContainer>
  )
}

TemplateBox.propTypes = {
  resprops: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
}

export default TemplateBox

const StyledDropContainer = styled(DropContainer)`
  display: inline-flex;
  vertical-align: middle;
  white-space: nowrap;
  min-height: ${({ minHeight }) => minHeight}px;
  max-height: ${({ maxHeight }) => maxHeight}px;
  min-width: ${({ minWidth }) => minWidth}px;
  max-width: ${({ maxWidth }) => maxWidth}px;
`

const StyledDragItem = styled(DragItem)`
  overflow-y: hidden;
`
