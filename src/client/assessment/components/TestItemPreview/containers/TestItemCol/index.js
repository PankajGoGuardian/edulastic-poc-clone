import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tabs, AnswerContext } from "@edulastic/common";
import { questionType } from "@edulastic/constants";
import { sortBy } from "lodash";

import { MAX_MOBILE_WIDTH } from "../../../../constants/others";

import QuestionWrapper from "../../../QuestionWrapper";

import { Container, WidgetContainer } from "./styled/Container";
import { MobileRightSide } from "./styled/MobileRightSide";
import { MobileLeftSide } from "./styled/MobileLeftSide";
import { IconArrow } from "./styled/IconArrow";
import TabContainer from "./TabContainer";

class TestItemCol extends Component {
  state = {
    value: 0
  };

  static propTypes = {
    col: PropTypes.object.isRequired,
    preview: PropTypes.string.isRequired,
    windowWidth: PropTypes.number.isRequired,
    showFeedback: PropTypes.bool,
    multiple: PropTypes.bool,
    style: PropTypes.object,
    questions: PropTypes.object.isRequired,
    qIndex: PropTypes.number,
    LCBPreviewModal: PropTypes.bool.isRequired,
    evaluation: PropTypes.object,
    previousQuestionActivity: PropTypes.array,
    previewTab: PropTypes.string.isRequired,
    isDocBased: PropTypes.bool,
    colCount: PropTypes.number.isRequired,
    colIndex: PropTypes.number.isRequired
  };

  static defaultProps = {
    showFeedback: false,
    multiple: false,
    style: {},
    qIndex: null,
    previousQuestionActivity: [],
    isDocBased: false,
    evaluation: {}
  };

  handleTabChange = value => {
    this.setState({
      value
    });
  };

  renderTabContent = (widget, flowLayout, itemIndex, showStackedView) => {
    const {
      preview,
      LCBPreviewModal,
      showFeedback,
      multiple,
      questions,
      qIndex,
      evaluation,
      previousQuestionActivity = [],
      previewTab,
      col,
      isDocBased,
      testReviewStyle = {},
      teachCherFeedBack,
      itemLevelScoring,
      isStudentReport,
      isPassageWithQuestions,
      ...restProps
    } = this.props;
    const timespent = widget.timespent !== undefined ? widget.timespent : null;
    const question = questions[widget.reference];
    const prevQActivityForQuestion = previousQuestionActivity.find(qa => qa.qid === question.id);
    const { fullHeight } = restProps;
    if (!question) {
      return <div />;
    }

    if (question.activity && question.activity.filtered) {
      return <div />;
    }

    const displayFeedback = true;
    return (
      <TabContainer
        updatePositionToStore={
          (showStackedView || isDocBased || (isPassageWithQuestions && !itemLevelScoring)) &&
          widget.widgetType === "question"
        }
        questionId={widget.reference}
        fullHeight={fullHeight}
        testReviewStyle={testReviewStyle}
        minHeight={(showStackedView || isDocBased) && widget.widgetType === "question" && "458px"}
        itemIndex={itemIndex}
      >
        <QuestionWrapper
          showFeedback={showFeedback && widget?.widgetType !== "resource"}
          evaluation={evaluation}
          multiple={multiple}
          type={widget.type}
          view="preview"
          qIndex={qIndex}
          itemIndex={itemIndex}
          previewTab={previewTab || preview}
          timespent={timespent}
          questionId={widget.reference}
          data={{ ...question, smallSize: true }}
          noPadding
          noBoxShadow
          isFlex
          isStudentReport={isStudentReport}
          flowLayout={flowLayout}
          prevQActivityForQuestion={prevQActivityForQuestion}
          LCBPreviewModal={LCBPreviewModal}
          displayFeedback={displayFeedback}
          calculatedHeight={showStackedView || fullHeight ? "100%" : "auto"}
          fullMode
          {...restProps}
          style={{ ...testReviewStyle, width: "calc(100% - 256px)" }}
          tabIndex={widget.tabIndex} // tabIndex was need to for passage when it has multiple tabs
        />
        {/*  on the student side, show feedback for each question only when item level scoring is off */}
        {isStudentReport && !itemLevelScoring && teachCherFeedBack(widget, null, null, showStackedView)}
      </TabContainer>
    );
  };

  render() {
    const {
      col,
      style,
      windowWidth,
      colCount,
      colIndex,
      testReviewStyle = {},
      isPassageWithQuestions,
      ...restProps
    } = this.props;
    const { value } = this.state;
    const { showStackedView, fullHeight, isSingleQuestionView, isPrintPreview } = restProps;
    const derivedWidth = showStackedView || isSingleQuestionView ? "100%" : null;
    const width = derivedWidth
      ? "100%"
      : restProps.showFeedback && colCount > 1 && colIndex === colCount - 1
      ? `calc(${col.dimension} + 280px)`
      : col.dimension || "auto";
    const widgets = col.tabs && !!col.tabs.length && isPrintPreview ? sortBy(col.widgets, ["tabIndex"]) : col.widgets;

    return (
      <Container
        className={`test-item-col ${col?.tabs?.length ? "test-item-tab-container" : ""}`}
        value={value}
        style={style}
        width={width}
        height={fullHeight ? "100%" : "auto"}
        showStackedView={showStackedView}
        colCount={colCount}
        isScrollable={isPassageWithQuestions}
        hasCollapseButtons={
          ["studentReport", "studentPlayer"].includes(restProps.viewComponent) && restProps.showCollapseBtn
        }
      >
        {!isPrintPreview && (
          <>
            {col.tabs && !!col.tabs.length && windowWidth >= MAX_MOBILE_WIDTH && (
              <Tabs value={value} onChange={this.handleTabChange}>
                {col.tabs.map((tab, tabIndex) => (
                  <Tabs.Tab
                    key={tabIndex}
                    label={tab}
                    style={{
                      width: `calc(${100 / col.tabs.length}% - 10px)`,
                      textAlign: "center",
                      padding: "5px 15px"
                    }}
                    {...restProps}
                  />
                ))}
              </Tabs>
            )}
            {col.tabs && windowWidth < MAX_MOBILE_WIDTH && !!col.tabs.length && value === 0 && (
              <MobileRightSide onClick={() => this.handleTabChange(1)}>
                <IconArrow type="left" />
              </MobileRightSide>
            )}
            {col.tabs && windowWidth < MAX_MOBILE_WIDTH && !!col.tabs.length && value === 1 && (
              <MobileLeftSide onClick={() => this.handleTabChange(0)}>
                <IconArrow type="right" />
              </MobileLeftSide>
            )}
          </>
        )}
        <WidgetContainer
          data-cy="widgetContainer"
          style={{
            ...testReviewStyle,
            height: showStackedView || fullHeight ? "100%" : "auto",
            alignItems: fullHeight && "flex-start"
          }}
        >
          {widgets
            .filter(widget => widget.type !== questionType.SECTION_LABEL)
            .map((widget, i, arr) => (
              <React.Fragment key={i}>
                {col.tabs &&
                  !!col.tabs.length &&
                  value === widget.tabIndex &&
                  !isPrintPreview &&
                  this.renderTabContent(widget, col.flowLayout, i, showStackedView, arr.length)}
                {col.tabs &&
                  !!col.tabs.length &&
                  isPrintPreview &&
                  this.renderTabContent(widget, col.flowLayout, i, showStackedView, arr.length)}
                {col.tabs &&
                  !col.tabs.length &&
                  this.renderTabContent(widget, col.flowLayout, i, showStackedView, arr.length)}
              </React.Fragment>
            ))}
        </WidgetContainer>
      </Container>
    );
  }
}

TestItemCol.contextType = AnswerContext;

export default TestItemCol;
