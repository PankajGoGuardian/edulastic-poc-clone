import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import { get } from 'lodash'
import { response } from '@edulastic/constants'
import { DragDrop } from '@edulastic/common'
import TextContainer from './TextContainer'
import { getEvalautionColor } from '../../../../utils/evaluation'

import { Pointer } from '../../../../styled/Pointer'
import { Point } from '../../../../styled/Point'
import { Triangle } from '../../../../styled/Triangle'

import { IconWrapper } from './styled/IconWrapper'
import { WithPopover } from './WithPopover'
import { AnswerBox } from './styled/AnswerBox'
import { IndexBox } from './styled/IndexBox'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
const { DropContainer } = DragDrop

const CheckboxTemplateBox = ({
  index,
  showAnswer,
  checkAnswer,
  responseContainers,
  responseContainer,
  responsecontainerindividuals,
  responseBtnStyle,
  userSelections,
  stemNumeration,
  evaluation,
  onDropHandler,
  disableResponse,
  isSnapFitValues,
  isExpressGrader,
  lessMinWidth,
  fontSize,
  isPrintPreview = false,
  options = [],
  answerScore,
  idValueMap = {},
}) => {
  const {
    height: respHeight,
    width: respWidth,
    left: respLeft,
    top: respTop,
  } = responseContainer

  const userAnswer = useMemo(() => {
    const answersIds = userSelections[index]?.optionIds || []
    const answerValues = answersIds.map((id) => idValueMap[id])
    return answerValues.join(' ')
  }, [index, options])

  const isChecked =
    get(userSelections, `[${index}].responseBoxID`, false) &&
    !!get(userSelections, `[${index}].optionIds`, []).length &&
    evaluation[index] !== undefined

  const { fillColor, mark, indexBgColor } = getEvalautionColor(
    answerScore,
    evaluation[index],
    isChecked,
    responseContainers?.length === evaluation?.length &&
      evaluation?.every((e) => e)
  )

  const btnStyle = {
    widthpx: respWidth,
    top: respTop,
    left: respLeft,
    position: 'absolute',
    borderRadius: 5,
  }

  if (responseBtnStyle && responseBtnStyle) {
    btnStyle.width = responseBtnStyle.widthpx
  } else {
    btnStyle.width = btnStyle.widthpx
  }

  if (responsecontainerindividuals && responsecontainerindividuals[index]) {
    const { widthpx } = responsecontainerindividuals[index]
    btnStyle.width = widthpx
    btnStyle.widthpx = widthpx
  }

  let indexStr = ''
  switch (stemNumeration) {
    case 'lowercase': {
      indexStr = ALPHABET[index]
      break
    }
    case 'uppercase': {
      indexStr = ALPHABET[index].toUpperCase()
      break
    }
    default:
      indexStr = index + 1
  }

  const dropContainerStyle = {
    ...btnStyle,
    width: respWidth,
    height: respHeight,
    minWidth: lessMinWidth
      ? parseInt(respWidth, 10) + 4
      : response.minWidthShowAnswer,
    maxWidth: response.maxWidth,
    background:
      !isChecked && !isSnapFitValues && (checkAnswer || showAnswer)
        ? 'lightgray'
        : null,
  }

  const icons = isSnapFitValues &&
    (checkAnswer || (showAnswer && !lessMinWidth)) && (
      <>
        {mark && <IconWrapper>{mark}</IconWrapper>}
        <Pointer
          className={responseContainer.pointerPosition}
          width={respWidth}
        >
          <Point />
          <Triangle />
        </Pointer>
      </>
    )

  const responseBoxIndex = showAnswer && (
    <IndexBox bgColor={indexBgColor}>{indexStr}</IndexBox>
  )

  return (
    <WithPopover
      fontSize={fontSize}
      containerDimensions={{ width: respWidth, height: respHeight }}
      index={index}
      userAnswer={userAnswer}
      checkAnswer={checkAnswer}
      indexStr={indexStr}
    >
      <DropContainer
        index={index}
        style={dropContainerStyle}
        drop={onDropHandler}
        disableResponse={disableResponse}
        noBorder
      >
        <AnswerBox isPrintPreview={isPrintPreview} fillColor={fillColor}>
          {responseBoxIndex}
          <TextContainer
            options={options}
            dropTargetIndex={index}
            userSelections={userSelections}
            isSnapFitValues={isSnapFitValues}
            showAnswer={showAnswer}
            checkAnswer={checkAnswer}
            lessMinWidth={lessMinWidth}
            style={
              checkAnswer
                ? {
                    borderRadius: 5,
                    justifyContent: lessMinWidth ? 'flex-start' : 'center',
                    width: respWidth,
                    height: respHeight,
                  }
                : {
                    width: respWidth,
                    height: respHeight,
                  }
            }
            isExpressGrader={isExpressGrader}
            isPrintPreview={isPrintPreview}
          />
          {icons}
        </AnswerBox>
      </DropContainer>
    </WithPopover>
  )
}

const CheckboxTemplateBoxLayout = (props) => {
  const {
    checkAnswer,
    responseContainers,
    annotations,
    image,
    snapItems,
    isSnapFitValues,
    showDropItemBorder,
  } = props
  const lessMinWidth = responseContainers.some(
    (responseContainer) =>
      parseInt(responseContainer.width, 10) < response.minWidthShowAnswer
  )
  return (
    <>
      {annotations}
      {image}
      {snapItems}
      {responseContainers.map((responseContainer, index) => {
        if (!isSnapFitValues && checkAnswer && !showDropItemBorder) {
          return null
        }
        return (
          <CheckboxTemplateBox
            key={index}
            index={index}
            responseContainer={responseContainer}
            {...props}
            lessMinWidth={lessMinWidth}
          />
        )
      })}
    </>
  )
}

CheckboxTemplateBox.propTypes = {
  index: PropTypes.number.isRequired,
  responseContainer: PropTypes.object.isRequired,
  responsecontainerindividuals: PropTypes.array.isRequired,
  responseBtnStyle: PropTypes.object.isRequired,
  userSelections: PropTypes.array.isRequired,
  stemNumeration: PropTypes.string.isRequired,
  evaluation: PropTypes.array.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  onDropHandler: PropTypes.func.isRequired,
  disableResponse: PropTypes.bool.isRequired,
  lessMinWidth: PropTypes.bool.isRequired,
  isExpressGrader: PropTypes.bool.isRequired,
  isSnapFitValues: PropTypes.bool.isRequired,
}

CheckboxTemplateBoxLayout.propTypes = {
  responseContainers: PropTypes.array.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  annotations: PropTypes.any.isRequired,
  image: PropTypes.any.isRequired,
  snapItems: PropTypes.any.isRequired,
  isSnapFitValues: PropTypes.bool.isRequired,
  showDropItemBorder: PropTypes.bool.isRequired,
}

export default withTheme(React.memo(CheckboxTemplateBoxLayout))
