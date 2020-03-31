import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";

import { Overlay, Popup, PopupContent } from "../../common/styled_components";

import { Wrapper } from "./styled/Wrapper";
import { ToolButton } from "./styled/ToolButton";
import { IconFuncSymbol } from "./styled/IconFuncSymbol";
import { IconPlus } from "./styled/IconPlus";
import { IconMinus } from "./styled/IconMinus";
import { IconSpanner } from "./styled/IconSpanner";
import Equations from "./components/Equations";
import Settings from "./components/Settings";
import Annotations from "./components/Annotations";

const FUNCTIONS_TOOL = "functionsTool";
const SETTINGS_TOOL = "settingsTool";
const ANNOTATIONS_TOOL = "annotationsTool";
const PLUS_TOOL = "plusTool";
const MINUS_TOOL = "minusTool";

class GraphEditTools extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTool: null
    };
  }

  changeScale(tool) {
    const { setQuestionData, graphData } = this.props;

    const newGraphData = cloneDeep(graphData);
    let {
      canvas: { xMin, xMax, yMin, yMax },
      uiStyle: { xDistance, yDistance }
    } = newGraphData;

    xMin = parseFloat(xMin);
    xMax = parseFloat(xMax);
    yMin = parseFloat(yMin);
    yMax = parseFloat(yMax);
    xDistance = parseFloat(xDistance);
    yDistance = parseFloat(yDistance);

    if (
      Number.isNaN(xMin) ||
      Number.isNaN(xMax) ||
      Number.isNaN(yMin) ||
      Number.isNaN(yMax) ||
      Number.isNaN(xDistance) ||
      Number.isNaN(yDistance)
    ) {
      return;
    }

    if (tool === MINUS_TOOL) {
      xMin *= 2;
      xMax *= 2;
      yMin *= 2;
      yMax *= 2;
      xDistance *= 2;
      yDistance *= 2;
    } else if (tool === PLUS_TOOL) {
      xMin /= 2;
      xMax /= 2;
      yMin /= 2;
      yMax /= 2;
      xDistance /= 2;
      yDistance /= 2;
    }

    xMin = +xMin.toFixed(8);
    xMax = +xMax.toFixed(8);
    yMin = +yMin.toFixed(8);
    yMax = +yMax.toFixed(8);
    xDistance = +xDistance.toFixed(8);
    yDistance = +yDistance.toFixed(8);

    newGraphData.canvas = {
      ...newGraphData.canvas,
      xMin,
      xMax,
      yMin,
      yMax
    };
    newGraphData.uiStyle = {
      ...newGraphData.uiStyle,
      xDistance,
      yDistance,
      xTickDistance: xDistance,
      yTickDistance: yDistance
    };

    setQuestionData(newGraphData);
  }

  onToolButtonClick(tool) {
    switch (tool) {
      case FUNCTIONS_TOOL:
      case SETTINGS_TOOL:
      case ANNOTATIONS_TOOL:
        this.setState({
          selectedTool: tool
        });
        break;
      case PLUS_TOOL:
      case MINUS_TOOL:
        this.changeScale(tool);
        break;
      default:
        break;
    }
  }

  onOverlayClick(e) {
    e.stopPropagation();
    this.setState({
      selectedTool: null
    });
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
      hideSettingTool
    } = this.props;

    const { selectedTool } = this.state;

    return (
      <Fragment>
        {side === "left" && (
          <Wrapper side={side} width={width} margin={margin}>
            {!hideEquationTool && (
              <ToolButton
                selected={selectedTool === FUNCTIONS_TOOL}
                onClick={() => this.onToolButtonClick(FUNCTIONS_TOOL)}
              >
                <IconFuncSymbol />
                {selectedTool === FUNCTIONS_TOOL && (
                  <Fragment>
                    <Overlay onClick={e => this.onOverlayClick(e)} />
                    <Popup right>
                      <PopupContent>
                        <Equations equations={equations} setEquations={setEquations} />
                      </PopupContent>
                    </Popup>
                  </Fragment>
                )}
              </ToolButton>
            )}
            <ToolButton
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
            </ToolButton>
          </Wrapper>
        )}
        {side === "right" && (
          <Wrapper side={side} width={width} margin={margin}>
            {!hideSettingTool && (
              <ToolButton
                selected={selectedTool === SETTINGS_TOOL}
                onClick={() => this.onToolButtonClick(SETTINGS_TOOL)}
              >
                <IconSpanner />
                {selectedTool === SETTINGS_TOOL && (
                  <Fragment>
                    <Overlay onClick={e => this.onOverlayClick(e)} />
                    <Popup left>
                      <PopupContent>
                        <Settings graphData={graphData} setQuestionData={setQuestionData} />
                      </PopupContent>
                    </Popup>
                  </Fragment>
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
      </Fragment>
    );
  }
}

GraphEditTools.propTypes = {
  side: PropTypes.string,
  graphData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  setQuestionData: PropTypes.func.isRequired,
  layout: PropTypes.object.isRequired,
  equations: PropTypes.array,
  setEquations: PropTypes.func,
  hideSettingTool: PropTypes.bool,
  hideEquationTool: PropTypes.bool,
  margin: PropTypes.object
};

GraphEditTools.defaultProps = {
  side: "left",
  equations: [],
  setEquations: () => {},
  hideSettingTool: false,
  hideEquationTool: false,
  margin: { top: 0, left: 0 }
};

export default GraphEditTools;
