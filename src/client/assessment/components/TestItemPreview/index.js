/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { ThemeProvider, withTheme } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { white } from "@edulastic/colors";

import { withWindowSizes, ScratchPadContext, ScrollContext, EduButton, FlexContainer } from "@edulastic/common";
import { IconArrowLeft, IconArrowRight } from "@edulastic/icons";
import { questionType } from "@edulastic/constants";

import { themes } from "../../../theme";
import TestItemCol from "./containers/TestItemCol";
import { Container, Divider, CollapseBtn } from "./styled/Container";
import FeedbackWrapper from "../FeedbackWrapper";
import SvgDraw from "../../themes/AssessmentPlayerDefault/SvgDraw";

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
    value: 0,
    dimensions: { height: 0, width: 0 }
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
          <CollapseBtn
            collapseDirection={collapseDirection}
            onClick={() => this.setCollapseView("left")}
            left
            className="left-collapse-btn"
          >
            <IconArrowLeft />
          </CollapseBtn>
          <CollapseBtn
            collapseDirection={collapseDirection}
            onClick={() => this.setCollapseView("right")}
            right
            className="right-collapse-btn"
          >
            <IconArrowRight />
          </CollapseBtn>
        </div>
      </Divider>
    );
  };

  renderFeedback = (widget, index, colIndex, stackedView) => {
    const {
      showFeedback,
      previousQuestionActivity = [],
      isStudentReport,
      isPresentationMode,
      questions,
      isPrintPreview,
      showCollapseBtn,
      isPassageWithQuestions
    } = this.props;

    let shouldShow;
    let shoudlTakeDimensionsFromStore;
    if (stackedView) {
      // stacked view
      // need to show separate feeback blocks for each question
      shouldShow = true;
      shoudlTakeDimensionsFromStore = true;
    } else if (isPassageWithQuestions) {
      // Feedback not supported for passages with item level scoring off
      //  will be fixed with EV-12830
      shouldShow = index === 0;
      shoudlTakeDimensionsFromStore = false;
    } else {
      // multipart with item level scoring is true
      // or single question view
      // show only one feedback block
      shouldShow = index === 0 && colIndex === 0;
      shoudlTakeDimensionsFromStore = false;
    }

    const displayFeedback = shouldShow;

    const question = questions[widget.reference];
    const prevQActivityForQuestion = previousQuestionActivity.find(qa => qa.qid === question.id);
    return displayFeedback ? (
      <FeedbackWrapper
        showFeedback={showFeedback}
        displayFeedback={displayFeedback}
        isPrintPreview={isPrintPreview}
        showCollapseBtn={showCollapseBtn}
        prevQActivityForQuestion={prevQActivityForQuestion}
        data={{ ...question, smallSize: true }}
        isStudentReport={isStudentReport}
        isPresentationMode={isPresentationMode}
        shoudlTakeDimensionsFromStore={shoudlTakeDimensionsFromStore}
      />
    ) : null;
  };

  renderFeedbacks = showStackedView => {
    const { cols } = this.props;
    const { value } = this.state;
    return cols.map((col, colIndex) =>
      col.widgets
        .filter(widget => widget.type !== questionType.SECTION_LABEL && widget.widgetType !== "resource")
        .map((widget, i) => (
          <React.Fragment key={i}>
            {col.tabs &&
              !!col.tabs.length &&
              value === widget.tabIndex &&
              this.renderFeedback(widget, i, colIndex, showStackedView)}
            {col.tabs && !col.tabs.length && this.renderFeedback(widget, i, colIndex, showStackedView)}
          </React.Fragment>
        ))
    );
  };

  componentDidMount() {
    if (this.containerRef.current) {
      const { height: currentHeight, width: currentWidth } = this.containerRef.current.getBoundingClientRect();
      const { dimensions } = this.state;
      const { width: previousWidth, height: previousHeight } = dimensions;
      if (previousWidth !== currentWidth || previousHeight !== currentHeight) {
        this.setState({ dimensions: { height: currentHeight, width: currentWidth } });
      }
    }
  }

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
    const {
      isLCBView,
      isReviewTab,
      isExpressGrader,
      viewComponent,
      previouscratchPadDimensions,
      isQuestionView,
      viewAtStudentRes,
      showStudentWork,
      timeSpent,
      showScratchpadByDefault
    } = restProps;

    let viewBoxProps = {};
    let transformProps = {};
    if (this.containerRef.current && !LCBPreviewModal && showScratchpadByDefault && previouscratchPadDimensions) {
      const { dimensions } = this.state;
      const { height: currentHeight, width: currentWidth } = dimensions;
      const { width: previousWidth, height: previousHeight } = previouscratchPadDimensions;
      transformProps = {
        transformOrigin: "top left",
        transform: `scale(${currentWidth / previousWidth}, ${currentHeight / previousHeight})`
      };
      viewBoxProps = {
        viewBox: ` 0 0 ${previousWidth} ${previousHeight}`,
        preserveAspectRatio: "none"
      };
    }
    const isStudentAttempt = ["studentPlayer", "practicePlayer"].includes(viewComponent);
    const hideInternalOverflow = isLCBView || isQuestionView;
    const borderProps = showScratchpadByDefault
      ? { border: isLCBView ? "1px solid #DADAE4" : "none", borderRadius: "10px" }
      : {};

    const { multipartItem, itemLevelScoring, isPassageWithQuestions, isPrintPreview } = restProps;

    let showStackedView = false;

    if (isLCBView && !isQuestionView && !isPassageWithQuestions) {
      if (multipartItem && !itemLevelScoring) {
        showStackedView = true;
      }
    }

    let dataSource = cols;
    if (!showStackedView && (isQuestionView || isExpressGrader)) {
      dataSource = dataSource.filter(col => (col.widgets || []).length > 0);
    }
    const isSingleQuestionView = dataSource.flatMap(col => col.widgets).length === 1;
    return (
      <ThemeProvider theme={{ ...themes.default, twoColLayout: theme?.twoColLayout }}>
        <div
          style={{
            ...borderProps,
            display: "flex",
            alignSelf: !LCBPreviewModal && "stretch",
            height: LCBPreviewModal && "100%",
            width: "100%",
            overflow: "auto",
            flexDirection: viewAtStudentRes ? "column" : "row",
            background: isExpressGrader && showScratchpadByDefault ? white : null
          }}
        >
          <Container
            width={windowWidth}
            style={{
              ...style,
              height: !isStudentAttempt && "auto",
              padding: 0
            }}
            isCollapsed={!!collapseDirection}
            ref={this.containerRef}
            className="test-item-preview"
          >
            <ScrollContext.Provider value={{ getScrollElement: () => this.containerRef.current }}>
              <ScratchPadContext.Provider value={{ getContainer: () => this.containerRef.current }}>
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    ...transformProps,
                    display: "flex",
                    flexDirection: showStackedView || isPrintPreview ? "column" : "row"
                  }}
                >
                  {dataSource.map((col, i) => {
                    const hideColumn =
                      (collapseDirection === "left" && i === 0) || (collapseDirection === "right" && i === 1);
                    if (hideColumn && showCollapseButtons) return "";
                    const isOnlyPassage = col.widgets.every(widget => widget.type === "passage");
                    const widgetCount = col.widgets.length;
                    const fullHeight =
                      ((isExpressGrader || isLCBView) && (i === 0 && isOnlyPassage)) || widgetCount === 1;
                    return (
                      <>
                        {(i > 0 || collapseDirection === "left") &&
                          showCollapseButtons &&
                          this.renderCollapseButtons(i)}
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
                          isSingleQuestionView={isSingleQuestionView}
                          hideInternalOverflow={hideInternalOverflow}
                          testReviewStyle={{ height: fullHeight ? "100%" : "auto", paddingTop: 0 }}
                          showStackedView={showStackedView}
                          isPassageWithQuestions={isPassageWithQuestions}
                        />
                        {collapseDirection === "right" && showCollapseButtons && this.renderCollapseButtons(i)}
                      </>
                    );
                  })}
                </div>
                {(showScratchpadByDefault || scratchPadMode) && (
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
                    position="absolute"
                    updateScratchpadtoStore={restProps.updateScratchpadtoStore}
                    viewAtStudentRes={viewAtStudentRes}
                    LCBPreviewModal={LCBPreviewModal}
                    previousDimensions={previouscratchPadDimensions}
                    viewBoxProps={viewBoxProps}
                    showScratchpadByDefault={showScratchpadByDefault}
                  />
                )}
              </ScratchPadContext.Provider>
            </ScrollContext.Provider>
          </Container>
          {viewAtStudentRes && (
            <FlexContainer justifyContent="flex-end" alignItems="flex-end" padding="10px 15px">
              <FlexContainer>
                <EduButton type="primary" isGhost onClick={showStudentWork} style={{ marginRight: "1rem" }}>
                  View at Student&apos;s resolution
                </EduButton>
                <FontAwesomeIcon icon={faClock} aria-hidden="true" style={{ color: "grey", fontSize: "19px" }} />
                <span style={{ color: "grey", fontSize: "19px" }}>{timeSpent}s</span>
              </FlexContainer>
            </FlexContainer>
          )}
        </div>
        {!isReviewTab && (
          <div style={{ position: "relative", "min-width": "265px" }}>{this.renderFeedbacks(showStackedView)}</div>
        )}
      </ThemeProvider>
    );
  }
}

const enhance = compose(
  withWindowSizes,
  withTheme
);

export default enhance(TestItemPreview);
