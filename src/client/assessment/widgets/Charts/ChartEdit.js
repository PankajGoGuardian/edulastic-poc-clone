import 'rc-color-picker/assets/index.css'
import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import { questionType } from '@edulastic/constants'

import CorrectAnswers from './CorrectAnswers'
import { EDIT } from '../../constants/constantsForQuestions'
import Options from './components/Options'
import ChartPreview from './ChartPreview'
import PointsList from './components/PointsList'
import AxisOptions from './AxisOption'
import { getFilteredAnswerData, getReCalculatedPoints } from './helpers'

import ComposeQuestion from './ComposeQuestion'
import { AnnotationBlock } from './AnnotationBlock'

const ChartEdit = ({
  item,
  setQuestionData,
  fillSections,
  cleanSections,
  advancedLink,
  advancedAreOpen,
}) => {
  const {
    uiStyle: { yAxisMax, yAxisMin, snapTo },
    type,
  } = item

  const [currentTab, setCurrentTab] = useState(0)
  const [firstMount, setFirstMount] = useState(false)

  useEffect(() => {
    if (firstMount) {
      setQuestionData(
        produce(item, (draft) => {
          const params = { yAxisMax, yAxisMin, snapTo }
          draft.chart_data.data = getReCalculatedPoints(
            draft.chart_data.data,
            params
          )

          draft.validation.altResponses.forEach((altResp) => {
            altResp.value = getReCalculatedPoints(altResp.value, params)
          })

          draft.validation.validResponse.value = getReCalculatedPoints(
            draft.validation.validResponse.value,
            params
          )
        })
      )
    }
  }, [yAxisMax, yAxisMin, snapTo])

  useEffect(() => {
    setFirstMount(true)
  }, [])

  const handleAddPoint = () => {
    setQuestionData(
      produce(item, (draft) => {
        let initValue = yAxisMin
        if (
          draft.type === questionType.HISTOGRAM ||
          draft.type === questionType.BAR_CHART ||
          draft.type === questionType.LINE_CHART
        ) {
          initValue = yAxisMax
        }
        const newPoint = {
          x: `Bar ${draft.chart_data.data.length + 1}`,
          y: initValue,
        }

        draft.chart_data.data.push({ ...newPoint })

        draft.validation.altResponses.forEach((altResp) => {
          altResp.value.push({ ...newPoint })
        })

        draft.validation.validResponse.value.push({ ...newPoint })
      })
    )
  }

  const handlePointChange = (index) => (prop, value) => {
    setQuestionData(
      produce(item, (draft) => {
        switch (prop) {
          case 'interactive': {
            if (draft.chart_data.data[index].notInteractive === undefined) {
              draft.chart_data.data[index].notInteractive = true
            } else {
              delete draft.chart_data.data[index].notInteractive
            }
            break
          }
          case 'label': {
            draft.chart_data.data[index].x = value
            draft.validation.altResponses.forEach((altResp) => {
              altResp.value[index].x = value
            })
            draft.validation.validResponse.value[index].x = value
            break
          }
          case 'value': {
            draft.chart_data.data[index].y =
              value > yAxisMax ? yAxisMax : value < yAxisMin ? yAxisMin : value
            break
          }
          case 'labelVisibility': {
            draft.chart_data.data[index].labelVisibility = value
            break
          }
          case 'labelFractionFormat': {
            draft.chart_data.data[index].labelFractionFormat = value
            break
          }
          default:
        }
      })
    )
  }

  const handleDelete = (index) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.chart_data.data.splice(index, 1)

        draft.validation.altResponses.forEach((altResp) => {
          altResp.value.splice(index, 1)
        })

        draft.validation.validResponse.value.splice(index, 1)
      })
    )
  }

  const handleCloseTab = (tabIndex) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.validation.altResponses.splice(tabIndex, 1)
        setCurrentTab(0)
      })
    )
  }

  const handleAddAnswer = () => {
    setQuestionData(
      produce(item, (draft) => {
        let initValue = yAxisMin
        if (
          draft.type === questionType.HISTOGRAM ||
          draft.type === questionType.BAR_CHART ||
          draft.type === questionType.LINE_CHART
        ) {
          initValue = yAxisMax
        }
        if (!draft.validation.altResponses) {
          draft.validation.altResponses = []
        }
        draft.validation.altResponses.push({
          score: draft?.validation?.validResponse?.score,
          value: draft.validation.validResponse.value.map((chartData) => ({
            ...chartData,
            y: initValue,
          })),
        })
        setCurrentTab(draft.validation.altResponses.length)
      })
    )
  }

  const handlePointsChange = (val) => {
    if (val < 0) {
      return
    }
    const points = parseFloat(val, 10)
    setQuestionData(
      produce(item, (draft) => {
        if (currentTab === 0) {
          draft.validation.validResponse.score = points
        } else {
          draft.validation.altResponses[currentTab - 1].score = points
        }
      })
    )
  }

  const handleAnswerChange = (ans) => {
    /*
     * chart data contains additional data as well
     * keep only required data in the validation, ignore the rest
     */
    setQuestionData(
      produce(item, (draft) => {
        let answerToSave = ans
        if (Array.isArray(answerToSave)) {
          answerToSave = getFilteredAnswerData(ans)
        }
        if (currentTab === 0) {
          draft.validation.validResponse.value = answerToSave
        } else {
          draft.validation.altResponses[currentTab - 1].value = answerToSave
        }
      })
    )
  }

  const renderChartPreview = () => (
    <ChartPreview
      item={item}
      tab={currentTab}
      saveAnswer={handleAnswerChange}
      userAnswer={
        currentTab === 0
          ? item.validation.validResponse.value
          : item.validation.altResponses[currentTab - 1]?.value
      }
      view={EDIT}
      setQuestionData={setQuestionData}
    />
  )

  const points =
    currentTab === 0
      ? item.validation.validResponse.score
      : item.validation.altResponses[currentTab - 1]?.score

  const showFractionFormatSetting = [
    questionType.LINE_PLOT,
    questionType.DOT_PLOT,
    questionType.BAR_CHART,
    questionType.LINE_CHART,
    questionType.HISTOGRAM,
  ].includes(type)

  return (
    <>
      <ComposeQuestion
        item={item}
        setQuestionData={setQuestionData}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />

      <AxisOptions
        item={item}
        setQuestionData={setQuestionData}
        fillSections={fillSections}
        cleanSections={cleanSections}
      />

      <PointsList
        showFractionFormatSetting={showFractionFormatSetting}
        handleChange={handlePointChange}
        handleDelete={handleDelete}
        points={item.chart_data.data}
        onAdd={handleAddPoint}
        fillSections={fillSections}
        cleanSections={cleanSections}
        item={item}
      />

      <CorrectAnswers
        onTabChange={setCurrentTab}
        currentTab={currentTab}
        onAdd={handleAddAnswer}
        validation={item.validation}
        chartPreview={renderChartPreview()}
        points={points}
        onChangePoints={handlePointsChange}
        onCloseTab={handleCloseTab}
        fillSections={fillSections}
        cleanSections={cleanSections}
        item={item}
        isCorrectAnsTab={currentTab === 0}
      />

      <AnnotationBlock
        cleanSections={cleanSections}
        fillSections={fillSections}
        item={item}
        setQuestionData={setQuestionData}
      />

      {advancedLink}

      <Options
        fillSections={fillSections}
        cleanSections={cleanSections}
        advancedAreOpen={advancedAreOpen}
        item={item}
      />
    </>
  )
}

ChartEdit.propTypes = {
  item: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedLink: PropTypes.any,
  advancedAreOpen: PropTypes.bool,
}

ChartEdit.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
  advancedLink: null,
}

export default ChartEdit
