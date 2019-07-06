import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { cloneDeep } from "lodash";
import { CorrectAnswersContainer, Paper } from "@edulastic/common";

import { compose } from "redux";
import styled from "styled-components";
import { withNamespaces } from "@edulastic/localization";

import { ContentArea } from "../../styled/ContentArea";
import { setQuestionDataAction } from "../../../author/src/actions/question";
import QuadrantsMoreOptions from "./Authoring/GraphQuadrants/QuadrantsMoreOptions";
import AxisSegmentsOptions from "./Authoring/AxisSegmentsOptions";
import AxisLabelsOptions from "./Authoring/AxisLabelsLayoutSettings/AxisLabelsOptions";
import QuadrantsSmallSize from "./components/QuadrantsSmallSize";
import AxisSmallSize from "./components/AxisSmallSize";
import { AxisSegments, GraphAxisLabels, GraphQuadrants, QuestionSection } from "./Authoring";
import GraphAnswers from "./GraphAnswers";
import { GraphDisplay } from "./Display";
import { InstructorStimulus } from "./common/styled_components";
import Annotations from "./Annotations/Annotations";

const EmptyWrapper = styled.div``;

const SmallSizeQuadrantsWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 9px 30px 16px;
`;

const SmallSizeAxisWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const getIgnoreRepeatedShapesOptions = () => [
  { value: "no", label: "No" },
  { value: "yes", label: "Compare by slope" },
  { value: "strict", label: "Compare by points" }
];

const getIgnoreLabelsOptions = () => [{ value: "no", label: "No" }, { value: "yes", label: "Yes" }];

const getFontSizeList = () => [
  { value: "small", label: "Small" },
  { value: "normal", label: "Normal" },
  { value: "large", label: "Large" },
  { value: "extra_large", label: "Extra large" },
  { value: "huge", label: "Huge" }
];

const getStemNumerationList = () => [
  { value: "numerical", label: "Numerical" },
  { value: "uppercase_alphabet", label: "Uppercase alphabet" },
  { value: "lowercase_alphabet", label: "Lowercase alphabet" }
];

class Graph extends Component {
  getOptionsComponent = () => {
    const { item } = this.props;
    const { graphType } = item;

    switch (graphType) {
      case "axisSegments":
        return AxisSegments;
      case "axisLabels":
        return GraphAxisLabels;
      case "quadrants":
      case "firstQuadrant":
      default:
        return GraphQuadrants;
    }
  };

  getMoreOptionsComponent = () => {
    const { item } = this.props;
    const { graphType } = item;

    switch (graphType) {
      case "axisSegments":
        return AxisSegmentsOptions; // number line with plot
      case "axisLabels": // numberline drag drop
        return AxisLabelsOptions;
      case "quadrants":
      case "firstQuadrant":
      default:
        return QuadrantsMoreOptions;
    }
  };

  getMoreOptionsProps = () => {
    const { item } = this.props;
    const { graphType } = item;

    switch (graphType) {
      case "axisSegments":
        return this.getAxisSegmentsOptionsProps();
      case "axisLabels":
        return this.getAxisLabelsOptionsProps();
      case "quadrants":
      case "firstQuadrant":
      default:
        return this.getQuadrantsOptionsProps();
    }
  };

  getQuadrantsOptionsProps = () => {
    const { item, fillSections, cleanSections, advancedAreOpen } = this.props;

    return {
      stemNumerationList: getStemNumerationList(),
      fontSizeList: getFontSizeList(),
      setOptions: this.handleOptionsChange,
      setValidation: this.handleValidationChange,
      setControls: this.handleControlbarChange,
      setBgImg: this.handleBgImgChange,
      setBgShapes: this.handleBgShapesChange,
      graphData: item,
      setAnnotation: this.handleAnnotationChange,
      fillSections,
      cleanSections,
      advancedAreOpen
    };
  };

  getAxisLabelsOptionsProps = () => {
    const { item, fillSections, cleanSections, advancedAreOpen } = this.props;

    return {
      setOptions: this.handleOptionsChange,
      setNumberline: this.handleNumberlineChange,
      setCanvas: this.handleCanvasChange,
      graphData: item,
      fillSections,
      cleanSections,
      advancedAreOpen,
      setValidation: this.handleValidationChange
    };
  };

  getAxisSegmentsOptionsProps = () => {
    const { item, fillSections, cleanSections, advancedAreOpen } = this.props;

    return {
      setOptions: this.handleOptionsChange,
      setNumberline: this.handleNumberlineChange,
      setCanvas: this.handleCanvasChange,
      setControls: this.handleToolbarChange,
      graphData: item,
      fillSections,
      cleanSections,
      advancedAreOpen,
      setValidation: this.handleValidationChange
    };
  };

  handleToolbarChange = options => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, toolbar: options });
  };

  handleControlbarChange = options => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, controlbar: options });
  };

  handleValidationChange = options => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, validation: options });
  };

  handleNumberlineChange = options => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, numberlineAxis: options });
  };

  handleOptionsChange = options => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, ui_style: options });
  };

  handleAnnotationChange = options => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, annotation: options });
  };

  handleCanvasChange = options => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, canvas: options });
  };

  handleBgImgChange = bgImgOptions => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, background_image: bgImgOptions });
  };

  handleBgShapesChange = bgShapes => {
    const { setQuestionData, item } = this.props;
    setQuestionData({ ...item, background_shapes: bgShapes });
  };

  handleAddAltResponses = () => {
    const { setQuestionData, item } = this.props;
    const newItem = cloneDeep(item);

    const response = {
      id: `alt-${Math.random().toString(36)}`,
      score: 1,
      value: []
    };

    if (newItem.validation.alt_responses && newItem.validation.alt_responses.length) {
      newItem.validation.alt_responses.push(response);
    } else {
      newItem.validation.alt_responses = [response];
    }

    setQuestionData(newItem);
  };

  handleRemoveAltResponses = index => {
    const { setQuestionData, item } = this.props;
    const newItem = cloneDeep(item);

    if (newItem.validation.alt_responses && newItem.validation.alt_responses.length) {
      newItem.validation.alt_responses = newItem.validation.alt_responses.filter((response, i) => i !== index);
    }

    setQuestionData(newItem);
  };

  handleAddAnswer = qid => {
    const { saveAnswer } = this.props;
    saveAnswer(qid);
  };

  handleSelectIgnoreRepeatedShapes = value => {
    const { item, setQuestionData } = this.props;
    const newItem = cloneDeep(item);
    newItem.validation.ignore_repeated_shapes = value;
    setQuestionData({ ...newItem });
  };

  handleSelectIgnoreLabels = value => {
    const { item, setQuestionData } = this.props;
    const newItem = cloneDeep(item);
    newItem.validation.ignore_labels = value;
    setQuestionData({ ...newItem });
  };

  render() {
    const {
      t,
      view,
      item,
      smallSize,
      testItem,
      previewTab,
      userAnswer,
      evaluation,
      fillSections,
      cleanSections,
      advancedAreOpen,
      isSidebarCollapsed,
      disableResponse,
      ...restProps
    } = this.props;
    const { extra_options, ui_style, validation } = item;
    const OptionsComponent = this.getOptionsComponent();
    const MoreOptionsComponent = this.getMoreOptionsComponent();

    const Wrapper = testItem ? EmptyWrapper : Paper;

    return (
      <React.Fragment>
        {view === "edit" && (
          <React.Fragment>
            <ContentArea isSidebarCollapsed={isSidebarCollapsed}>
              <OptionsComponent
                graphData={item}
                canvas={item.canvas}
                fillSections={fillSections}
                cleanSections={cleanSections}
                advancedAreOpen
                setCanvas={this.handleCanvasChange}
              />
              <QuestionSection
                section="main"
                label="Set Correct Answer"
                cleanSections={cleanSections}
                fillSections={fillSections}
                deskHeight={ui_style.layout_height}
                advancedAreOpen
              >
                <GraphAnswers
                  view={view}
                  graphData={item}
                  previewTab={previewTab}
                  disableResponse={disableResponse}
                  onAddAltResponses={this.handleAddAltResponses}
                  getIgnoreLabelsOptions={getIgnoreLabelsOptions}
                  onRemoveAltResponses={this.handleRemoveAltResponses}
                  handleSelectIgnoreLabels={this.handleSelectIgnoreLabels}
                  getIgnoreRepeatedShapesOptions={getIgnoreRepeatedShapesOptions}
                  handleSelectIgnoreRepeatedShapes={this.handleSelectIgnoreRepeatedShapes}
                />
              </QuestionSection>
              <QuestionSection
                section="main"
                label="Annotations"
                cleanSections={cleanSections}
                fillSections={fillSections}
                advancedAreOpen
              >
                <Annotations editable />
              </QuestionSection>
              <MoreOptionsComponent advancedAreOpen={advancedAreOpen} {...this.getMoreOptionsProps()} />
            </ContentArea>
          </React.Fragment>
        )}
        {view === "preview" && smallSize === false && item && (
          <Wrapper>
            {extra_options && extra_options.instructor_stimulus && (
              <InstructorStimulus>{extra_options.instructor_stimulus}</InstructorStimulus>
            )}
            {previewTab === "check" && item.canvas && item.ui_style && (
              <GraphDisplay
                disableResponse={disableResponse}
                checkAnswer
                graphData={item}
                view={view}
                previewTab={previewTab}
                onChange={this.handleAddAnswer}
                elements={userAnswer}
                evaluation={evaluation}
                {...restProps}
              />
            )}
            {previewTab === "show" && item.canvas && item.ui_style && (
              <Fragment>
                <GraphDisplay
                  disableResponse={disableResponse}
                  checkAnswer
                  graphData={item}
                  view={view}
                  previewTab={previewTab}
                  onChange={this.handleAddAnswer}
                  elements={userAnswer}
                  evaluation={evaluation}
                  {...restProps}
                />

                <CorrectAnswersContainer title={t("component.graphing.correctAnswer")}>
                  <GraphDisplay
                    disableResponse
                    showAnswer
                    graphData={item}
                    view={view}
                    previewTab={previewTab}
                    onChange={this.handleAddAnswer}
                    elements={validation.valid_response.value}
                    evaluation={evaluation}
                    {...restProps}
                  />
                </CorrectAnswersContainer>

                {validation.alt_responses &&
                  validation.alt_responses.map((altAnswer, i) => (
                    <CorrectAnswersContainer title={`${t("component.graphing.alternateAnswer")} ${i + 1}`}>
                      <GraphDisplay
                        disableResponse
                        showAnswer
                        graphData={item}
                        view={view}
                        previewTab={previewTab}
                        onChange={this.handleAddAnswer}
                        elements={altAnswer.value}
                        evaluation={evaluation}
                        {...restProps}
                      />
                    </CorrectAnswersContainer>
                  ))}
              </Fragment>
            )}
            {previewTab === "clear" && item.canvas && item.ui_style && (
              <GraphDisplay
                disableResponse={disableResponse}
                clearAnswer
                graphData={item}
                view={view}
                previewTab={previewTab}
                onChange={this.handleAddAnswer}
                elements={userAnswer}
                evaluation={evaluation}
                {...restProps}
              />
            )}
          </Wrapper>
        )}
        {view === "preview" && smallSize && (
          <React.Fragment>
            {item.graphType === "firstQuadrant" && (
              <SmallSizeQuadrantsWrapper>
                <QuadrantsSmallSize first />
              </SmallSizeQuadrantsWrapper>
            )}
            {item.graphType === "axisSegments" && (
              <SmallSizeAxisWrapper>
                <AxisSmallSize segments />
              </SmallSizeAxisWrapper>
            )}
            {item.graphType === "axisLabels" && (
              <SmallSizeAxisWrapper>
                <AxisSmallSize labels />
              </SmallSizeAxisWrapper>
            )}
            {item.graphType === "quadrants" && (
              <SmallSizeQuadrantsWrapper>
                <QuadrantsSmallSize />
              </SmallSizeQuadrantsWrapper>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
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
  cleanSections: PropTypes.func.isRequired,
  fillSections: PropTypes.func.isRequired,
  isSidebarCollapsed: PropTypes.bool.isRequired,
  advancedAreOpen: PropTypes.bool,
  disableResponse: PropTypes.bool,
  t: PropTypes.func.isRequired
};

Graph.defaultProps = {
  smallSize: false,
  previewTab: "clear",
  testItem: false,
  userAnswer: [],
  evaluation: null,
  advancedAreOpen: false,
  disableResponse: false
};

const enhance = compose(
  withNamespaces("assessment"),
  connect(
    ({ authorUi }) => ({ isSidebarCollapsed: authorUi.isSidebarCollapsed }),
    { setQuestionData: setQuestionDataAction }
  )
);

const GraphComponent = enhance(Graph);

export default GraphComponent;
