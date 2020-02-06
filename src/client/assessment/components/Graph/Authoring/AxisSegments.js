import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withNamespaces } from "@edulastic/localization";
import { PaddingDiv } from "@edulastic/common";
import { StyledTextField, TitleTextInput } from "../common/styled_components";
import { Row } from "../../../styled/WidgetOptions/Row";
import { Col } from "../../../styled/WidgetOptions/Col";
import { Label } from "../../../styled/WidgetOptions/Label";
import { Subtitle } from "../../../styled/Subtitle";
import { setQuestionDataAction } from "../../../../author/QuestionEditor/ducks";
import QuestionTextArea from "../../QuestionTextArea";
import Question from "../../Question";
import { getFormattedAttrId } from "@edulastic/common/src/helpers";
import { TextInputStyled } from "../../../styled/InputStyles";

class AxisSegments extends Component {
  onChangeQuestion = stimulus => {
    const { graphData, setQuestionData } = this.props;
    setQuestionData({ ...graphData, stimulus });
  };

  handleCanvasChange = event => {
    const { value, name } = event.target;
    const { graphData, setQuestionData } = this.props;
    const { canvas } = graphData;

    if (name !== "title") {
      canvas[name] = parseInt(value) || 1;
    } else {
      canvas[name] = value;
    }

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

  handleInputChange = event => {
    const {
      target: { type, checked, value: targetValue, name }
    } = event;
    const value = type === "checkbox" ? checked : targetValue;

    this.setState({ [name]: value });
  };

  render() {
    const { t, graphData, fillSections, cleanSections, fontSize } = this.props;
    const { canvas, stimulus, firstMount } = graphData;

    return (
      <div>
        <Question
          section="main"
          label="Compose Question"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen
        >
          <Subtitle id={getFormattedAttrId(`${graphData?.title}-${t("component.graphing.question.composequestion")}`)}>
            {t("component.graphing.question.composequestion")}
          </Subtitle>

          <QuestionTextArea
            placeholder={t("component.graphing.question.enteryourquestion")}
            onChange={this.onChangeQuestion}
            value={stimulus}
            firstFocus={firstMount}
            border="border"
            fontSize={fontSize}
          />
        </Question>

        <Question section="main" label="Line" cleanSections={cleanSections} fillSections={fillSections} advancedAreOpen>
          <Subtitle id={getFormattedAttrId(`${graphData?.title}-${t("component.graphing.graphline")}`)}>
            {t("component.graphing.graphline")}
          </Subtitle>
          <Row gutter={24}>
            <Col md={12}>
              <Label>{t("component.graphing.minVal")}</Label>
              <TextInputStyled
                type="number"
                name="xMin"
                value={canvas.xMin}
                onChange={this.handleCanvasChange}
                onBlur={event => this.handleCanvasBlur(event, 0)}
                disabled={false}
                step={1}
              />
            </Col>
            <Col md={12}>
              <Label>{t("component.graphing.maxVal")}</Label>
              <TextInputStyled
                type="number"
                name="xMax"
                value={canvas.xMax}
                onChange={this.handleCanvasChange}
                onBlur={event => this.handleCanvasBlur(event, 10)}
                disabled={false}
                step={1}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col md={12}>
              <Label>{t("component.graphing.responseNumAllowed")}</Label>
              <TextInputStyled
                type="number"
                name="responsesAllowed"
                value={canvas.responsesAllowed}
                onChange={this.handleCanvasChange}
                disabled={false}
                step={1}
                min={1}
              />
            </Col>
          </Row>
        </Question>

        <Question
          section="main"
          label="Title"
          cleanSections={cleanSections}
          fillSections={fillSections}
          advancedAreOpen
        >
          <Subtitle id={getFormattedAttrId(`${graphData?.title}-${t("component.graphing.title")}`)}>
            {t("component.graphing.title")}
          </Subtitle>
          <TextInputStyled type="text" name="title" value={canvas.title} onChange={this.handleCanvasChange} />
        </Question>
      </div>
    );
  }
}

AxisSegments.propTypes = {
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

export default enhance(AxisSegments);
