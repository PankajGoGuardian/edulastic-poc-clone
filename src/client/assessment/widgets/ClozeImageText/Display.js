import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTheme } from 'styled-components'
import { isUndefined, get, maxBy } from 'lodash'
import {
  Stimulus,
  QuestionNumberLabel,
  AnswerContext,
  FlexContainer,
  QuestionLabelWrapper,
  QuestionContentWrapper,
  QuestionSubLabel,
} from '@edulastic/common'

import { clozeImage } from '@edulastic/constants'
import CorrectAnswerBoxLayout from './components/CorrectAnswerBox'

import CheckboxTemplateBoxLayout from './components/CheckboxTemplateBoxLayout'
import TextInput from './components/TextInput'
import { StyledPreviewTemplateBox } from './styled/StyledPreviewTemplateBox'
import { StyledPreviewContainer } from './styled/StyledPreviewContainer'
import { StyledPreviewImage } from './styled/StyledPreviewImage'
import { StyledDisplayContainer } from './styled/StyledDisplayContainer'
import { TemplateBoxContainer } from './styled/TemplateBoxContainer'
import { TemplateBoxLayoutContainer } from './styled/TemplateBoxLayoutContainer'
import { getFontSize } from '../../utils/helpers'
import Instructions from '../../components/Instructions'
import { Pointer } from '../../styled/Pointer'
import { Triangle } from '../../styled/Triangle'
import { Point } from '../../styled/Point'
import { EDIT } from '../../constants/constantsForQuestions'

class Display extends Component {
  static contextType = AnswerContext

  onChangeHandler = (value, id) => {
    const { isAnswerModifiable } = this.context
    if (!isAnswerModifiable) return
    const { onChange: changeAnswers } = this.props
    let { userAnswers: newAnswers } = this.props
    if (!newAnswers) {
      newAnswers = {}
    }
    newAnswers[id] = value
    changeAnswers(newAnswers)
  }

  getWidth = () => {
    const { item } = this.props
    const { imageOriginalWidth, imageWidth } = item
    const { maxWidth } = clozeImage

    // If image uploaded is smaller than the max width, keep it as-is
    // If image is larger, compress it to max width (keep aspect-ratio by default)
    // If user changes image size manually to something larger, allow it

    if (!isUndefined(imageWidth)) {
      return imageWidth > 0 ? imageWidth : maxWidth
    }

    if (!isUndefined(imageOriginalWidth) && imageOriginalWidth < maxWidth) {
      return imageOriginalWidth
    }
    if (!isUndefined(imageOriginalWidth) && imageOriginalWidth >= maxWidth) {
      return maxWidth
    }
    return maxWidth
  }

  getHeight = () => {
    const { item } = this.props
    const {
      imageHeight,
      keepAspectRatio,
      imageOriginalHeight,
      imageOriginalWidth,
    } = item
    const { maxHeight } = clozeImage
    const imageWidth = this.getWidth()
    // If image uploaded is smaller than the max width, keep it as-is
    // If image is larger, compress it to max width (keep aspect-ratio by default)
    // If user changes image size manually to something larger, allow it
    if (keepAspectRatio && !isUndefined(imageOriginalHeight)) {
      return (imageOriginalHeight * imageWidth) / imageOriginalWidth
    }

    if (!isUndefined(imageHeight)) {
      return imageHeight > 0 ? imageHeight : maxHeight
    }

    if (!isUndefined(imageHeight)) {
      return imageHeight > 0 ? imageHeight : maxHeight
    }

    if (!isUndefined(imageOriginalHeight) && imageOriginalHeight < maxHeight) {
      return imageOriginalHeight
    }

    return maxHeight
  }

  getResponseBoxMaxValues = () => {
    const { responseContainers } = this.props
    if (responseContainers.length > 0) {
      const maxTop = maxBy(responseContainers, (res) => res.top)
      const maxLeft = maxBy(responseContainers, (res) => res.left)
      return {
        responseBoxMaxTop: maxTop.top + maxTop.height,
        responseBoxMaxLeft: maxLeft.left + maxLeft.width,
      }
    }

    return { responseBoxMaxTop: 0, responseBoxMaxLeft: 0 }
  }

  onClickCheckboxHandler = () => {
    const { changePreview, changePreviewTab } = this.props
    if (changePreview) {
      changePreview('clear')
    }
    changePreviewTab('clear')
  }

  render() {
    const {
      question,
      uiStyle,
      showAnswer,
      checkAnswer,
      validation,
      evaluation,
      imageUrl,
      responseContainers,
      imageAlterText,
      showDashedBorder,
      backgroundColor,
      theme,
      item,
      showQuestionNumber,
      disableResponse,
      imageOptions,
      isExpressGrader,
      view,
      hideInternalOverflow,
      isPrintPreview,
      userAnswers,
      setAnswers,
      hideCorrectAnswer,
      showAnswerScore,
      answerScore,
    } = this.props

    const showDropItemBorder = get(item, 'responseLayout.showborder', false)
    // Layout Options
    const fontSize = getFontSize(uiStyle.fontsize)
    const { validationStemNumeration: stemNumeration } = uiStyle

    const imageWidth = this.getWidth()
    const imageHeight = this.getHeight()
    let canvasHeight = imageHeight + (imageOptions.y || 0)
    let canvasWidth = imageWidth + (imageOptions.x || 0)

    const {
      responseBoxMaxTop,
      responseBoxMaxLeft,
    } = this.getResponseBoxMaxValues()

    if (canvasHeight < responseBoxMaxTop) {
      canvasHeight = responseBoxMaxTop + 20
    }

    if (canvasWidth < responseBoxMaxLeft) {
      canvasWidth = responseBoxMaxLeft
    }

    canvasHeight =
      canvasHeight > clozeImage.maxHeight ? canvasHeight : clozeImage.maxHeight
    canvasWidth =
      canvasWidth > clozeImage.maxWidth ? canvasWidth : clozeImage.maxWidth

    const previewTemplateBoxLayout = (
      <StyledPreviewTemplateBox fontSize={fontSize} height={canvasHeight}>
        <StyledPreviewContainer
          data-cy="image-text-answer-board"
          width={canvasWidth}
          height={canvasHeight}
        >
          <StyledPreviewImage
            imageSrc={imageUrl || ''}
            width={this.getWidth()}
            height={this.getHeight()}
            heighcanvasDimensionst={imageHeight}
            alt={imageAlterText}
            aria-label={imageAlterText}
            setAnswers={setAnswers}
            style={{
              position: 'absolute',
              top: imageOptions.y || 0,
              left: imageOptions.x || 0,
            }}
          />
          {responseContainers.map((responseContainer) => {
            const btnStyle = {
              fontSize,
              width: responseContainer.width || uiStyle.widthpx || 'auto',
              height: responseContainer.height || uiStyle.height || 'auto',
              top: uiStyle.top || responseContainer.top,
              left: uiStyle.left || responseContainer.left,
              border: showDropItemBorder
                ? showDashedBorder
                  ? `dashed 2px ${theme.widgets.clozeImageText.responseContainerDashedBorderColor}`
                  : `solid 1px ${theme.widgets.clozeImageText.responseContainerSolidBorderColor}`
                : 0,
              position: 'absolute',
              background: backgroundColor,
              borderRadius: 5,
              display: 'inline-flex',
            }
            const responseWidth = parseInt(responseContainer.width, 10)

            return (
              <div style={btnStyle} key={responseContainer.id}>
                <Pointer
                  className={responseContainer.pointerPosition}
                  width={responseContainer.width}
                >
                  <Point />
                  <Triangle />
                </Pointer>
                <TextInput
                  disabled={disableResponse}
                  noIndent={responseWidth < 30}
                  lessPadding={responseWidth <= 43}
                  isMultiple={item.multiple_line}
                  characterMap={item.characterMap}
                  background={item.background}
                  onChange={(value) =>
                    this.onChangeHandler(value, responseContainer.id)
                  }
                  placeholder={
                    responseContainer.placeholder || uiStyle.placeholder
                  }
                  type={uiStyle.inputtype}
                  value={userAnswers[responseContainer.id]}
                  altText={responseContainer.label}
                />
              </div>
            )
          })}
        </StyledPreviewContainer>
      </StyledPreviewTemplateBox>
    )

    const checkboxTemplateBoxLayout = (
      <CheckboxTemplateBoxLayout
        responseContainers={responseContainers}
        backgroundColor={item.background}
        imageUrl={imageUrl || ''}
        imageWidth={this.getWidth()}
        imageHeight={this.getHeight()}
        canvasHeight={canvasHeight}
        canvasWidth={canvasWidth}
        imageAlterText={imageAlterText}
        stemNumeration={stemNumeration}
        fontSize={fontSize}
        imageOptions={imageOptions}
        showAnswer={showAnswer}
        checkAnswer={checkAnswer}
        userAnswers={userAnswers}
        evaluation={evaluation}
        uiStyle={uiStyle}
        onClickHandler={this.onClickCheckboxHandler}
        isExpressGrader={isExpressGrader}
        isPrintPreview={isPrintPreview}
        answerScore={answerScore}
      />
    )
    const templateBoxLayout =
      showAnswer || checkAnswer
        ? checkboxTemplateBoxLayout
        : previewTemplateBoxLayout
    const altResponses = validation.altResponses || []
    const singleResponseBox =
      responseContainers && responseContainers.length === 1

    const correctAnswerBoxLayout = (
      <>
        <CorrectAnswerBoxLayout
          fontSize={fontSize}
          userAnswers={
            validation.validResponse && validation.validResponse.value
          }
          responseContainers={responseContainers}
          stemNumeration={stemNumeration}
          width="100%"
          showAnswerScore={showAnswerScore}
          score={validation?.validResponse?.score}
          singleResponseBox={singleResponseBox}
        />
        {altResponses.map((altResponse, index) => (
          <CorrectAnswerBoxLayout
            fontSize={fontSize}
            responseContainers={responseContainers}
            userAnswers={altResponse.value}
            altAnsIndex={index + 1}
            stemNumeration={stemNumeration}
            width="100%"
            showAnswerScore={showAnswerScore}
            score={altResponse?.score}
            singleResponseBox={singleResponseBox}
          />
        ))}
      </>
    )
    const answerBox =
      (showAnswer || isExpressGrader) && !hideCorrectAnswer ? (
        correctAnswerBoxLayout
      ) : (
        <div />
      )
    return (
      <StyledDisplayContainer fontSize={fontSize}>
        <FlexContainer alignItems="baseline" justifyContent="flex-start">
          <QuestionLabelWrapper>
            {showQuestionNumber && (
              <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>
            )}
            {item.qSubLabel && (
              <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>
            )}
          </QuestionLabelWrapper>

          <QuestionContentWrapper showQuestionNumber={showQuestionNumber}>
            <Stimulus dangerouslySetInnerHTML={{ __html: question }} />
            <TemplateBoxContainer
              hideInternalOverflow={hideInternalOverflow}
              flexDirection="column"
            >
              <TemplateBoxLayoutContainer>
                {templateBoxLayout}
              </TemplateBoxLayoutContainer>
            </TemplateBoxContainer>
            {view && view !== EDIT && <Instructions item={item} />}
            {answerBox}
          </QuestionContentWrapper>
        </FlexContainer>
      </StyledDisplayContainer>
    )
  }
}

Display.propTypes = {
  changePreview: PropTypes.func,
  onChange: PropTypes.func,
  showAnswer: PropTypes.bool,
  responseContainers: PropTypes.array,
  userAnswers: PropTypes.object.isRequired,
  checkAnswer: PropTypes.bool,
  showDashedBorder: PropTypes.bool,
  question: PropTypes.string.isRequired,
  validation: PropTypes.object,
  evaluation: PropTypes.object,
  backgroundColor: PropTypes.string,
  uiStyle: PropTypes.object,
  imageUrl: PropTypes.string,
  disableResponse: PropTypes.bool,
  imageAlterText: PropTypes.string,
  imageWidth: PropTypes.number,
  theme: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  showQuestionNumber: PropTypes.bool,
  isExpressGrader: PropTypes.bool,
  changePreviewTab: PropTypes.func,
  imageOptions: PropTypes.object,
}

Display.defaultProps = {
  changePreviewTab: () => {},
  changePreview: () => {},
  onChange: () => {},
  showAnswer: false,
  evaluation: {},
  checkAnswer: false,
  responseContainers: [],
  disableResponse: false,
  showDashedBorder: false,
  backgroundColor: '#0288d1',
  validation: {},
  imageUrl: undefined,
  imageAlterText: '',
  imageWidth: 600,
  uiStyle: {
    fontsize: 'normal',
    stemNumeration: 'numerical',
    width: 0,
    height: 0,
    wordwrap: false,
  },
  showQuestionNumber: false,
  imageOptions: {},
  isExpressGrader: false,
}

export default withTheme(Display)
