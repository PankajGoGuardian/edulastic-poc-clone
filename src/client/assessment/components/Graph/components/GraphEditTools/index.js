import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { cloneDeep, isEmpty } from 'lodash'
import { Modal } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import { defaultSymbols, graph } from '@edulastic/constants'

import { Overlay, Popup, PopupContent } from '../../common/styled_components'

import { Wrapper } from './styled/Wrapper'
import { ToolButton } from './styled/ToolButton'
import { IconFuncSymbol } from './styled/IconFuncSymbol'
import { IconPlus } from './styled/IconPlus'
import { IconMinus } from './styled/IconMinus'
import { IconSpanner } from './styled/IconSpanner'
import Equations from './components/Equations'
import Settings from './components/Settings'

const FUNCTIONS_TOOL = 'functionsTool'
const SETTINGS_TOOL = 'settingsTool'
const ANNOTATIONS_TOOL = 'annotationsTool'
const PLUS_TOOL = 'plusTool'
const MINUS_TOOL = 'minusTool'
const { GRAPH_TOOLS } = graph

const zoomScale = 2

const zoomIn = (n) => n / zoomScale

const zoomOut = (n) => n * zoomScale

const ELEMENT_TYPES_SCALE = [
  GRAPH_TOOLS.AREA,
  GRAPH_TOOLS.AREA2,
  GRAPH_TOOLS.POINT,
]

class GraphEditTools extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedTool: null,
    }
  }

  changeScale(tool) {
    const { setQuestionData, graphData } = this.props

    const newGraphData = cloneDeep(graphData)
    let {
      canvas: { xMin, xMax, yMin, yMax },
      uiStyle: { xDistance, yDistance },
    } = newGraphData

    xMin = parseFloat(xMin)
    xMax = parseFloat(xMax)
    yMin = parseFloat(yMin)
    yMax = parseFloat(yMax)
    xDistance = parseFloat(xDistance)
    yDistance = parseFloat(yDistance)

    if (
      Number.isNaN(xMin) ||
      Number.isNaN(xMax) ||
      Number.isNaN(yMin) ||
      Number.isNaN(yMax) ||
      Number.isNaN(xDistance) ||
      Number.isNaN(yDistance)
    ) {
      return
    }

    if (tool === MINUS_TOOL) {
      xMin = zoomOut(xMin)
      xMax = zoomOut(xMax)
      yMin = zoomOut(yMin)
      yMax = zoomOut(yMax)
      xDistance = zoomOut(xDistance)
      yDistance = zoomOut(yDistance)
    } else if (tool === PLUS_TOOL) {
      xMin = zoomIn(xMin)
      xMax = zoomIn(xMax)
      yMin = zoomIn(yMin)
      yMax = zoomIn(yMax)
      xDistance = zoomIn(xDistance)
      yDistance = zoomIn(yDistance)
    }

    xMin = +xMin.toFixed(8)
    xMax = +xMax.toFixed(8)
    yMin = +yMin.toFixed(8)
    yMax = +yMax.toFixed(8)
    xDistance = +xDistance.toFixed(8)
    yDistance = +yDistance.toFixed(8)

    newGraphData.canvas = {
      ...newGraphData.canvas,
      xMin,
      xMax,
      yMin,
      yMax,
    }
    newGraphData.uiStyle = {
      ...newGraphData.uiStyle,
      xDistance,
      yDistance,
      xTickDistance: xDistance,
      yTickDistance: yDistance,
    }

    const { validation } = newGraphData
    if (validation) {
      const elementMap = (element) => {
        if (!ELEMENT_TYPES_SCALE.includes(element.type)) {
          return element
        }
        if (tool === PLUS_TOOL) {
          element.x = zoomIn(element.x)
          element.y = zoomIn(element.y)
        } else if (tool === MINUS_TOOL) {
          element.x = zoomOut(element.x)
          element.y = zoomOut(element.y)
        }
        return element
      }
      const { validResponse, altResponses } = validation
      if (validResponse && !isEmpty(validResponse.value)) {
        validResponse.value = validResponse.value.map(elementMap)
      }
      if (!isEmpty(altResponses)) {
        altResponses.forEach((altResp) => {
          altResp.value = altResp.value.map(elementMap)
        })
      }
    }
    setQuestionData(newGraphData)
  }

  onToolButtonClick(tool) {
    const { elements, t } = this.props

    const proceed = () => {
      switch (tool) {
        case FUNCTIONS_TOOL:
        case SETTINGS_TOOL:
        case ANNOTATIONS_TOOL:
          this.setState({
            selectedTool: tool,
          })
          break
        case PLUS_TOOL:
        case MINUS_TOOL:
          this.changeScale(tool)
          break
        default:
          break
      }
    }

    if (
      tool === FUNCTIONS_TOOL &&
      !isEmpty(
        (elements || []).filter(
          (element) => element.type !== GRAPH_TOOLS.EQUATION
        )
      )
    ) {
      Modal.confirm({
        title: 'Warning',
        content: t('component.graphing.helperText.fxWithArea'),
        okText: 'Confirm',
        okCancel: false,
        maskClosable: true,
      })
    } else {
      proceed()
    }
  }

  onOverlayClick(e) {
    e.stopPropagation()
    this.setState({
      selectedTool: null,
    })
  }

  render() {
    const {
      side,
      margin,
      layout: { width },
      graphData,
      setQuestionData,
      equations,
      setEquations,
      hideEquationTool,
      hideSettingTool,
      onChangeKeypad,
      symbols,
    } = this.props

    const { selectedTool } = this.state

    return (
      <>
        {side === 'left' && (
          <Wrapper side={side} width={width} margin={margin}>
            {!hideEquationTool && (
              <ToolButton
                selected={selectedTool === FUNCTIONS_TOOL}
                onClick={() => this.onToolButtonClick(FUNCTIONS_TOOL)}
              >
                <IconFuncSymbol />
                {selectedTool === FUNCTIONS_TOOL && (
                  <>
                    <Overlay onClick={(e) => this.onOverlayClick(e)} />
                    <Popup right>
                      <PopupContent>
                        <Equations
                          equations={equations}
                          setEquations={setEquations}
                          onChangeKeypad={onChangeKeypad}
                          symbols={symbols}
                        />
                      </PopupContent>
                    </Popup>
                  </>
                )}
              </ToolButton>
            )}
            {/* dont need T button as of https://snapwiz.atlassian.net/browse/EV-16610 */}
            {/* <ToolButton
              selected={selectedTool === ANNOTATIONS_TOOL}
              onClick={() => this.onToolButtonClick(ANNOTATIONS_TOOL)}
            >
              T
              {selectedTool === ANNOTATIONS_TOOL && (
                <Fragment>
                  <Overlay onClick={e => this.onOverlayClick(e)} />
                  <Popup right>
                    <PopupContent>
                      <Annotations graphData={graphData} setQuestionData={setQuestionData} />
                    </PopupContent>
                  </Popup>
                </Fragment>
              )}
            </ToolButton> */}
          </Wrapper>
        )}
        {side === 'right' && (
          <Wrapper side={side} width={width} margin={margin}>
            {!hideSettingTool && (
              <ToolButton
                selected={selectedTool === SETTINGS_TOOL}
                onClick={() => this.onToolButtonClick(SETTINGS_TOOL)}
              >
                <IconSpanner />
                {selectedTool === SETTINGS_TOOL && (
                  <>
                    <Overlay onClick={(e) => this.onOverlayClick(e)} />
                    <Popup left>
                      <PopupContent>
                        <Settings
                          graphData={graphData}
                          setQuestionData={setQuestionData}
                        />
                      </PopupContent>
                    </Popup>
                  </>
                )}
              </ToolButton>
            )}
            <ToolButton onClick={() => this.onToolButtonClick(PLUS_TOOL)}>
              <IconPlus />
            </ToolButton>
            <ToolButton onClick={() => this.onToolButtonClick(MINUS_TOOL)}>
              <IconMinus />
            </ToolButton>
          </Wrapper>
        )}
      </>
    )
  }
}

GraphEditTools.propTypes = {
  side: PropTypes.string,
  graphData: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
    .isRequired,
  setQuestionData: PropTypes.func.isRequired,
  layout: PropTypes.object.isRequired,
  equations: PropTypes.array,
  setEquations: PropTypes.func,
  hideSettingTool: PropTypes.bool,
  hideEquationTool: PropTypes.bool,
  margin: PropTypes.object,
  onChangeKeypad: PropTypes.func,
  symbols: PropTypes.array,
}

GraphEditTools.defaultProps = {
  side: 'left',
  equations: [],
  setEquations: () => {},
  hideSettingTool: false,
  hideEquationTool: false,
  margin: { top: 0, left: 0 },
  onChangeKeypad: () => {},
  symbols: defaultSymbols,
}

export default withNamespaces('assessment')(GraphEditTools)
