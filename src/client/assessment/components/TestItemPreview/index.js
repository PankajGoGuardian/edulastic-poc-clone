/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { ThemeProvider, withTheme } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { white } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";

import { withWindowSizes, ScrollContext, EduButton, FlexContainer } from "@edulastic/common";
import { questionType } from "@edulastic/constants";
import { Icon } from "antd";

import { themes } from "../../../theme";
import TestItemCol from "./containers/TestItemCol";
import { Container, Divider, CollapseBtn, Dividerlines } from "./styled/Container";
import FeedbackWrapper from "../FeedbackWrapper";
import { Scratchpad } from "../../../common/components/Scratchpad";

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
    collapseDirection: this.props.isPassageWithQuestions && this.props.inLCB ? "left" : "",
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
            <Icon type="left" />
          </CollapseBtn>
          <Dividerlines>III</Dividerlines>
          <CollapseBtn
            collapseDirection={collapseDirection}
            onClick={() => this.setCollapseView("right")}
            right
            className="right-collapse-btn"
          >
            <Icon type="right" />
          </CollapseBtn>
        </div>
      </Divider>
    );
  };

  getFeedBackVisibility = ({ widgetIndex, colIndex, stackedView }) => {
    const { isDocBased, isPassageWithQuestions, isStudentReport } = this.props;
    let shouldShowFeedback;
    let shouldTakeDimensionsFromStore;

    switch (true) {
      case isDocBased || stackedView:
        /**
         * stacked view
         * need to show separate feeback blocks for each question
         */
        shouldShowFeedback = true;
        shouldTakeDimensionsFromStore = true;
        break;

      case isPassageWithQuestions:
        /**
         * for passages with item level scoring off show seperate feedback block
         * and get dimensions from store
         */
        shouldShowFeedback = true;
        shouldTakeDimensionsFromStore = true;
        break;

      case isStudentReport:
        shouldShowFeedback = true;
        shouldTakeDimensionsFromStore = false;
        break;

      default:
        /**
         *  multipart with item level scoring on
         *  or single question view
         *  show only one feedback block
         */
        shouldShowFeedback = widgetIndex === 0 && colIndex === 0;
        shouldTakeDimensionsFromStore = false;
        break;
    }

    return [shouldShowFeedback, shouldTakeDimensionsFromStore];
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
      studentId,
      studentName,
      itemId,
      t
    } = this.props;

    const [displayFeedback, shouldTakeDimensionsFromStore] = this.getFeedBackVisibility({
      widgetIndex: index,
      colIndex,
      stackedView
    });
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
        shouldTakeDimensionsFromStore={shouldTakeDimensionsFromStore}
        studentId={studentId}
        studentName={studentName || t("common.anonymous")}
        itemId={itemId}
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
      const elem = this.containerRef.current;
      const currentHeight = elem.scrollHeight;
      const currentWidth = elem.scrollWidth;
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
      isStudentReport,
      showCollapseBtn = false,
      scratchPadMode,
      saveHistory,
      history,
      fontFamily,
      theme,
      t,
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
      isQuestionView,
      viewAtStudentRes,
      showStudentWork,
      timeSpent,
      showScratchpadByDefault
    } = restProps;

    const isStudentAttempt = ["studentPlayer", "practicePlayer"].includes(viewComponent);
    const hideInternalOverflow = isLCBView || isQuestionView || isExpressGrader || isReviewTab;
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
    const hideScratchpadToolbar = isStudentReport || isLCBView || LCBPreviewModal || isExpressGrader;
    return (
      <ThemeProvider theme={{ ...themes.default }}>
        <div
          style={{
            ...borderProps,
            display: "flex",
            alignSelf: !LCBPreviewModal && "stretch",
            height: LCBPreviewModal && "100%",
            width: "100%",
            overflow: !isStudentAttempt && !isPrintPreview && "auto", // dont give auto for student attempt causes https://snapwiz.atlassian.net/browse/EV-12598
            flexDirection: viewAtStudentRes ? "column" : "row",
            background: isExpressGrader && showScratchpadByDefault ? white : null,
            "margin-bottom": showScratchpadByDefault && "10px"
          }}
          className="__print-item-fix-width"
        >
          <Container
            width={windowWidth}
            style={{
              ...style,
              height: !isStudentAttempt && "auto",
              padding: 0
            }}
            isStudentAttempt={isStudentAttempt}
            isCollapsed={!!collapseDirection}
            ref={this.containerRef}
            className="test-item-preview"
          >
            <ScrollContext.Provider value={{ getScrollElement: () => this.containerRef.current }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
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
                        isSingleQuestionView={isSingleQuestionView}
                        hideInternalOverflow={hideInternalOverflow}
                        testReviewStyle={{ height: fullHeight ? "100%" : "auto", paddingTop: 0 }}
                        showStackedView={showStackedView}
                        isPassageWithQuestions={isPassageWithQuestions}
                        teachCherFeedBack={this.renderFeedback}
                        isStudentReport={isStudentReport}
                        itemLevelScoring={itemLevelScoring}
                      />
                      {collapseDirection === "right" && showCollapseButtons && this.renderCollapseButtons(i)}
                    </>
                  );
                })}
              </div>
              {(showScratchpadByDefault || scratchPadMode) && (
                <Scratchpad
                  isLCBView={isLCBView}
                  saveData={saveHistory}
                  data={history}
                  hideTools
                  readOnly={hideScratchpadToolbar}
                />
              )}
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
        {/* on the student side, show single feedback only when item level scoring is on */}
        {((itemLevelScoring && isStudentReport) || (!isStudentReport && !isReviewTab)) && (
          <div
            style={{ position: "relative", "min-width": !isPrintPreview && "265px" }}
            className="__print-feedback-main-wrapper"
          >
            {this.renderFeedbacks(showStackedView)}
          </div>
        )}
      </ThemeProvider>
    );
  }
}

const enhance = compose(
  withWindowSizes,
  withTheme,
  withNamespaces("student")
);

export default enhance(TestItemPreview);
