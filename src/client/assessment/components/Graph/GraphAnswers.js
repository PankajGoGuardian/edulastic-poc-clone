import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { cloneDeep, get, pickBy, identity, isObject } from 'lodash'
import produce from 'immer'

import { TabContainer } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { defaultSymbols, math as mathConstants } from '@edulastic/constants'

import CorrectAnswers from '../CorrectAnswers'
import GraphDisplay from './Display/GraphDisplay'
import EvaluationSettings from '../EvaluationSettings'

import {
  setQuestionDataAction,
  getQuestionDataSelector,
} from '../../../author/QuestionEditor/ducks'
import { CheckboxLabel } from '../../styled/CheckboxWithLabel'
import { CONSTANT } from './Builder/config'

const hidePointOnEquation = ['axisSegments', 'axisLabels', 'fractionEditor']
const { GRAPH_EVALUATION_SETTING, subEvaluationSettingsGrouped } = mathConstants

class GraphAnswers extends Component {
  constructor() {
    super()
    this.state = {
      tab: 0,
    }
  }

  handleTabChange = (tab) => {
    this.setState({ tab })
  }

  handleAltResponseClose = (i) => {
    const { onRemoveAltResponses } = this.props
    const { tab } = this.state
    if (i <= tab - 1) {
      this.handleTabChange(tab - 1)
    }
    onRemoveAltResponses(i)
  }

  handleAddAnswer = () => {
    const { onAddAltResponses, graphData } = this.props
    const { validation } = graphData

    this.handleTabChange(validation.altResponses.length + 1)
    onAddAltResponses()
  }

  handleUpdateCorrectScore = (points) => {
    const { question, setQuestionData } = this.props
    const newData = cloneDeep(question)

    newData.validation.validResponse.score = points

    setQuestionData(newData)
  }

  updateValidationValue = (value) => {
    const { question, setQuestionData } = this.props

    const newQuestion = produce(question, (draft) => {
      const { validation, toolbar } = draft
      for (let i = 0; i < value.length; i++) {
        if (
          typeof value[i].label !== 'boolean' &&
          typeof value[i].label !== 'undefined'
        ) {
          value[i].label = value[i].label
            .replace(/<p>/g, '')
            .replace(/<\/p>/g, '')
        }
      }
      if (toolbar && toolbar.drawingPrompt) {
        toolbar.drawingObjects = this.getDrawingObjects(value)
      }
      validation.validResponse.value = value
    })

    setQuestionData(newQuestion)
  }

  updateAltValidationValue = (value, tabIndex) => {
    const { question, setQuestionData } = this.props
    const { validation } = question
    validation.altResponses[tabIndex].value = value
    setQuestionData({ ...question, validation })
  }

  handleUpdateAltValidationScore = (i, points) => {
    const { question, setQuestionData } = this.props
    const newData = cloneDeep(question)

    newData.validation.altResponses[i].score = points

    setQuestionData(newData)
  }

  getDrawingObjects = (value) => {
    const allowedTypes = [
      CONSTANT.TOOLS.POINT,
      CONSTANT.TOOLS.LINE,
      CONSTANT.TOOLS.RAY,
      CONSTANT.TOOLS.SEGMENT,
      CONSTANT.TOOLS.VECTOR,
      CONSTANT.TOOLS.CIRCLE,
      CONSTANT.TOOLS.ELLIPSE,
      CONSTANT.TOOLS.SIN,
      CONSTANT.TOOLS.TANGENT,
      CONSTANT.TOOLS.SECANT,
      CONSTANT.TOOLS.EXPONENT,
      CONSTANT.TOOLS.LOGARITHM,
      CONSTANT.TOOLS.POLYNOM,
      CONSTANT.TOOLS.HYPERBOLA,
      CONSTANT.TOOLS.POLYGON,
      CONSTANT.TOOLS.PARABOLA,
      CONSTANT.TOOLS.PARABOLA2,
    ]

    const shapes = value.filter(
      (elem) => allowedTypes.includes(elem.type) && !elem.subElement
    )
    return shapes.map((elem) => {
      const { id, type, label, baseColor, dashed } = elem
      const result = { id, type, label, baseColor }

      if (type !== 'point') {
        result.dashed = dashed
        result.pointLabels = Object.values(elem.subElementsIds).map(
          (pointId) => {
            const point = value.find((item) => item.id === pointId)
            return {
              label: point ? point.label : '',
              baseColor: point.baseColor,
            }
          }
        )
      }

      return result
    })
  }

  handleChangePoints = (score) => {
    if (!(score > 0)) {
      return
    }

    const points = parseFloat(score, 10)

    const { tab } = this.state
    if (tab === 0) {
      this.handleUpdateCorrectScore(points)
    } else if (tab > 0) {
      this.handleUpdateAltValidationScore(tab - 1, points)
    }
  }

  renderOptions = () => {
    const { t, graphData, handleNumberlineChange } = this.props

    if (graphData.graphType === 'axisLabels') {
      const { numberlineAxis } = graphData
      return (
        <CheckboxLabel
          name="shuffleAnswerChoices"
          onChange={() =>
            handleNumberlineChange({
              ...numberlineAxis,
              shuffleAnswerChoices: !numberlineAxis.shuffleAnswerChoices,
            })
          }
          checked={numberlineAxis.shuffleAnswerChoices}
        >
          {t('component.graphing.shuffleAnswerChoices')}
        </CheckboxLabel>
      )
    }
  }

  handleChangeEvaluationOption = (prop, value) => {
    const { graphData, setQuestionData } = this.props
    const { tab } = this.state

    let options = {}
    if (tab === 0) {
      options = get(graphData, 'validation.validResponse.options', {})
    } else {
      options = get(
        graphData,
        `validation.altResponses[${tab - 1}].options`,
        {}
      )
    }
    const draftOptions = produce(options, (draft) => {
      if (prop === 'pointsOnAnEquation' && !value) {
        draft.points = null
        draft.latex = null
        draft.showConnect = false
        // draft.apiLatex = null
      } else if (prop === 'pointsOnAnEquation' && isObject(value)) {
        draft = {
          ...draft,
          ...value,
        }
      } else if (prop === 'showConnect') {
        // do nothing here
        // draft.showConnect = value
      } else {
        draft[prop] = value
      }
      draft.compareStartAndLength =
        draft.compareLength && draft.compareStartPoint

      const evaluationOptions = [
        ...subEvaluationSettingsGrouped.graphSegmentChecks,
        ...subEvaluationSettingsGrouped.graphPolygonChecks,
      ]

      draft['comparePoints=False'] = Object.keys(draft)
        .filter((op) => draft[op])
        .some((op) => evaluationOptions.includes(op))
    })

    const draftItem = produce(graphData, (draft) => {
      if (!draft.validation) {
        draft.validation = {}
      }
      if (prop === 'showConnect') {
        draft.showConnect = value
      }
      if (tab === 0) {
        draft.validation.validResponse.options = pickBy(draftOptions, identity)
      } else {
        draft.validation.altResponses[tab - 1].options = pickBy(
          draftOptions,
          identity
        )
      }
    })
    setQuestionData(draftItem)
  }

  get optionsForEvaluation() {
    const { graphData } = this.props
    const { tab } = this.state
    if (tab === 0) {
      return get(graphData, 'validation.validResponse.options', {})
    }
    return get(graphData, `validation.altResponses[${tab - 1}].options`, {})
  }

  render() {
    const {
      graphData,
      view,
      previewTab,
      onChangeKeypad,
      symbols,
      ...rest
    } = this.props
    const { tab } = this.state
    const { validation, graphType } = graphData
    const points =
      tab == 0
        ? validation.validResponse.score
        : validation.altResponses[tab - 1].score

    return (
      <CorrectAnswers
        {...rest}
        correctTab={tab}
        onAdd={this.handleAddAnswer}
        validation={graphData.validation}
        options={this.renderOptions()}
        onTabChange={this.handleTabChange}
        onCloseTab={this.handleAltResponseClose}
        points={points}
        onChangePoints={this.handleChangePoints}
        questionType={graphData?.title}
        isCorrectAnsTab={tab === 0}
      >
        <>
          {tab === 0 && (
            <TabContainer>
              <GraphDisplay
                value={graphData.validation.validResponse.score}
                view={view}
                onChange={this.updateValidationValue}
                graphData={graphData}
                previewTab={previewTab}
                altAnswerId={graphData.validation.validResponse.id}
                elements={graphData.validation.validResponse.value}
                disableResponse={false}
                item={graphData}
                onChangeKeypad={onChangeKeypad}
                symbols={symbols}
                isCorrectAnsTab
              />
            </TabContainer>
          )}
          {graphData.validation.altResponses &&
            !!graphData.validation.altResponses.length &&
            graphData.validation.altResponses.map((alter, i) => {
              if (i + 1 === tab) {
                return (
                  <TabContainer>
                    <GraphDisplay
                      key={`alt-answer-${i}`}
                      value={alter.score}
                      view={view}
                      graphData={graphData}
                      previewTab={previewTab}
                      altAnswerId={alter.id}
                      elements={alter.value}
                      disableResponse={false}
                      onChange={(val) => this.updateAltValidationValue(val, i)}
                      item={graphData}
                      onChangeKeypad={onChangeKeypad}
                      symbols={symbols}
                    />
                  </TabContainer>
                )
              }
              return null
            })}
        </>
        <EvaluationSettings
          method={GRAPH_EVALUATION_SETTING}
          options={this.optionsForEvaluation}
          hidePointOnEquation={hidePointOnEquation.includes(graphType)}
          changeOptions={this.handleChangeEvaluationOption}
        />
      </CorrectAnswers>
    )
  }
}

GraphAnswers.propTypes = {
  t: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  onAddAltResponses: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  onRemoveAltResponses: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
  previewTab: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  getIgnoreLabelsOptions: PropTypes.func.isRequired,
  handleSelectIgnoreLabels: PropTypes.func.isRequired,
  handleSelectIgnoreRepeatedShapes: PropTypes.func.isRequired,
  handleNumberlineChange: PropTypes.func.isRequired,
  onChangeKeypad: PropTypes.func,
  symbols: PropTypes.array,
}

GraphAnswers.defaultProps = {
  onChangeKeypad: () => {},
  symbols: defaultSymbols,
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    (state) => ({
      question: getQuestionDataSelector(state),
    }),
    { setQuestionData: setQuestionDataAction }
  )
)

export default enhance(GraphAnswers)
