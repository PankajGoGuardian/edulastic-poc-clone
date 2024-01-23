import React, { Fragment, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get, cloneDeep } from 'lodash'

import {
  Stimulus,
  CorrectAnswersContainer,
  AnswerContext,
  QuestionNumberLabel,
  FlexContainer,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { questionType } from '@edulastic/constants'

import {
  setElementsStashAction,
  setStashIndexAction,
} from '../../actions/graphTools'
import {
  CLEAR,
  PREVIEW,
  SHOW,
  EDIT,
  CHECK,
} from '../../constants/constantsForQuestions'

import { getFontSize } from '../../utils/helpers'
import LineChart from './LineChart'
import BarChart from './BarChart'
import Histogram from './Histogram'
import DotPlot from './DotPlot'
import LinePlot from './LinePlot'
import { QuestionTitleWrapper } from './styled/QuestionNumber'
import { Tools } from './components/Tools'
import ChartEditTool from './components/ChartEditTool'
import { StyledPaperWrapper } from '../../styled/Widget'
import Instructions from '../../components/Instructions'
import { getFilteredAnswerData } from './helpers'

const ChartPreview = ({
  item,
  smallSize,
  saveAnswer,
  userAnswer,
  previewTab: _previewTab,
  view,
  showQuestionNumber,
  disableResponse,
  evaluation,
  t,
  tab,
  changePreviewTab,
  stash,
  stashIndex,
  setElementsStash,
  setStashIndex,
  setQuestionData,
  isReviewTab,
  hideCorrectAnswer,
  showAnswerScore,
}) => {
  const answerContextConfig = useContext(AnswerContext)
  const fontSize = getFontSize(get(item, 'uiStyle.fontsize'))
  const chartType = get(item, 'uiStyle.chartType')
  let previewTab = _previewTab
  const { expressGrader, isAnswerModifiable } = answerContextConfig
  /**
   * in expressGrader modal, previewTab is SHOW and expressGrader is true.
   * when the edit response is off, isAnswerModifiable is false and will show the correct answer
   * when the edit response is on, isAnswerModifiable is true and will hide the correct answer
   */
  if (expressGrader && !isAnswerModifiable) {
    previewTab = SHOW
  } else if (expressGrader && isAnswerModifiable) {
    previewTab = CLEAR
  }

  const { chart_data = {}, validation, uiStyle } = item
  const { data = [], name } = chart_data
  let CurrentChart = null

  const [tool, setTool] = useState('')

  const getStashId = () =>
    tab === 0 ? `${item.id}_${view}` : `alt-${tab}-${item.id}_${view}`

  const answerIsActual = () => {
    if (userAnswer.length !== data.length) {
      return false
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].x !== userAnswer[i].x) {
        return false
      }
    }
    return true
  }

  useEffect(() => {
    if (!answerIsActual()) {
      const answer = getFilteredAnswerData(data)
      saveAnswer(answer)
      setElementsStash(answer, getStashId())
    }
  }, [])

  switch (chartType) {
    case questionType.LINE_CHART:
      CurrentChart = LineChart
      break
    case questionType.BAR_CHART:
      CurrentChart = BarChart
      break
    case questionType.HISTOGRAM:
      CurrentChart = Histogram
      break
    case questionType.DOT_PLOT:
      CurrentChart = DotPlot
      break

    case questionType.LINE_PLOT:
    default:
      CurrentChart = LinePlot
  }

  const answerData = validation ? validation.validResponse.value : []

  const altAnswerData =
    validation && validation.altResponses ? validation.altResponses : []

  const saveAnswerHandler = (ans, index) => {
    changePreviewTab(CLEAR)
    let answerToSave = ans
    /*
     * chart data contains additional data as well
     * keep only required data in the validation, ignore the rest
     */
    if (Array.isArray(answerToSave)) {
      answerToSave = getFilteredAnswerData(ans)
    }
    if (tool === 'delete' && index >= 0) {
      const newAnswer = cloneDeep(answerToSave)
      newAnswer[index].y = data[index].y || uiStyle.yAxisMin
      setTool('')
      saveAnswer(newAnswer)
      setElementsStash(newAnswer, getStashId())
    } else {
      saveAnswer(answerToSave)
      setElementsStash(answerToSave, getStashId())
    }
  }

  const calculatedParams = {
    ...uiStyle,
  }

  const onReset = () => {
    changePreviewTab(CLEAR)
    setTool('')
    const answer = data.map(({ x, y }) => ({ x, y }))
    saveAnswer(answer)
    setElementsStash(answer, getStashId())
  }

  const onUndo = () => {
    changePreviewTab(CLEAR)
    setTool('')
    const id = getStashId()
    if (stashIndex[id] > 0 && stashIndex[id] <= stash[id].length - 1) {
      saveAnswer(stash[id][stashIndex[id] - 1])
      setStashIndex(stashIndex[id] - 1, id)
    }
  }

  const onRedo = () => {
    changePreviewTab(CLEAR)
    setTool('')
    const id = getStashId()
    if (stashIndex[id] >= 0 && stashIndex[id] < stash[id].length - 1) {
      saveAnswer(stash[id][stashIndex[id] + 1])
      setStashIndex(stashIndex[id] + 1, id)
    }
  }

  const getHandlerByControlName = (control) => {
    switch (control) {
      case 'undo':
        return onUndo()
      case 'redo':
        return onRedo()
      case 'reset':
        return onReset()
      default:
        return () => {}
    }
  }

  const renderTools = () => (
    <Tools
      setTool={setTool}
      tools={[tool]}
      controls={item.controls || []}
      getHandlerByControlName={getHandlerByControlName}
      justifyContent="flex-end"
    />
  )

  const getPreviewData = () =>
    data.map(({ x, y, ...rest }, index) =>
      answerIsActual() ? { ...userAnswer[index], ...rest } : { x, y, ...rest }
    )

  return (
    <>
      <FlexContainer
        className="__print_fit_content"
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
          {view === PREVIEW && (
            <>
              <QuestionTitleWrapper data-cy="questionTitleWrapper">
                <Stimulus
                  style={{ maxWidth: '100%' }}
                  dangerouslySetInnerHTML={{ __html: item.stimulus }}
                />
              </QuestionTitleWrapper>
            </>
          )}
          {!disableResponse && renderTools()}
          <StyledPaperWrapper
            className="chart-wrapper"
            style={{ fontSize }}
            padding={smallSize}
            overflowProps={disableResponse ? { maxWidth: '100%' } : {}}
            boxShadow={smallSize ? 'none' : ''}
          >
            <ChartContainer preview={view === EDIT} data-cy="chartContainer">
              <CurrentChart
                name={name}
                data={getPreviewData()}
                gridParams={calculatedParams}
                deleteMode={tool === 'delete'}
                view={view}
                disableResponse={disableResponse}
                previewTab={previewTab}
                saveAnswer={saveAnswerHandler}
                evaluation={evaluation}
                item={item}
                setQuestionData={setQuestionData}
                showAnswer={
                  previewTab === CHECK || (previewTab === SHOW && !isReviewTab)
                }
              />
              {view === EDIT && (
                <ChartEditTool item={item} setQuestionData={setQuestionData} />
              )}
            </ChartContainer>

            {view !== EDIT && <Instructions item={item} />}

            {view === PREVIEW &&
              (previewTab === SHOW || expressGrader) &&
              !hideCorrectAnswer && (
                <CorrectAnswersContainer
                  title={t('component.chart.correctAnswer')}
                  noBackground
                  showBorder
                  padding="14px 45px"
                  margin="38px 0px"
                  showAnswerScore={showAnswerScore}
                  score={validation?.validResponse?.score}
                >
                  <ChartContainer>
                    <CurrentChart
                      name={name}
                      data={answerData}
                      gridParams={calculatedParams}
                      deleteMode={tool === 'delete'}
                      view={view}
                      disableResponse
                      previewTab={previewTab}
                      saveAnswer={saveAnswerHandler}
                      item={item}
                      setQuestionData={setQuestionData}
                      showAnswer
                      correctAnswerView
                    />
                  </ChartContainer>
                </CorrectAnswersContainer>
              )}

            {view === PREVIEW &&
              previewTab === SHOW &&
              !hideCorrectAnswer &&
              altAnswerData.length > 0 &&
              altAnswerData.map((ans, index) => (
                <CorrectAnswersContainer
                  title={`${t('component.chart.alternateAnswer')} ${index + 1}`}
                  noBackground
                  showBorder
                  padding="14px 45px 14px"
                  margin="38px 0px"
                  showAnswerScore={showAnswerScore}
                  score={ans?.score}
                >
                  <ChartContainer>
                    <CurrentChart
                      name={name}
                      data={ans.value}
                      gridParams={calculatedParams}
                      deleteMode={tool === 'delete'}
                      view={view}
                      disableResponse
                      previewTab={previewTab}
                      saveAnswer={saveAnswerHandler}
                      item={item}
                      setQuestionData={setQuestionData}
                      showAnswer
                      correctAnswerView
                    />
                  </ChartContainer>
                </CorrectAnswersContainer>
              ))}
          </StyledPaperWrapper>
        </QuestionContentWrapper>
      </FlexContainer>
    </>
  )
}

ChartPreview.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  item: PropTypes.object.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  previewTab: PropTypes.string,
  userAnswer: PropTypes.array,
  view: PropTypes.string,
  disableResponse: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  evaluation: PropTypes.any,
  changePreviewTab: PropTypes.func,
  t: PropTypes.func.isRequired,
  setElementsStash: PropTypes.func.isRequired,
  setStashIndex: PropTypes.func.isRequired,
  stash: PropTypes.object,
  stashIndex: PropTypes.object,
  tab: PropTypes.number,
  isReviewTab: PropTypes.bool,
}

ChartPreview.defaultProps = {
  previewTab: CLEAR,
  smallSize: false,
  userAnswer: [],
  view: PREVIEW,
  showQuestionNumber: false,
  evaluation: null,
  disableResponse: false,
  changePreviewTab: () => {},
  stash: {},
  stashIndex: {},
  tab: 0,
  isReviewTab: false,
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    (state) => ({
      stash: state.graphTools.stash,
      stashIndex: state.graphTools.stashIndex,
    }),
    {
      setElementsStash: setElementsStashAction,
      setStashIndex: setStashIndexAction,
    }
  )
)

export default enhance(ChartPreview)

const ChartContainer = styled.div`
  position: relative;
  width: fit-content;
  max-width: 100%;
  margin: 0px auto;
  zoom: ${(props) => props.theme.widgets.chart.chartZoom};
  ${({ preview }) => (preview ? 'padding: 0px 70px 0px 35px' : '')}
`
