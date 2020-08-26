import React, { Component } from "react";
import { compose } from "redux";
import PropTypes from "prop-types";
import { ThemeProvider, withTheme } from "styled-components";
import { white } from "@edulastic/colors";
import { withNamespaces } from "@edulastic/localization";
import { IconClockCircularOutline } from "@edulastic/icons";

import { withWindowSizes, ScrollContext } from "@edulastic/common";
import { questionType } from "@edulastic/constants";
import { Icon } from "antd";

import { themes } from "../../../theme";
import TestItemCol from "./containers/TestItemCol";
import { Container, Divider, CollapseBtn, Dividerlines } from "./styled/Container";
import FeedbackWrapper from "../FeedbackWrapper";
import { Scratchpad, ScratchpadTool } from "../../../common/components/Scratchpad";
import { TimeSpentWrapper } from "../QuestionWrapper";
import ShowUserWork from "../Common/ShowUserWork";

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
    student: PropTypes.object
  };

  static defaultProps = {
    showFeedback: false,
    verticalDivider: false,
    scrolling: false,
    style: { padding: 0, display: "flex" },
    student: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      collapseDirection: props.isPassageWithQuestions && props.inLCB ? "left" : "",
      value: 0,
      dimensions: { height: 0, width: 0 }
    };
    this.containerRef = React.createRef();
  }

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
    const {
      isLCBView,
      isReviewTab,
      isExpressGrader,
      viewComponent,
      isQuestionView,
      showStudentWork,
      timeSpent,
      multipartItem,
      itemLevelScoring,
      isPassageWithQuestions,
      isPrintPreview
    } = restProps;

    const { collapseDirection } = this.state;
    const widgets = (cols || []).flatMap(col => col.widgets).filter(q => q);
    if (widgets.length === 0) {
      return null;
    }

    const isSingleQuestionView = widgets.length === 1;
    const isStudentAttempt = ["studentPlayer", "practicePlayer"].includes(viewComponent);
    const hideInternalOverflow = isLCBView || isQuestionView || isExpressGrader || isReviewTab;
    const hasResourceTypeQuestion = widgets.find(item => item && item.widgetType === "resource");
    // show collapse button only in student player or in author preview mode.
    const showCollapseButtons = hasResourceTypeQuestion && showCollapseBtn;

    const readyOnlyScratchpad = isStudentReport || isLCBView || LCBPreviewModal;
    const showScratchpadByDefault = widgets.some(x => x.type === questionType.HIGHLIGHT_IMAGE);
    const showScratchToolBar = (scratchPadMode && !LCBPreviewModal) || (!disableResponse && isExpressGrader);

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

    const borderProps = showScratchpadByDefault
      ? { border: isLCBView ? "1px solid #DADAE4" : "none", borderRadius: "10px" }
      : {};

    return (
      <ThemeProvider theme={{ ...themes.default }}>
        <div
          style={{
            ...borderProps,
            display: "flex",
            flexDirection: "column",
            alignSelf: !LCBPreviewModal && "stretch",
            height: LCBPreviewModal && "100%",
            width: "100%",
            overflow: !isStudentAttempt && !isPrintPreview && "auto", // dont give auto for student attempt causes https://snapwiz.atlassian.net/browse/EV-12598
            background: isExpressGrader && showScratchpadByDefault ? white : null,
            "margin-bottom": showScratchpadByDefault && "10px"
          }}
          className="__print-item-fix-width"
        >
          {showScratchToolBar && <ScratchpadTool />}
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
                        showScratchpadByDefault={showScratchpadByDefault}
                      />
                      {collapseDirection === "right" && showCollapseButtons && this.renderCollapseButtons(i)}
                    </>
                  );
                })}
              </div>
              {((showScratchpadByDefault && !isStudentAttempt) || scratchPadMode) && (
                <Scratchpad saveData={saveHistory} data={history} hideTools readOnly={readyOnlyScratchpad} />
              )}
            </ScrollContext.Provider>
          </Container>
          {showScratchpadByDefault && isLCBView && history && (
            <TimeSpentWrapper margin="0px 12px 12px">
              <ShowUserWork isGhost onClickHandler={showStudentWork} mr="8px">
                View at Student&apos;s resolution
              </ShowUserWork>
              <IconClockCircularOutline />
              {timeSpent}s
            </TimeSpentWrapper>
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
