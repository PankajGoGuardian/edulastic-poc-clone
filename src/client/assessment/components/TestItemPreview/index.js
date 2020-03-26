/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { ThemeProvider, withTheme } from "styled-components";

import { withWindowSizes, ScratchPadContext, ScrollContext } from "@edulastic/common";
import { IconArrowLeft, IconArrowRight } from "@edulastic/icons";
import { questionType } from "@edulastic/constants";

import { themes } from "../../../theme";
import TestItemCol from "./containers/TestItemCol";
import { Container, Divider, CollapseBtn } from "./styled/Container";
import FeedbackWrapper from "../FeedbackWrapper";
import SvgDraw from "../../themes/AssessmentPlayerDefault/SvgDraw";

import Hints from "../Hints";
import Explanation from "../Common/Explanation";

class TestItemPreview extends Component {
  static propTypes = {
    cols: PropTypes.array.isRequired,
    verticalDivider: PropTypes.bool,
    scrolling: PropTypes.bool,
    preview: PropTypes.string.isRequired,
    windowWidth: PropTypes.number.isRequired,
    showFeedback: PropTypes.bool,
    style: PropTypes.object,
    questions: PropTypes.object.isRequired,
    qIndex: PropTypes.number,
    student: PropTypes.object
  };

  static defaultProps = {
    showFeedback: false,
    verticalDivider: false,
    scrolling: false,
    style: { padding: 0, display: "flex" },
    qIndex: null,
    student: {}
  };

  state = {
    collapseDirection: "",
    value: 0
  };

  containerRef = React.createRef();

  getStyle = first => {
    const { verticalDivider, scrolling } = this.props;

    const style = {};

    if (first && verticalDivider) {
      style.borderRightWidth = "3px";
      style.borderRightStyle = "solid";
    }

    if (scrolling) {
      style.height = "calc(100vh - 200px)";
      style.overflowY = "auto";
    }

    return style;
  };

  setCollapseView = dir => {
    this.setState(prevState => ({
      collapseDirection: prevState.collapseDirection ? "" : dir
    }));
  };

  renderCollapseButtons = () => {
    const { collapseDirection } = this.state;
    return (
      <Divider isCollapsed={!!collapseDirection} collapseDirection={collapseDirection}>
        <div>
          <CollapseBtn collapseDirection={collapseDirection} onClick={() => this.setCollapseView("left")} left className="left-collapse-btn">
            <IconArrowLeft />
          </CollapseBtn>
          <CollapseBtn collapseDirection={collapseDirection} onClick={() => this.setCollapseView("right")} right className="right-collapse-btn">
            <IconArrowRight />
          </CollapseBtn>
        </div>
      </Divider>
    );
  };

  renderFeedback = (widget, index) => {
    const {
      showFeedback,
      previousQuestionActivity = [],
      isStudentReport,
      isPresentationMode,
      questions,
      isPrintPreview,
      showCollapseBtn,
      hideHintButton,
      showExplanation,
      enableMagnifier
    } = this.props;
    const displayFeedback = index == 0;
    const question = questions[widget.reference];
    const prevQActivityForQuestion = previousQuestionActivity.find(qa => qa.qid === question.id);
    return (
      <>
        <FeedbackWrapper
          showFeedback={showFeedback}
          displayFeedback={displayFeedback}
          isPrintPreview={isPrintPreview}
          showCollapseBtn={showCollapseBtn}
          prevQActivityForQuestion={prevQActivityForQuestion}
          data={{ ...question, smallSize: true }}
          isStudentReport={isStudentReport}
          isPresentationMode={isPresentationMode}
        />
        {hideHintButton && <Hints question={question} showHints enableMagnifier={enableMagnifier} />}
        {showExplanation && <Explanation question={question} />}
      </>
    );
  };

  renderFeedbacks = () => {
    const { cols } = this.props;
    const { value } = this.state;
    return cols.map(col =>
      col.widgets
        .filter(widget => widget.type !== questionType.SECTION_LABEL && widget.widgetType !== "resource")
        .map((widget, i) => (
          <React.Fragment key={i}>
            {col.tabs && !!col.tabs.length && value === widget.tabIndex && this.renderFeedback(widget, i)}
            {col.tabs && !col.tabs.length && this.renderFeedback(widget, i)}
          </React.Fragment>
        ))
    );
  };

  render() {
    const {
      cols,
      preview,
      style,
      windowWidth,
      showFeedback,
      questions,
      qIndex,
      student,
      metaData,
      disableResponse,
      evaluation,
      previewTab,
      LCBPreviewModal,
      showCollapseBtn = false,
      activeMode,
      scratchPadMode,
      lineColor,
      deleteMode,
      lineWidth,
      fillColor,
      saveHistory,
      history,
      fontFamily,
      theme,
      ...restProps
    } = this.props;
    const { collapseDirection } = this.state;
    let questionCount = 0;
    cols
      .filter(item => item.widgets.length > 0)
      .forEach(({ widgets = [] }) => {
        questionCount += widgets.length;
      });
    if (questionCount === 0) {
      return null;
    }
    // show collapse button only in student player or in author preview mode.
    const hasResourceTypeQuestion =
      cols.length > 1 && cols.flatMap(item => item.widgets).find(item => item.widgetType === "resource");
    const showCollapseButtons = hasResourceTypeQuestion && showCollapseBtn;
    const { isLCBView, isExpressGrader, viewComponent } = restProps;
    const isStudentAttempt = ["studentPlayer", "practicePlayer"].includes(viewComponent);
    return (
      <ThemeProvider theme={{ ...themes.default, twoColLayout: theme?.twoColLayout }}>
        <Container
          width={windowWidth}
          style={{ ...style, height: !isStudentAttempt && "auto", padding: 0 }}
          isCollapsed={!!collapseDirection}
          ref={this.containerRef}
          className="test-item-preview"
        >
          <ScrollContext.Provider value={{ getScrollElement: () => this.containerRef.current }}>
            <ScratchPadContext.Provider value={{ getContainer: () => this.containerRef.current }}>
              {cols.map((col, i) => {
                const hideColumn =
                  (collapseDirection === "left" && i === 0) || (collapseDirection === "right" && i === 1);
                if (hideColumn && showCollapseButtons) return "";
                const fullHeight =
                  (isExpressGrader || isLCBView) && i === 0 && col.widgets.every(widget => widget.type === "passage");
                return (
                  <>
                    {(i > 0 || collapseDirection === "left") && showCollapseButtons && this.renderCollapseButtons(i)}
                    <TestItemCol
                      {...restProps}
                      showCollapseBtn={showCollapseButtons}
                      evaluation={evaluation}
                      key={i}
                      colCount={cols.length}
                      colIndex={i}
                      col={collapseDirection ? { ...col, dimension: "90%" } : col}
                      view="preview"
                      metaData={metaData}
                      preview={preview}
                      multiple={cols.length > 1}
                      style={this.getStyle(i !== cols.length - 1)}
                      windowWidth={windowWidth}
                      showFeedback={showFeedback}
                      questions={questions}
                      qIndex={qIndex}
                      student={student}
                      disableResponse={disableResponse}
                      LCBPreviewModal={LCBPreviewModal}
                      previewTab={previewTab}
                      fullHeight={fullHeight}
                      testReviewStyle={{ height: fullHeight ? "100%" : "auto", paddingTop: 0 }}
                    />
                    {collapseDirection === "right" && showCollapseButtons && this.renderCollapseButtons(i)}
                  </>
                );
              })}
              {scratchPadMode && (
                <SvgDraw
                  activeMode={activeMode}
                  scratchPadMode={scratchPadMode}
                  lineColor={lineColor}
                  deleteMode={deleteMode}
                  lineWidth={lineWidth}
                  fillColor={fillColor}
                  saveHistory={saveHistory}
                  history={history}
                  fontFamily={fontFamily}
                  height="100%"
                  top="0"
                  left="0"
                  position="absolute"
                />
              )}
            </ScratchPadContext.Provider>
          </ScrollContext.Provider>
        </Container>
        {this.renderFeedbacks()}
      </ThemeProvider>
    );
  }
}

const enhance = compose(
  withWindowSizes,
  withTheme
);

export default enhance(TestItemPreview);
