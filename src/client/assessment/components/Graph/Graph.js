import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { cloneDeep, get, omit, pickBy, identity, isObject } from 'lodash'
import { produce } from 'immer'
import {
  CorrectAnswersContainer,
  Stimulus,
  QuestionNumberLabel,
  AnswerContext,
  FlexContainer,
  QuestionLabelWrapper,
  QuestionContentWrapper,
  QuestionSubLabel,
} from '@edulastic/common'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'

import { compose } from 'redux'
import styled from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import { defaultSymbols, math as mathConstants } from '@edulastic/constants'
import { getFontSize } from '../../utils/helpers'
import { ContentArea } from '../../styled/ContentArea'
import {
  setQuestionDataAction,
  changeLabelAction,
} from '../../../author/src/actions/question'
import QuadrantsMoreOptions from './Authoring/GraphQuadrants/QuadrantsMoreOptions'
import AxisSegmentsOptions from './Authoring/AxisSegmentsOptions'
import NumberLinePlotOptions from './Authoring/NumberLinePlotOptions'
import AxisLabelsOptions from './Authoring/AxisLabelsLayoutSettings/AxisLabelsOptions'
import QuadrantsSmallSize from './components/QuadrantsSmallSize'
import AxisSmallSize from './components/AxisSmallSize'
import {
  AxisSegments,
  GraphAxisLabels,
  GraphQuadrants,
  NumberLinePlot,
} from './Authoring'

import GraphAnswers from './GraphAnswers'
import { GraphDisplay } from './Display'
import {
  GraphContainer,
  QuestionTitleWrapper,
} from './common/styled_components'
import Annotations from '../Annotations/Annotations'

import Question from '../Question'
import { Subtitle } from '../../styled/Subtitle'
import { Col } from '../../styled/WidgetOptions/Col'
import { Row } from '../../styled/WidgetOptions/Row'
import EvaluationSettings from '../EvaluationSettings'
import { StyledPaperWrapper } from '../../styled/Widget'
import Instructions from '../Instructions'
import { EDIT } from '../../constants/constantsForQuestions'

const { GRAPH_EVALUATION_SETTING } = mathConstants

const EmptyWrapper = styled.div``

const SmallSizeQuadrantsWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 9px 30px 16px;
`

const SmallSizeAxisWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const getFontSizeList = () => [
  { value: 'small', label: 'Small' },
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Large' },
  { value: 'extra_large', label: 'Extra large' },
  { value: 'huge', label: 'Huge' },
]

class Graph extends Component {
  // Todo: need to fix, there are more
  // eslint-disable-next-line react/static-property-placement
  static contextType = AnswerContext

  getOptionsComponent = () => {
    const { item } = this.props
    const { graphType } = item

    switch (graphType) {
      case 'axisSegments':
        return AxisSegments
      case 'numberLinePlot':
        return NumberLinePlot
      case 'axisLabels':
        return GraphAxisLabels
      case 'quadrants':
      case 'firstQuadrant':
      case 'quadrantsPlacement':
      default:
        return GraphQuadrants
    }
  }

  handleKeypadMode = (keypad = 'basic') => {
    const { item, setQuestionData } = this.props
    setQuestionData(
      produce(item, (draft) => {
        draft.symbols = [keypad]
      })
    )
  }

  getMoreOptionsComponent = () => {
    const { item } = this.props
    const { graphType } = item

    switch (graphType) {
      case 'axisSegments':
        return AxisSegmentsOptions // number line with plot
      case 'numberLinePlot':
        return NumberLinePlotOptions
      case 'axisLabels': // numberline drag drop
        return AxisLabelsOptions
      case 'quadrants':
      case 'firstQuadrant':
      case 'quadrantsPlacement':
      default:
        return QuadrantsMoreOptions
    }
  }

  getMoreOptionsProps = () => {
    const { item } = this.props
    const { graphType } = item

    switch (graphType) {
      case 'axisSegments':
        return this.getAxisSegmentsOptionsProps()
      case 'axisLabels':
        return this.getAxisLabelsOptionsProps()
      case 'numberLinePlot':
        return this.getAxisLinePlotOptionsProps()
      case 'quadrants':
      case 'firstQuadrant':
      case 'quadrantsPlacement':
      default:
        return this.getQuadrantsOptionsProps()
    }
  }

  getQuadrantsOptionsProps = () => {
    const { item, fillSections, cleanSections, advancedAreOpen } = this.props

    return {
      fontSizeList: getFontSizeList(),
      setOptions: this.handleOptionsChange,
      setCanvas: this.handleCanvasChange,
      setValidation: this.handleValidationChange,
      setControls: this.handleControlbarChange,
      setToolbar: this.handleToolbarChange,
      setBgImg: this.handleBgImgChange,
      setBgShapes: this.handleBgShapesChange,
      graphData: item,
      setAnnotation: this.handleAnnotationChange,
      fillSections,
      cleanSections,
      advancedAreOpen,
      test: '1',
      changeLabel: this.handleChangeLabel,
    }
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

  handleChangeLabel = (id, labelValue) => {
    labelValue = labelValue.replace(/<p>/g, '').replace(/<\/p>/g, '')

    const { item, setQuestionData, changeLabel } = this.props
    const { validation, toolbar } = item
    let oldValue
    const { value } = item.validation.validResponse
    for (let i = 0; i < value.length; i++) {
      if (value[i].id === id) {
        oldValue = value[i].label
        value[i].label = labelValue
        break
      }
    }

    if (toolbar && toolbar.drawingPrompt) {
      toolbar.drawingObjects = this.getDrawingObjects(value)
    }
    setQuestionData({ ...item, validation, toolbar })
    changeLabel({ data: value, oldValue, valId: id })
  }

  getAxisLabelsOptionsProps = () => {
    const { item, fillSections, cleanSections, advancedAreOpen } = this.props

    return {
      setOptions: this.handleOptionsChange,
      setNumberline: this.handleNumberlineChange,
      setCanvas: this.handleCanvasChange,
      graphData: item,
      fillSections,
      cleanSections,
      advancedAreOpen,
      setValidation: this.handleValidationChange,
    }
  }

  getAxisSegmentsOptionsProps = () => {
    const { item, fillSections, cleanSections, advancedAreOpen } = this.props

    return {
      setOptions: this.handleOptionsChange,
      setNumberline: this.handleNumberlineChange,
      setCanvas: this.handleCanvasChange,
      setControls: this.handleToolbarChange,
      graphData: item,
      fillSections,
      cleanSections,
      advancedAreOpen,
      setValidation: this.handleValidationChange,
    }
  }

  getAxisLinePlotOptionsProps = () => {
    const { item, fillSections, cleanSections, advancedAreOpen } = this.props

    return {
      setOptions: this.handleOptionsChange,
      setNumberline: this.handleNumberlineChange,
      setCanvas: this.handleCanvasChange,
      setControls: this.handleControlbarChange,
      graphData: item,
      fillSections,
      cleanSections,
      advancedAreOpen,
      setValidation: this.handleValidationChange,
    }
  }

  handleToolbarChange = (options) => {
    const { setQuestionData, item } = this.props
    setQuestionData({ ...item, toolbar: options })
  }

  handleControlbarChange = (options) => {
    const { setQuestionData, item } = this.props
    setQuestionData({ ...item, controlbar: options })
  }

  handleValidationChange = (options) => {
    const { setQuestionData, item } = this.props
    setQuestionData({ ...item, validation: options })
  }

  handleNumberlineChange = (options) => {
    const { setQuestionData, item } = this.props
    setQuestionData({ ...item, numberlineAxis: options })
  }

  handleOptionsChange = (options) => {
    const { setQuestionData, item } = this.props
    setQuestionData({ ...item, uiStyle: options })
  }

  handleAnnotationChange = (options) => {
    const { setQuestionData, item } = this.props
    setQuestionData({ ...item, annotation: options })
  }

  handleCanvasChange = (canvas, uiStyle) => {
    const { setQuestionData, item } = this.props
    let newItem = { ...item, canvas }
    if (uiStyle) {
      newItem = { ...newItem, uiStyle }
    }
    setQuestionData(newItem)
  }

  handleBgImgChange = (bgImgOptions) => {
    const { setQuestionData, item } = this.props
    setQuestionData({ ...item, backgroundImage: bgImgOptions })
  }

  handleBgShapesChange = (bgShapes) => {
    const { setQuestionData, item } = this.props
    setQuestionData({ ...item, background_shapes: bgShapes })
  }

  handleAddAltResponses = () => {
    const { setQuestionData, item } = this.props
    const newItem = cloneDeep(item)

    const response = {
      id: `alt-${Math.random().toString(36)}`,
      score: newItem?.validation?.validResponse?.score,
      value: [],
    }

    if (
      newItem.validation.altResponses &&
      newItem.validation.altResponses.length
    ) {
      newItem.validation.altResponses.push(response)
    } else {
      newItem.validation.altResponses = [response]
    }

    setQuestionData(newItem)
  }

  handleRemoveAltResponses = (index) => {
    const { setQuestionData, item } = this.props
    const newItem = cloneDeep(item)

    if (
      newItem.validation.altResponses &&
      newItem.validation.altResponses.length
    ) {
      newItem.validation.altResponses = newItem.validation.altResponses.filter(
        (response, i) => i !== index
      )
    }

    setQuestionData(newItem)
  }

  handleAddAnswer = (qid) => {
    const { saveAnswer } = this.props
    saveAnswer(qid)
  }

  handleChangeEvaluationOption = (prop, value) => {
    const { item, setQuestionData } = this.props
    const newItem = produce(item, (draft) => {
      if (!draft.validation) {
        draft.validation = {}
      }
      if (prop === 'ponitsOnAnEquation' && !value) {
        draft.validation.points = null
        draft.validation.latex = null
        draft.validation.apiLatex = null
      } else if (prop === 'ponitsOnAnEquation' && isObject(value)) {
        draft.validation = {
          ...draft.validation,
          ...value,
        }
      } else {
        draft.validation[prop] = value
      }
      draft.validation.compareStartAndLength =
        draft.validation.compareLength && draft.validation.compareStartPoint

      draft.validation = pickBy(draft.validation, identity)
    })
    setQuestionData(newItem)
  }

  get optionsForEvaluation() {
    const { item } = this.props
    const validation = get(item, 'validation', {})

    return omit(validation, [
      'altResponses',
      'scoringType',
      'validResponse',
      'rounding',
      'graphType',
    ])
  }

  render() {
    const answerContextConfig = this.context
    const {
      t,
      view,
      item,
      smallSize,
      testItem,
      previewTab: _previewTab,
      userAnswer,
      evaluation,
      fillSections,
      cleanSections,
      advancedAreOpen,
      disableResponse,
      flowLayout,
      showQuestionNumber,
      setQuestionData,
      advancedLink,
      ...restProps
    } = this.props

    const { symbols = defaultSymbols } = item

    const mapFontName = {
      extra_large: 'xlarge',
      huge: 'xxlarge',
      large: 'large',
      small: 'small',
      normal: 'normal',
    }

    let previewTab = _previewTab
    let compact = false
    if (
      answerContextConfig.expressGrader &&
      !answerContextConfig.isAnswerModifiable
    ) {
      /**
       * ideally wanted to be in CHECK mode.
       * But this component seems to be
       * written to work with only SHOW & CLEAR
       */
      previewTab = 'show'
    } else if (
      answerContextConfig.expressGrader &&
      answerContextConfig.isAnswerModifiable
    ) {
      previewTab = 'clear'
      compact = true
    }

    const { validation, stimulus, uiStyle } = item
    const OptionsComponent = this.getOptionsComponent()
    const MoreOptionsComponent = this.getMoreOptionsComponent()

    const Wrapper = testItem ? EmptyWrapper : StyledPaperWrapper

    return (
      <GraphContainer>
        {view === 'edit' && (
          <>
            <ContentArea>
              <OptionsComponent
                graphData={item}
                canvas={item.canvas}
                fillSections={fillSections}
                cleanSections={cleanSections}
                advancedAreOpen
                setCanvas={this.handleCanvasChange}
                fontSize={getFontSize(mapFontName[uiStyle?.currentFontSize])}
              />
              <Question
                section="main"
                label="Set Correct Answer(s)"
                cleanSections={cleanSections}
                fillSections={fillSections}
                advancedAreOpen
              >
                <GraphAnswers
                  view={view}
                  graphData={item}
                  previewTab={previewTab}
                  onAddAltResponses={this.handleAddAltResponses}
                  onRemoveAltResponses={this.handleRemoveAltResponses}
                  handleNumberlineChange={this.handleNumberlineChange}
                  onChangeKeypad={this.handleKeypadMode}
                  symbols={symbols}
                />
                <EvaluationSettings
                  method={GRAPH_EVALUATION_SETTING}
                  options={this.optionsForEvaluation}
                  changeOptions={this.handleChangeEvaluationOption}
                />
              </Question>

              <Question
                section="main"
                label="Annotations"
                cleanSections={cleanSections}
                fillSections={fillSections}
                advancedAreOpen
              >
                <Annotations
                  question={item}
                  setQuestionData={setQuestionData}
                  editable
                />
              </Question>

              <Question
                section="main"
                label="Background Shapes"
                cleanSections={cleanSections}
                fillSections={fillSections}
                deskHeight={item.uiStyle?.layoutHeight}
                advancedAreOpen
              >
                <Subtitle
                  id={getFormattedAttrId(
                    `${item?.title}-${t(
                      'component.graphing.background_shapes'
                    )}`
                  )}
                >
                  {t('component.graphing.background_shapes')}
                </Subtitle>
                <Row>
                  <Col md={24}>
                    <GraphDisplay
                      view={EDIT}
                      advancedElementSettings
                      graphData={item}
                      onChange={this.handleBgShapesChange}
                      elements={item.background_shapes}
                      bgShapes
                    />
                  </Col>
                </Row>
              </Question>

              {advancedLink}

              <MoreOptionsComponent
                advancedAreOpen={advancedAreOpen}
                {...this.getMoreOptionsProps()}
              />
            </ContentArea>
          </>
        )}
        {view === 'preview' && smallSize === false && item && (
          <Wrapper
            borderRadius="0px"
            className={
              compact ? 'toolbar-compact graph-wrapper' : 'graph-wrapper'
            }
          >
            <FlexContainer
              justifyContent="flex-start"
              alignItems="baseline"
              width="100%"
            >
              <QuestionLabelWrapper>
                {showQuestionNumber && !flowLayout ? (
                  <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>
                ) : null}
                {item.qSubLabel && (
                  <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>
                )}
              </QuestionLabelWrapper>

              <QuestionContentWrapper>
                <QuestionTitleWrapper>
                  <StyledStimulus
                    data-cy="questionHeader"
                    dangerouslySetInnerHTML={{ __html: stimulus }}
                    fontSize={getFontSize(
                      mapFontName[uiStyle?.currentFontSize]
                    )}
                  />
                </QuestionTitleWrapper>
                {item.canvas && item.uiStyle && (
                  <GraphDisplay
                    className="__prevent-page-break"
                    disableResponse={disableResponse}
                    graphData={item}
                    view={view}
                    previewTab={previewTab}
                    onChange={this.handleAddAnswer}
                    elements={userAnswer}
                    evaluation={evaluation}
                    {...restProps}
                  />
                )}
                {view !== EDIT && <Instructions item={item} />}
                {previewTab === 'show' && item.canvas && item.uiStyle && (
                  <>
                    <CorrectAnswersContainer
                      minWidth="max-content"
                      title={t('component.graphing.correctAnswer')}
                      titleMargin="4px"
                      noBackground
                      showBorder
                      padding="0px"
                      margin="20px 0px"
                    >
                      <GraphDisplay
                        disableResponse
                        graphData={item}
                        view={view}
                        previewTab={previewTab}
                        elements={validation.validResponse.value}
                        evaluation={evaluation}
                        elementsIsCorrect
                        {...restProps}
                      />
                    </CorrectAnswersContainer>

                    {validation.altResponses &&
                      validation.altResponses.map((altAnswer, i) => (
                        <CorrectAnswersContainer
                          minWidth="max-content"
                          title={`${t('component.graphing.alternateAnswer')} ${
                            i + 1
                          }`}
                          titleMargin="4px"
                          noBackground
                          showBorder
                          padding="0px"
                          margin="20px 0px"
                        >
                          <GraphDisplay
                            disableResponse
                            graphData={item}
                            view={view}
                            previewTab={previewTab}
                            elements={altAnswer.value}
                            evaluation={evaluation}
                            elementsIsCorrect
                            {...restProps}
                          />
                        </CorrectAnswersContainer>
                      ))}
                  </>
                )}
              </QuestionContentWrapper>
            </FlexContainer>
          </Wrapper>
        )}
        {view === 'preview' && smallSize && (
          <>
            {item.graphType === 'firstQuadrant' && (
              <SmallSizeQuadrantsWrapper>
                <QuadrantsSmallSize first />
              </SmallSizeQuadrantsWrapper>
            )}
            {item.graphType === 'axisSegments' && (
              <SmallSizeAxisWrapper>
                <AxisSmallSize segments />
              </SmallSizeAxisWrapper>
            )}
            {item.graphType === 'axisLabels' && (
              <SmallSizeAxisWrapper>
                <AxisSmallSize labels />
              </SmallSizeAxisWrapper>
            )}
            {item.graphType === 'quadrants' && (
              <SmallSizeQuadrantsWrapper>
                <QuadrantsSmallSize />
              </SmallSizeQuadrantsWrapper>
            )}
          </>
        )}
      </GraphContainer>
    )
  }
}

Graph.propTypes = {
  view: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  smallSize: PropTypes.bool,
  setQuestionData: PropTypes.func.isRequired,
  testItem: PropTypes.bool,
  previewTab: PropTypes.string,
  userAnswer: PropTypes.any,
  saveAnswer: PropTypes.func.isRequired,
  evaluation: PropTypes.any,
  changeLabel: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  advancedAreOpen: PropTypes.bool,
  disableResponse: PropTypes.bool,
  t: PropTypes.func.isRequired,
  advancedLink: PropTypes.any,
  showQuestionNumber: PropTypes.bool,
  flowLayout: PropTypes.bool,
}

Graph.defaultProps = {
  smallSize: false,
  previewTab: 'clear',
  testItem: false,
  userAnswer: [],
  evaluation: null,
  advancedAreOpen: false,
  disableResponse: false,
  advancedLink: null,
  showQuestionNumber: false,
  flowLayout: false,
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(null, {
    setQuestionData: setQuestionDataAction,
    changeLabel: changeLabelAction,
  })
)

const GraphComponent = enhance(Graph)

export default GraphComponent

const StyledStimulus = styled(Stimulus)`
  word-break: break-word;
  white-space: pre-wrap;
`
