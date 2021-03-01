import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { helpers } from '@edulastic/common'
import { response } from '@edulastic/constants'
import { ThemeContext } from 'styled-components'
import { StyledPreviewImage } from '../../styled/StyledPreviewImage'
import { StyledPreviewTemplateBox } from '../../styled/StyledPreviewTemplateBox'
import { StyledPreviewContainer } from '../../styled/StyledPreviewContainer'

import Response from './components/Response'

const CheckboxTemplateBoxLayout = ({
  showAnswer,
  checkAnswer,
  responseContainers,
  imageAlterText,
  userAnswers,
  stemNumeration,
  evaluation,
  fontSize,
  imageUrl,
  imageOptions,
  imageWidth,
  imageHeight,
  canvasHeight,
  canvasWidth,
  backgroundColor,
  onClickHandler,
  isExpressGrader,
  isPrintPreview,
  answerScore,
}) => {
  const {
    answerBox: { borderWidth, borderStyle, borderColor, borderRadius },
  } = useContext(ThemeContext)
  const allCorrect =
    responseContainers?.length === Object.keys(evaluation)?.length &&
    Object.keys(evaluation)?.every((id) => evaluation[id])

  return (
    <StyledPreviewTemplateBox fontSize={fontSize} height={canvasHeight}>
      <StyledPreviewContainer
        data-cy="image-text-preview-board"
        width={canvasWidth}
        height={canvasHeight}
      >
        <StyledPreviewImage
          imageSrc={imageUrl || ''}
          width={imageWidth}
          height={imageHeight}
          heighcanvasDimensionst={imageHeight}
          alt={imageAlterText}
          style={{
            position: 'absolute',
            top: imageOptions.y || 0,
            left: imageOptions.x || 0,
          }}
        />
        {responseContainers.map((responseContainer, index) => {
          const responseBoxId = responseContainer.id
          const btnStyle = {
            width: responseContainer.width,
            top: responseContainer.top,
            left: responseContainer.left,
            height: responseContainer.height,
            position: 'absolute',
            backgroundColor,
            border: `${borderWidth} ${borderStyle} ${borderColor}`,
            borderRadius,
            display: 'flex',
          }

          const indexStr = helpers.getNumeration(index, stemNumeration)
          const status =
            evaluation[responseBoxId] !== undefined
              ? evaluation[responseBoxId]
                ? 'right'
                : 'wrong'
              : ''
          const lessMinWidth =
            parseInt(responseContainer.width, 10) < response.minWidthShowAnswer

          const userAnswer = userAnswers[responseContainer.id]
          const hasAnswered = !!userAnswer

          return (
            <Response
              showAnswer={showAnswer}
              responseContainer={responseContainer}
              btnStyle={btnStyle}
              userAnswer={userAnswer}
              hasAnswered={hasAnswered}
              userAnswers={userAnswers}
              onClickHandler={onClickHandler}
              status={status}
              indexStr={indexStr}
              lessMinWidth={lessMinWidth}
              checkAnswer={checkAnswer}
              isExpressGrader={isExpressGrader}
              isPrintPreview={isPrintPreview}
              answerScore={answerScore}
              allCorrect={allCorrect}
            />
          )
        })}
      </StyledPreviewContainer>
    </StyledPreviewTemplateBox>
  )
}
CheckboxTemplateBoxLayout.propTypes = {
  fontSize: PropTypes.string.isRequired,
  responseContainers: PropTypes.array.isRequired,
  imageOptions: PropTypes.object.isRequired,
  userAnswers: PropTypes.object.isRequired,
  stemNumeration: PropTypes.string.isRequired,
  evaluation: PropTypes.array.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  imageUrl: PropTypes.string.isRequired,
  imageAlterText: PropTypes.string.isRequired,
  imageHeight: PropTypes.number.isRequired,
  imageWidth: PropTypes.number.isRequired,
  canvasHeight: PropTypes.number.isRequired,
  canvasWidth: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  onClickHandler: PropTypes.func.isRequired,
  isExpressGrader: PropTypes.bool.isRequired,
}

export default React.memo(CheckboxTemplateBoxLayout)
