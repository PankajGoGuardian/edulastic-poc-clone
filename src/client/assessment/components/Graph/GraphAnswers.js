import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import Select from "antd/es/Select";
import { cloneDeep } from 'lodash'
import produce from 'immer'

import { TabContainer } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { defaultSymbols } from '@edulastic/constants'

import CorrectAnswers from '../CorrectAnswers'
import GraphDisplay from './Display/GraphDisplay'

import {
  setQuestionDataAction,
  getQuestionDataSelector,
} from '../../../author/QuestionEditor/ducks'
import { CheckboxLabel } from '../../styled/CheckboxWithLabel'
import { SelectInputStyled } from '../../styled/InputStyles'
import { Label } from '../../styled/WidgetOptions/Label'
import { Row } from '../../styled/WidgetOptions/Row'
import { Col } from '../../styled/WidgetOptions/Col'

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
      'point',
      'line',
      'ray',
      'segment',
      'vector',
      'circle',
      'ellipse',
      'sine',
      'tangent',
      'secant',
      'exponent',
      'logarithm',
      'polynom',
      'hyperbola',
      'polygon',
      'parabola',
      'parabola2',
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

  handleChangePoints = (points) => {
    const { tab } = this.state
    if (tab === 0) {
      this.handleUpdateCorrectScore(points)
    } else if (tab > 0) {
      this.handleUpdateAltValidationScore(tab - 1, points)
    }
  }

  renderOptions = () => {
    const {
      t,
      getIgnoreLabelsOptions,
      graphData,
      handleSelectIgnoreLabels,
      handleNumberlineChange,
    } = this.props

    if (
      graphData.graphType === 'quadrants' ||
      graphData.graphType === 'firstQuadrant'
    ) {
      return (
        <>
          <Row marginTop={15} gutter={24}>
            {/* 
              NOTE: Slicing of the array is done to keep the functionality of ignoring repeated shapes together but split into two options -
              1 - Ignore Repeated Shapes (yes/no) => yes should default to "Compare by slope" on "yes"
              2 - Compare By (slope / points) => on selecting ignore repeated shapes, the default option gets selected automatically
            */}
            {/* Removing Ignore repeated shapes and Compare by dropdown ref: https://snapwiz.atlassian.net/browse/EV-14738 */}
            <Col span={6}>
              <Label>Ignore labels</Label>
              <SelectInputStyled
                data-cy="ignoreLabels"
                onChange={(val) => handleSelectIgnoreLabels(val)}
                options={getIgnoreLabelsOptions()}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                value={graphData.validation.ignoreLabels || 'yes'}
              >
                {getIgnoreLabelsOptions().map((option) => (
                  <Select.Option data-cy={option.value} key={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </Col>
          </Row>
        </>
      )
    }

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
    const { validation } = graphData
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
  getIgnoreRepeatedShapesOptions: PropTypes.func.isRequired,
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
