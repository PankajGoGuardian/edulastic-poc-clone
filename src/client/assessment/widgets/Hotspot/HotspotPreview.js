import React, { Fragment, useMemo } from 'react'
import PropTypes from 'prop-types'
import { cloneDeep, get, isEmpty } from 'lodash'

import {
  Stimulus,
  CorrectAnswersContainer,
  QuestionNumberLabel,
  FlexContainer,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'

import {
  PREVIEW,
  CLEAR,
  CHECK,
  SHOW,
  EDIT,
} from '../../constants/constantsForQuestions'
import Instructions from '../../components/Instructions'
import BlockContainer from './styled/BlockContainer'
import { Svg } from './styled/Svg'
import { Polygon } from './styled/Polygon'
import { getFontSize } from '../../utils/helpers'
import { QuestionStimulusWrapper } from './styled/QuestionStimulus'
import { ImageContainer } from './styled/ImageContainer'
import { StyledPaperWrapper } from '../../styled/Widget'

const HotspotPreview = ({
  view,
  item,
  smallSize,
  saveAnswer,
  userAnswer,
  previewTab,
  showQuestionNumber,
  disableResponse,
  t,
  evaluation,
  changePreviewTab,
  hideCorrectAnswer,
  isLCBView,
  showAnswerScore,
}) => {
  const {
    areas,
    areaAttributes,
    image,
    validation,
    multipleResponses,
    previewAreas,
  } = item
  const fontSize = getFontSize(get(item, 'uiStyle.fontsize'))
  const maxWidth = get(item, 'max_width', 900)

  const width = image ? image.width : 900
  const height = image ? image.height : 470
  const source = image ? image.source : ''

  const isEvaluationEmpty = useMemo(() => isEmpty(evaluation), [evaluation])

  const handleClick = (i) => () => {
    const newAnswer = cloneDeep(userAnswer)
    if (newAnswer.includes(i)) {
      newAnswer.splice(newAnswer.indexOf(i), 1)
    } else {
      newAnswer.push(i)
    }
    saveAnswer(
      multipleResponses ? (newAnswer.length > 0 ? newAnswer : userAnswer) : [i]
    )

    if (previewTab === CHECK || previewTab === SHOW) {
      changePreviewTab(CLEAR)
    }
  }

  const validAnswer =
    validation && validation.validResponse && validation.validResponse.value
  const altAnswers = (validation && validation.altResponses) || []

  const getStyles = (i) => ({
    fill: areaAttributes?.local?.find((attr) => attr.area === i)
      ? areaAttributes.local.find((attr) => attr.area === i).fill
      : areaAttributes.global.fill,
    stroke: areaAttributes?.local?.find((attr) => attr.area === i)
      ? areaAttributes.local.find((attr) => attr.area === i).stroke
      : areaAttributes.global.stroke,
  })

  return (
    <StyledPaperWrapper
      style={{ fontSize }}
      padding={smallSize}
      boxShadow={smallSize ? 'none' : ''}
    >
      <FlexContainer
        justifyContent="flex-start"
        alignItems="baseline"
        width="100%"
      >
        <QuestionLabelWrapper>
          {showQuestionNumber && (
            <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>
          )}
          {item.qSubLabel && (
            <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>
          )}
        </QuestionLabelWrapper>
        <QuestionContentWrapper showQuestionNumber={showQuestionNumber}>
          <QuestionStimulusWrapper>
            {view === PREVIEW && !smallSize && (
              <Stimulus
                data-cy="stimulus"
                dangerouslySetInnerHTML={{ __html: item.stimulus }}
              />
            )}
          </QuestionStimulusWrapper>

          <BlockContainer
            data-cy="hotspotMap"
            style={{ maxWidth }}
            width={+width}
            height={+height}
            justifyContent="center"
          >
            <ImageContainer
              src={source}
              width={+width}
              height={+height}
              left={0}
              top={0}
            />
            <Svg data-cy="answer-container" width={+width} height={+height}>
              {areas &&
                areas.map((area, i) => (
                  <Polygon
                    key={i}
                    isEvaluationEmpty={isEvaluationEmpty}
                    showAnswer={previewTab !== CLEAR && userAnswer.includes(i)}
                    onClick={!disableResponse ? handleClick(i) : () => {}}
                    points={area
                      .map((point) => `${point.x},${point.y}`)
                      .join(' ')}
                    selected={userAnswer.includes(i)}
                    correct={
                      evaluation[userAnswer.findIndex((val) => i === val)]
                    }
                    {...getStyles(i)}
                  />
                ))}
            </Svg>
          </BlockContainer>
          {view !== EDIT && <Instructions item={item} />}
          {previewTab === 'show' && !hideCorrectAnswer && !smallSize && (
            <>
              <CorrectAnswersContainer
                title={t('component.graphing.correctAnswer')}
                padding="15px 25px 20px"
                minHeight="auto"
                titleMargin="0px 0px 12px"
                isLCBView={isLCBView}
                score={validation?.validResponse?.score}
                showAnswerScore={showAnswerScore}
              >
                <BlockContainer
                  data-cy="hotspotMap"
                  style={{ maxWidth }}
                  width={+width}
                  height={+height}
                  justifyContent="center"
                  ml="20px"
                >
                  <ImageContainer
                    src={source}
                    width={+width}
                    height={+height}
                    left={0}
                    top={0}
                  />
                  <Svg
                    data-cy="answer-container"
                    width={+width}
                    height={+height}
                  >
                    {areas &&
                      areas.map((area, i) => (
                        <Polygon
                          key={i}
                          showAnswer={validAnswer.includes(i)}
                          onClick={() => {}}
                          points={area
                            .map((point) => `${point.x},${point.y}`)
                            .join(' ')}
                          selected={validAnswer.includes(i)}
                          correct
                          {...getStyles(i)}
                        />
                      ))}
                  </Svg>
                </BlockContainer>
              </CorrectAnswersContainer>
              {altAnswers &&
                altAnswers.map((altAnswer, i) => (
                  <CorrectAnswersContainer
                    title={`${t('component.graphing.alternateAnswer')} ${
                      i + 1
                    }`}
                    isLCBView={isLCBView}
                    score={altAnswer?.score}
                    padding="15px 25px 20px"
                    minHeight="auto"
                    titleMargin="0px 0px 12px"
                    showAnswerScore={showAnswerScore}
                  >
                    <BlockContainer
                      data-cy="hotspotMap"
                      style={{ maxWidth }}
                      width={+width}
                      height={+height}
                      justifyContent="center"
                      ml="20px"
                    >
                      <ImageContainer
                        src={source}
                        width={+width}
                        height={+height}
                        left={0}
                        top={0}
                      />
                      <Svg
                        data-cy="answer-container"
                        width={+width}
                        height={+height}
                      >
                        {areas &&
                          areas.map((area, altIndex) => (
                            <Polygon
                              key={i}
                              showAnswer={altAnswer.value.includes(altIndex)}
                              onClick={() => {}}
                              points={area
                                .map((point) => `${point.x},${point.y}`)
                                .join(' ')}
                              selected={altAnswer.value.includes(altIndex)}
                              correct
                              {...getStyles(altIndex)}
                            />
                          ))}
                      </Svg>
                    </BlockContainer>
                  </CorrectAnswersContainer>
                ))}
            </>
          )}
          {smallSize && (
            <BlockContainer width={320} height={170} justifyContent="center">
              <ImageContainer
                src={source}
                width={320}
                height={170}
                left={0}
                top={0}
              />
              <Svg data-cy="answer-container" width={320} height={170}>
                {previewAreas.map((areaPreviewPoints, i) => (
                  <Polygon
                    key={i}
                    onClick={handleClick(i)}
                    points={areaPreviewPoints
                      .map((point) => `${point.x},${point.y}`)
                      .join(' ')}
                    fill={areaAttributes.global.fill}
                    stroke={areaAttributes.global.stroke}
                  />
                ))}
              </Svg>
            </BlockContainer>
          )}
        </QuestionContentWrapper>
      </FlexContainer>
    </StyledPaperWrapper>
  )
}

HotspotPreview.propTypes = {
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  previewTab: PropTypes.string,
  userAnswer: PropTypes.array,
  showQuestionNumber: PropTypes.bool,
  disableResponse: PropTypes.bool,
  evaluation: PropTypes.array,
  changePreviewTab: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  showAnswerScore: PropTypes.bool,
}

HotspotPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  userAnswer: [],
  showQuestionNumber: false,
  disableResponse: false,
  evaluation: [],
  showAnswerScore: false,
}

export default withNamespaces('assessment')(HotspotPreview)
