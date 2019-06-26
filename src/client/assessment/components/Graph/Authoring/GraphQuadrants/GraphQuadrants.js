import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withNamespaces } from "@edulastic/localization";
import { PaddingDiv } from "@edulastic/common";
import { QuestionSection } from "..";
import { StyledTextField } from "../../common/styled_components";
import GraphToolsParams from "../../components/GraphToolsParams";
import { setQuestionDataAction } from "../../../../../author/QuestionEditor/ducks";
import QuestionTextArea from "../../../QuestionTextArea";
import { Row } from "../../../../styled/WidgetOptions/Row";
import { Col } from "../../../../styled/WidgetOptions/Col";
import { Label } from "../../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../../styled/Subtitle";

const X_RATIO = "x_ratio";
const Y_RATIO = "y_ratio";
const X_MIN = "x_min";
const X_MAX = "x_max";
const Y_MIN = "y_min";
const Y_MAX = "y_max";

class GraphQuadrants extends Component {
  onChangeQuestion = stimulus => {
    const { graphData, setQuestionData } = this.props;
    setQuestionData({ ...graphData, stimulus });
  };

  handleCanvasChange = event => {
    const { value, name } = event.target;
    const { graphData, setQuestionData } = this.props;
    const { canvas } = graphData;

    canvas[name] = value;
    canvas[X_RATIO] = 1;
    canvas[Y_RATIO] = 1;
    setQuestionData({ ...graphData, canvas });
  };

  handleRatioChange = event => {
    let { value } = event.target;
    const { name } = event.target;
    const { graphData, setQuestionData } = this.props;
    const { canvas } = graphData;

    value = parseFloat(value);
    value = value > 0 ? value : 1;
    if (name === X_RATIO) {
      canvas[X_MIN] = +(parseFloat(canvas[X_MIN]) * (value / canvas[X_RATIO])).toFixed(4);
      canvas[X_MAX] = +(parseFloat(canvas[X_MAX]) * (value / canvas[X_RATIO])).toFixed(4);
    } else if (name === Y_RATIO) {
      canvas[Y_MIN] = +(parseFloat(canvas[Y_MIN]) * (value / canvas[Y_RATIO])).toFixed(4);
      canvas[Y_MAX] = +(parseFloat(canvas[Y_MAX]) * (value / canvas[Y_RATIO])).toFixed(4);
    }

    canvas[name] = value;
    setQuestionData({ ...graphData, canvas });
  };

  handleCanvasBlur = (event, defaultValue) => {
    const { value, name } = event.target;
    const { graphData, setQuestionData } = this.props;
    const { canvas } = graphData;

    if (!value) {
      canvas[name] = defaultValue;
      setQuestionData({ ...graphData, canvas });
    }
  };

  handleToolsChange = toolbar => {
    const { graphData, setQuestionData } = this.props;
    setQuestionData({ ...graphData, toolbar });
  };

  getToolOptions = () => [
    { value: "point", label: "Point" },
    { value: "line", label: "Line" },
    { value: "ray", label: "Ray" },
    { value: "segment", label: "Segment" },
    { value: "vector", label: "Vector" },
    { value: "circle", label: "Circle" },
    { value: "ellipse", label: "Ellipse" },
    { value: "parabola", label: "Parabola" },
    { value: "sine", label: "Sine" },
    { value: "tangent", label: "Tangent" },
    { value: "secant", label: "Secant" },
    { value: "exponent", label: "Exponent" },
    { value: "polynom", label: "Polynom" },
    { value: "logarithm", label: "Logarithm" },
    { value: "hyperbola", label: "Hyperbola" },
    { value: "polygon", label: "Polygon" },
    { value: "area", label: "Area" },
    { value: "label", label: "Label" }
  ];

  getDrawingPromptOptions = () => [
    { value: "byTools", label: "By drawing tools" },
    { value: "byObjects", label: "By objects" }
  ];

  render() {
    const { t, graphData, fillSections, cleanSections } = this.props;
    const { canvas } = graphData;

    return (
      <div>
        <QuestionSection
          section="main"
          label="Compose Question"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen
        >
          <Subtitle>{t("component.graphing.question.composequestion")}</Subtitle>

          <QuestionTextArea
            onChange={this.onChangeQuestion}
            value={graphData.stimulus}
            firstFocus={graphData.firstMount}
            placeholder={t("component.graphing.question.enteryourquestion")}
            theme="border"
          />
        </QuestionSection>
        <QuestionSection
          section="main"
          label="Graph Parameters"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen
        >
          <PaddingDiv>
            <Subtitle>{t("component.graphing.graphparameters")}</Subtitle>
            <Row gutter={60}>
              <Col md={12}>
                <Label>X min</Label>
                <StyledTextField
                  width="100%"
                  type="number"
                  name={X_MIN}
                  value={canvas[X_MIN]}
                  onChange={this.handleCanvasChange}
                  onBlur={event => this.handleCanvasBlur(event, -10)}
                  disabled={false}
                  step={0.1}
                />
                <Label>X max</Label>
                <StyledTextField
                  width="100%"
                  type="number"
                  name={X_MAX}
                  value={canvas[X_MAX]}
                  onChange={this.handleCanvasChange}
                  onBlur={event => this.handleCanvasBlur(event, 10)}
                  disabled={false}
                  step={0.1}
                />
                <Label>X Axis : Y Axis</Label>
                <StyledTextField
                  marginBottom="0"
                  marginRight="0"
                  width="25%"
                  type="number"
                  name={X_RATIO}
                  value={canvas[X_RATIO]}
                  onChange={this.handleRatioChange}
                  onBlur={event => this.handleCanvasBlur(event, 1)}
                  disabled={false}
                  step={0.1}
                />
                <span style={{ margin: "0 4px" }}>:</span>
                <StyledTextField
                  marginBottom="0"
                  width="25%"
                  type="number"
                  name={Y_RATIO}
                  value={canvas[Y_RATIO]}
                  onChange={this.handleRatioChange}
                  onBlur={event => this.handleCanvasBlur(event, 1)}
                  disabled={false}
                  step={0.1}
                />
              </Col>
              <Col md={12}>
                <Label>Y min</Label>
                <StyledTextField
                  width="100%"
                  type="number"
                  name={Y_MIN}
                  value={canvas[Y_MIN]}
                  onChange={this.handleCanvasChange}
                  onBlur={event => this.handleCanvasBlur(event, -10)}
                  disabled={false}
                  step={0.1}
                />
                <Label>Y max</Label>
                <StyledTextField
                  marginBottom="0"
                  width="100%"
                  type="number"
                  name={Y_MAX}
                  value={canvas[Y_MAX]}
                  onChange={this.handleCanvasChange}
                  onBlur={event => this.handleCanvasBlur(event, 10)}
                  disabled={false}
                  step={0.1}
                />
              </Col>
            </Row>
          </PaddingDiv>
        </QuestionSection>
        <QuestionSection
          section="main"
          label="Tools"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen
        >
          <PaddingDiv>
            <Subtitle>{t("component.graphing.tools")}</Subtitle>
            <GraphToolsParams
              toolOptions={this.getToolOptions()}
              drawingPromptOptions={this.getDrawingPromptOptions()}
              toolbar={graphData.toolbar}
              onChange={this.handleToolsChange}
            />
          </PaddingDiv>
        </QuestionSection>
      </div>
    );
  }
}

GraphQuadrants.propTypes = {
  t: PropTypes.func.isRequired,
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  graphData: PropTypes.object.isRequired,
  setQuestionData: PropTypes.func.isRequired
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(GraphQuadrants);
