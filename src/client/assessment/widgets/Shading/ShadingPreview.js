import React, { Fragment, useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { cloneDeep, get, isEmpty } from 'lodash'
import { Select } from 'antd'
import { compose } from 'redux'
import styled, { withTheme } from 'styled-components'
import {
  Stimulus,
  FlexContainer,
  CorrectAnswersContainer,
  QuestionNumberLabel,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper,
} from '@edulastic/common'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import { withNamespaces } from '@edulastic/localization'
import { QuestionStimulusWrapper } from './styled/QuestionStimulus'
import {
  PREVIEW,
  BY_LOCATION_METHOD,
  BY_COUNT_METHOD,
  EDIT,
  CLEAR,
  CHECK,
  SHOW,
} from '../../constants/constantsForQuestions'
import Instructions from '../../components/Instructions'
import { Subtitle } from '../../styled/Subtitle'

import ShadesView from './components/ShadesView'
import { getFontSize } from '../../utils/helpers'
import { StyledPaperWrapper } from '../../styled/Widget'
import { SelectInputStyled, TextInputStyled } from '../../styled/InputStyles'

const { Option } = Select

const ShadingPreview = ({
  view,
  item,
  smallSize,
  saveAnswer,
  userAnswer,
  method,
  t,
  previewTab,
  theme,
  showQuestionNumber,
  disableResponse,
  evaluation,
  hideCorrectAnswer,
  showAnswerScore,
}) => {
  const { canvas, validation } = item
  const fontSize = getFontSize(get(item, 'uiStyle.fontsize'))

  const [isCheck, setIsCheck] = useState(false)

  const cell_width = canvas ? canvas.cell_width : 1
  const cell_height = canvas ? canvas.cell_height : 1
  const rowCount = canvas ? canvas.rowCount : 1
  const columnCount = canvas ? canvas.columnCount : 1
  const shaded = canvas ? canvas.shaded : []
  const read_only_author_cells = canvas ? canvas.read_only_author_cells : false

  const isEvaluationEmpty = useMemo(() => isEmpty(evaluation), [evaluation])

  useEffect(() => {
    if (view === PREVIEW && userAnswer.length === 0) {
      if (!read_only_author_cells) {
        saveAnswer(cloneDeep(shaded))
      }
    }
  }, [view])

  useEffect(() => {
    if (
      previewTab === CLEAR &&
      view !== EDIT &&
      isCheck &&
      userAnswer.length === 0
    ) {
      if (!read_only_author_cells) {
        saveAnswer(cloneDeep(shaded))
      } else {
        saveAnswer([])
      }
    }
    if (previewTab === CHECK || previewTab === SHOW) {
      setIsCheck(true)
    } else {
      setIsCheck(false)
    }
  }, [previewTab])

  useEffect(() => {
    setIsCheck(false)
  }, [userAnswer])

  useEffect(() => {
    if (previewTab === CHECK || previewTab === SHOW) {
      setIsCheck(true)
    } else {
      setIsCheck(false)
    }
  }, [evaluation])

  const handleCellClick = (rowNumber, colNumber) => () => {
    const newUserAnswer = cloneDeep(userAnswer)

    const indexOfSameShade = newUserAnswer.findIndex(
      (shade) => shade[0] === rowNumber && shade[1] === colNumber
    )

    if (indexOfSameShade === -1) {
      newUserAnswer.push([rowNumber, colNumber])
    } else {
      newUserAnswer.splice(indexOfSameShade, 1)
    }

    if (
      item.maxSelection &&
      newUserAnswer.length > item.maxSelection &&
      view === PREVIEW
    ) {
      return
    }

    saveAnswer(newUserAnswer)
  }

  const handleSelectMethod = (value) => {
    saveAnswer(value, true)
  }

  const renderProps = {
    marginTop: smallSize ? 10 : 0,
    cellWidth: smallSize ? 1 : cell_width,
    cellHeight: smallSize ? 1 : cell_height,
    rowCount: smallSize ? 3 : rowCount,
    colCount: smallSize ? 8 : columnCount,
    border: item.border,
    hover: item.hover,
    hidden: get(item, 'canvas.hidden', []),
  }

  const correctAnswers = (Array.isArray(userAnswer)
    ? userAnswer
    : userAnswer && Array.isArray(userAnswer.value)
    ? userAnswer.value
    : []
  ).filter((value, i) => evaluation && evaluation[i])

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
          <FlexContainer
            alignItems="flex-start"
            flexDirection="column"
            padding="15px"
          >
            {view === EDIT && (
              <>
                <Subtitle
                  id={getFormattedAttrId(
                    `${item?.title}-${t('component.shading.methodSubtitle')}`
                  )}
                  fontSize={theme.widgets.shading.subtitleFontSize}
                  color={theme.widgets.shading.subtitleColor}
                  margin="0"
                >
                  {t('component.shading.methodSubtitle')}
                </Subtitle>
                <SelectInputStyled
                  width="140px"
                  margin="15px 0px"
                  value={method}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  onChange={handleSelectMethod}
                >
                  <Option value={BY_LOCATION_METHOD}>
                    {BY_LOCATION_METHOD}
                  </Option>
                  <Option value={BY_COUNT_METHOD}>{BY_COUNT_METHOD}</Option>
                </SelectInputStyled>

                {method === BY_LOCATION_METHOD ? (
                  <ShadesView
                    {...renderProps}
                    onCellClick={handleCellClick}
                    shaded={Array.isArray(userAnswer) ? userAnswer : []}
                    lockedCells={read_only_author_cells ? shaded : undefined}
                  />
                ) : (
                  <TextInputStyled
                    size="large"
                    type="number"
                    width="320px"
                    value={Array.isArray(userAnswer?.[0]) ? 1 : userAnswer?.[0]}
                    onChange={(e) =>
                      saveAnswer([e.target.value > 0 ? +e.target.value : 1])
                    }
                  />
                )}
              </>
            )}

            {view === PREVIEW && (
              <ShadesView
                {...renderProps}
                checkAnswers={isCheck}
                correctAnswers={correctAnswers}
                onCellClick={disableResponse ? () => {} : handleCellClick}
                shaded={Array.isArray(userAnswer) ? userAnswer : []}
                lockedCells={read_only_author_cells ? shaded : undefined}
                isEvaluationEmpty={isEvaluationEmpty}
              />
            )}
          </FlexContainer>
          {view !== EDIT && <Instructions item={item} />}
          {previewTab === SHOW && !hideCorrectAnswer && (
            <>
              <CorrectAnswersContainer
                showAnswerScore={showAnswerScore}
                score={validation?.validResponse?.score}
                title={t('component.shading.correctAnswer')}
              >
                <CorrectAnswerBlock>
                  {validation.validResponse.method === BY_LOCATION_METHOD ? (
                    <ShadesView
                      {...renderProps}
                      correctAnswers={validation.validResponse.value}
                      showAnswers
                      onCellClick={() => {}}
                      shaded={[]}
                      lockedCells={read_only_author_cells ? shaded : undefined}
                    />
                  ) : (
                    <>Any {validation.validResponse.value} cells</>
                  )}
                </CorrectAnswerBlock>
              </CorrectAnswersContainer>

              {validation.altResponses &&
                validation.altResponses.map((altAnswer, i) => (
                  <CorrectAnswersContainer
                    showAnswerScore={showAnswerScore}
                    score={altAnswer?.score}
                    title={`${t('component.shading.alternateAnswer')} ${i + 1}`}
                  >
                    <CorrectAnswerBlock>
                      {altAnswer.method === BY_LOCATION_METHOD ? (
                        <ShadesView
                          {...renderProps}
                          correctAnswers={altAnswer.value}
                          showAnswers
                          onCellClick={() => {}}
                          shaded={[]}
                          lockedCells={
                            read_only_author_cells ? shaded : undefined
                          }
                        />
                      ) : (
                        <>Any {altAnswer.value} cells</>
                      )}
                    </CorrectAnswerBlock>
                  </CorrectAnswersContainer>
                ))}
            </>
          )}
        </QuestionContentWrapper>
      </FlexContainer>
    </StyledPaperWrapper>
  )
}

ShadingPreview.propTypes = {
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.any,
  method: PropTypes.string,
  previewTab: PropTypes.string,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  showQuestionNumber: PropTypes.bool,
  disableResponse: PropTypes.bool,
  evaluation: PropTypes.any,
}

ShadingPreview.defaultProps = {
  smallSize: false,
  userAnswer: null,
  previewTab: CLEAR,
  method: '',
  showQuestionNumber: false,
  disableResponse: false,
  evaluation: null,
}

const enhance = compose(withNamespaces('assessment'), withTheme)

export default enhance(ShadingPreview)

const CorrectAnswerBlock = styled.div`
  padding-left: 20px;
`
