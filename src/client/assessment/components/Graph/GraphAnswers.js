import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import { Select } from "antd";
import { cloneDeep } from "lodash";

import { TabContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import CorrectAnswers from "../CorrectAnswers";
import withPoints from "../HOC/withPoints";
import GraphDisplay from "./Display/GraphDisplay";

import {
  setQuestionDataAction,
  getQuestionDataSelector
} from "../../../author/QuestionEditor/ducks";
import { CheckboxLabel } from "../../styled/CheckboxWithLabel";
import { SelectInputStyled } from "../../styled/InputStyles";
import { Label } from "../../styled/WidgetOptions/Label";
import { Row } from "../../styled/WidgetOptions/Row";
import { Col } from "../../styled/WidgetOptions/Col";

const GraphDisplayWithPoints = withPoints(GraphDisplay);

class GraphAnswers extends Component {
  state = {
    tab: 0
  };

  handleTabChange = tab => {
    this.setState({ tab });
  };

  handleAltResponseClose = i => {
    const { onRemoveAltResponses } = this.props;
    const { tab } = this.state;
    if (i <= tab - 1) {
      this.handleTabChange(tab - 1);
    }
    onRemoveAltResponses(i);
  };

  handleAddAnswer = () => {
    const { onAddAltResponses, graphData } = this.props;
    const { validation } = graphData;

    this.handleTabChange(validation.altResponses.length + 1);
    onAddAltResponses();
  };

  handleUpdateCorrectScore = points => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    newData.validation.validResponse.score = points;

    setQuestionData(newData);
  };

  updateValidationValue = value => {
    const { question, setQuestionData } = this.props;
    const { validation, toolbar } = question;
    for (let i = 0; i < value.length; i++) {
      if (typeof value[i].label !== "boolean") {
        value[i].label = value[i].label.replace(/<p>/g, "").replace(/<\/p>/g, "");
      }
    }
    if (toolbar && toolbar.drawingPrompt) {
      toolbar.drawingObjects = this.getDrawingObjects(value);
    }
    validation.validResponse.value = value;
    setQuestionData({ ...question, validation, toolbar });
  };

  updateAltValidationValue = (value, tabIndex) => {
    const { question, setQuestionData } = this.props;
    const { validation } = question;
    validation.altResponses[tabIndex].value = value;
    setQuestionData({ ...question, validation });
  };

  handleUpdateAltValidationScore = i => points => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    newData.validation.altResponses[i].score = points;

    setQuestionData(newData);
  };

  getDrawingObjects = value => {
    const allowedTypes = [
      "point",
      "line",
      "ray",
      "segment",
      "vector",
      "circle",
      "ellipse",
      "sine",
      "tangent",
      "secant",
      "exponent",
      "logarithm",
      "polynom",
      "hyperbola",
      "polygon",
      "parabola",
      "parabola2"
    ];

    const shapes = value.filter(elem => allowedTypes.includes(elem.type) && !elem.subElement);
    return shapes.map(elem => {
      const { id, type, label, baseColor, dashed } = elem;
      const result = { id, type, label, baseColor };

      if (type !== "point") {
        result.dashed = dashed;
        result.pointLabels = Object.values(elem.subElementsIds).map(pointId => {
          const point = value.find(item => item.id === pointId);
          return {
            label: point ? point.label : "",
            baseColor: point.baseColor
          };
        });
      }

      return result;
    });
  };

  renderOptions = () => {
    const {
      t,
      getIgnoreLabelsOptions,
      graphData,
      handleSelectIgnoreLabels,
      getIgnoreRepeatedShapesOptions,
      handleSelectIgnoreRepeatedShapes,
      handleNumberlineChange
    } = this.props;

    if (graphData.graphType === "quadrants" || graphData.graphType === "firstQuadrant") {
      return (
        <Fragment>
          <Row marginTop={15} gutter={24}>
            <Col span={8}>
              <Label>Ignore repeated shapes</Label>
              <SelectInputStyled
                data-cy="ignoreRepeatedShapes"
                onChange={val => handleSelectIgnoreRepeatedShapes(val)}
                options={getIgnoreRepeatedShapesOptions()}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                value={graphData.validation.ignore_repeated_shapes || "no"}
              >
                {getIgnoreRepeatedShapesOptions().map(option => (
                  <Select.Option data-cy={option.value} key={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </Col>
            <Col span={4}>
              <Label>Ignore labels</Label>
              <SelectInputStyled
                data-cy="ignoreLabels"
                onChange={val => handleSelectIgnoreLabels(val)}
                options={getIgnoreLabelsOptions()}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                value={graphData.validation.ignoreLabels || "yes"}
              >
                {getIgnoreLabelsOptions().map(option => (
                  <Select.Option data-cy={option.value} key={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </Col>
          </Row>
        </Fragment>
      );
    }

    if (graphData.graphType === "axisLabels") {
      const { numberlineAxis } = graphData;
      return (
        <CheckboxLabel
          name="shuffleAnswerChoices"
          onChange={() =>
            handleNumberlineChange({
              ...numberlineAxis,
              shuffleAnswerChoices: !numberlineAxis.shuffleAnswerChoices
            })
          }
          checked={numberlineAxis.shuffleAnswerChoices}
        >
          {t("component.graphing.shuffleAnswerChoices")}
        </CheckboxLabel>
      );
    }
  };

  render() {
    const { graphData, view, previewTab, ...rest } = this.props;
    const { tab } = this.state;

    return (
      <CorrectAnswers
        {...rest}
        correctTab={tab}
        onAdd={this.handleAddAnswer}
        validation={graphData.validation}
        options={this.renderOptions()}
        onTabChange={this.handleTabChange}
        onCloseTab={this.handleAltResponseClose}
        questionType={graphData?.title}
      >
        <Fragment>
          {tab === 0 && (
            <TabContainer>
              <GraphDisplayWithPoints
                value={graphData.validation.validResponse.score}
                onChangePoints={this.handleUpdateCorrectScore}
                view={view}
                graphData={graphData}
                previewTab={previewTab}
                altAnswerId={graphData.validation.validResponse.id}
                elements={graphData.validation.validResponse.value}
                disableResponse={false}
                onChange={this.updateValidationValue}
                points={graphData.validation.validResponse.score}
              />
            </TabContainer>
          )}
          {graphData.validation.altResponses &&
            !!graphData.validation.altResponses.length &&
            graphData.validation.altResponses.map((alter, i) => {
              if (i + 1 === tab) {
                return (
                  <TabContainer>
                    <GraphDisplayWithPoints
                      key={`alt-answer-${i}`}
                      value={alter.score}
                      onChangePoints={this.handleUpdateAltValidationScore(i)}
                      view={view}
                      graphData={graphData}
                      previewTab={previewTab}
                      altAnswerId={alter.id}
                      elements={alter.value}
                      disableResponse={false}
                      onChange={val => this.updateAltValidationValue(val, i)}
                      points={alter.score}
                    />
                  </TabContainer>
                );
              }
              return null;
            })}
        </Fragment>
      </CorrectAnswers>
    );
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
  handleNumberlineChange: PropTypes.func.isRequired
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    state => ({
      question: getQuestionDataSelector(state)
    }),
    { setQuestionData: setQuestionDataAction }
  )
);

export default enhance(GraphAnswers);
