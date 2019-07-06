import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";

import { TabContainer } from "@edulastic/common";
import PropTypes from "prop-types";
import { Select } from "antd";
import CorrectAnswers from "../../components/CorrectAnswers";
import withPoints from "../../components/HOC/withPoints";
import GraphDisplay from "./Display/GraphDisplay";

import { setQuestionDataAction, getQuestionDataSelector } from "../../../author/QuestionEditor/ducks";

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

    this.handleTabChange(validation.alt_responses.length + 1);
    onAddAltResponses();
  };

  handleUpdateCorrectScore = points => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    newData.validation.valid_response.score = points;

    setQuestionData(newData);
  };

  updateValidationValue = value => {
    const { question, setQuestionData } = this.props;
    const { validation } = question;
    const { toolbar } = question;
    toolbar.drawingObjects = this.getDrawingObjects(value);
    validation.valid_response.value = value;
    setQuestionData({ ...question, validation, toolbar });
  };

  updateAltValidationValue = (value, tabIndex) => {
    const { question, setQuestionData } = this.props;
    const { validation } = question;
    validation.alt_responses[tabIndex].value = value;
    setQuestionData({ ...question, validation });
  };

  handleUpdateAltValidationScore = i => points => {
    const { question, setQuestionData } = this.props;
    const newData = cloneDeep(question);

    newData.validation.alt_responses[i].score = points;

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
      "parabola"
    ];

    const shapes = value.filter(elem => allowedTypes.includes(elem.type) && !elem.subElement);
    return shapes.map(elem => {
      const { id, type, label } = elem;
      const result = { id, type, label };

      if (type !== "point") {
        result.pointLabels = Object.values(elem.subElementsIds).map(pointId => {
          const point = value.find(item => item.id === pointId);
          return point ? point.label : "";
        });
      }

      return result;
    });
  };

  renderOptions = () => {
    const {
      getIgnoreLabelsOptions,
      graphData,
      handleSelectIgnoreLabels,
      getIgnoreRepeatedShapesOptions,
      handleSelectIgnoreRepeatedShapes
    } = this.props;

    if (graphData.graphType === "quadrants" || graphData.graphType === "firstQuadrant") {
      return (
        <React.Fragment>
          <Select
            data-cy="ignoreRepeatedShapes"
            style={{
              width: "170px",
              margin: "11px 10px 0 0",
              borderRadius: "10px"
            }}
            onChange={val => handleSelectIgnoreRepeatedShapes(val)}
            options={getIgnoreRepeatedShapesOptions()}
            value={graphData.validation.ignore_repeated_shapes || "no"}
          >
            {getIgnoreRepeatedShapesOptions().map(option => (
              <Select.Option data-cy={option.value} key={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>{" "}
          Ignore repeated shapes
          <Select
            data-cy="ignoreLabels"
            style={{
              width: "70px",
              margin: "11px 10px 0 25px",
              borderRadius: "10px"
            }}
            onChange={val => handleSelectIgnoreLabels(val)}
            options={getIgnoreLabelsOptions()}
            value={graphData.validation.ignore_labels || "yes"}
          >
            {getIgnoreLabelsOptions().map(option => (
              <Select.Option data-cy={option.value} key={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>{" "}
          Ignore labels
        </React.Fragment>
      );
    }
  };

  render() {
    const { disableResponse, graphData, view, previewTab } = this.props;
    const { tab } = this.state;

    return (
      <CorrectAnswers
        correctTab={tab}
        onAdd={this.handleAddAnswer}
        validation={graphData.validation}
        options={this.renderOptions()}
        onTabChange={this.handleTabChange}
        onCloseTab={this.handleAltResponseClose}
      >
        <Fragment>
          {tab === 0 && (
            <TabContainer>
              <GraphDisplayWithPoints
                value={graphData.validation.valid_response.score}
                onChangePoints={this.handleUpdateCorrectScore}
                view={view}
                graphData={graphData}
                previewTab={previewTab}
                altAnswerId={graphData.validation.valid_response.id}
                elements={graphData.validation.valid_response.value}
                disableResponse={disableResponse}
                onChange={this.updateValidationValue}
              />
            </TabContainer>
          )}
          {graphData.validation.alt_responses &&
            !!graphData.validation.alt_responses.length &&
            graphData.validation.alt_responses.map((alter, i) => {
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
                      disableResponse={disableResponse}
                      onChange={val => this.updateAltValidationValue(val, i)}
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
  graphData: PropTypes.object.isRequired,
  onAddAltResponses: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  onRemoveAltResponses: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
  previewTab: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  disableResponse: PropTypes.bool
};

GraphAnswers.defaultProps = {
  disableResponse: false
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
