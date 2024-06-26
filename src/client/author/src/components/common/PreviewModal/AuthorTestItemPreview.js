import { EduButton, ScrollContext, Tabs, withWindowSizes, notification } from "@edulastic/common";
import { questionType } from "@edulastic/constants";
import { IconGraphRightArrow, IconChevronLeft } from "@edulastic/icons";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pagination } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { ThemeProvider } from "styled-components";

import QuestionWrapper from "../../../../../assessment/components/QuestionWrapper";
import { MAX_MOBILE_WIDTH } from "../../../../../assessment/constants/others";
import { themes } from "../../../../../theme";
import { deleteItemAction, getItemDeletingSelector } from "../../../../ItemDetail/ducks";
import {
  approveOrRejectSingleItem as approveOrRejectSingleItemAction,
  loadScratchPadAction,
  submitReviewFeedbackAction
} from "../../../../ItemList/ducks";
import { getUserFeatures, getUserId, getUserRole, getUserSelector } from "../../../selectors/user";
import PreviewModalWithRejectNote from "./PreviewModalWithRejectNote";
import {
  ButtonsContainer,
  ButtonsWrapper,
  CollapseBtn,
  ColumnContentArea,
  Container,
  Divider,
  IconArrow,
  MobileLeftSide,
  MobileRightSide,
  PassageNavigation,
  WidgetContainer,
  ReportIssueBtn,
  ScratchpadAndWidgetWrapper
} from "./styled";
import QuestionPreviewDetails from "./QuestionPreviewDetails";
import { ScratchpadTool, Scratchpad } from "../../../../../common/components/Scratchpad";

/**
 * As ItemPreview Modal and MultipartItem are using this component,
 * we need to set ScrollContext for each case.
 */
class AuthorTestItemPreview extends Component {
  static defaultProps = {
    showFeedback: false,
    fullModal: false,
    verticalDivider: false,
    scrolling: false,
    style: { padding: 0, display: "flex" },
    qIndex: null,
    student: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      collapseDirection: "",
      isRejectMode: false,
      isEnableScratchpad: false
    };
  }

  scrollContainer = React.createRef();

  componentDidMount() {
    const { loadScratchPad, attachmentId } = this.props;
    if (attachmentId) {
      loadScratchPad(attachmentId);
    }
  }

  handleTabChange = value => {
    this.setState({
      value
    });
  };

  submitReviewFeedback = (note, scratchpad) => {
    const { submitReviewFeedback, item, approveOrRejectSingleItem: _approveOrRejectSingleItem } = this.props;

    if (item?._id) {
      const data = { note };
      if (scratchpad) {
        data.scratchpad = scratchpad;
      }
      submitReviewFeedback({
        status: "rejected",
        data: {
          type: "scratchpad",
          referrerType: "TestItemContent",
          referrerId: item._id,
          data,
          status: "rejected"
        }
      });
      _approveOrRejectSingleItem({ itemId: item._id, status: "rejected" });
    }
    this.setState({ isRejectMode: false });
  };

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

  getSubIndex = (colIndex, widget, sectionQue, subCount) => {
    /*
    sectionQue data format -> 
    [section1,section2] || [[section1.tab1,section1.tab2],[section2.tab1, section2.tab2]]
    for the current section/tab that is being rendered, 
    add the lengths of previous sections/tab's question length to 
    the subCount so that the sub-question count numbering flow remains ie. a-z
    */
    if (colIndex === 0) {
      if (widget?.tabIndex === 0) return subCount;
      return Array.isArray(sectionQue[0]) ? sectionQue[0][0] + subCount : sectionQue[0] + subCount;
    }

    if (widget?.tabIndex === 0)
      return (Array.isArray(sectionQue[0]) ? sectionQue[0][0] + sectionQue[0][1] : sectionQue[0]) + subCount;

    if (Array.isArray(sectionQue[1])) {
      return (
        (Array.isArray(sectionQue[0]) ? sectionQue[0][0] + sectionQue[0][1] : sectionQue[0]) +
        sectionQue[1][0] +
        subCount
      );
    }
    return (
      (Array.isArray(sectionQue[0]) ? sectionQue[0][0] + sectionQue[0][1] : sectionQue[0]) + sectionQue[1] + subCount
    );
  };

  renderTabContent = ({ widget, flowLayout, widgetIndex, colIndex }) => {
    const {
      preview,
      LCBPreviewModal,
      showFeedback,
      multiple,
      questions,
      qIndex,
      evaluation,
      previewTab,
      handleCheckAnswer,
      handleShowAnswer,
      item,
      cols,
      isMultipart,
      ...restProps
    } = this.props;
    // const questionCount = get(item, ["data", "questions"], []).length;
    // TODO
    // make resources and questions consistent
    // resources are not saving as a part of item.data.resources
    // const isMultiPart = questionCount > 1;
    const timespent = widget.timespent !== undefined ? widget.timespent : null;
    // const alphabets = "abcdefghijklmnopqrstuvwxyz";

    // const subIndex = this.getSubIndex(colIndex, widget, sectionQue, subCount);
    const question = questions[widget.reference];
    // if (isMultiPart || resourceCount > 0) {
    //   if (!question.qSubLabel) {
    //     question.qSubLabel = alphabets[subIndex - resourceCount];
    //   }
    // }
    // && questions[widget.reference].qLabel
    //   ? questions[widget.reference]
    //   : {
    //       ...questions[widget.reference],
    //       // need to remove the resource count fromt the subCount
    //       // because resources should not have labels
    //       // hence, reduce that many from the question's subCount    (EV-10560)
    //       qLabel: isMultiPart || resourceCount > 0 ? alphabets[subIndex - resourceCount] : "" // show subIndex if multipart, otherwise nothing
    //     };
    if (!question) {
      return <div />;
    }
    if (question.activity && question.activity.filtered) {
      return <div />;
    }
    const widgets = cols[colIndex]?.widgets || [];
    const borderRadius = widgetIndex === 0 || widgetIndex === widgets.length - 1 ? "10px" : "0px";

    return (
      <Tabs.TabContainer>
        <QuestionWrapper
          showFeedback={showFeedback}
          evaluation={evaluation}
          multiple={multiple}
          type={widget.type}
          view="preview"
          qIndex={qIndex}
          previewTab={preview}
          timespent={timespent}
          questionId={widget.reference}
          data={{ ...question, smallSize: true }}
          noPadding
          noBoxShadow
          isFlex
          flowLayout={flowLayout}
          LCBPreviewModal={LCBPreviewModal}
          borderRadius={borderRadius}
          {...restProps}
          tabIndex={widget.tabIndex} // tabIndex was need to for passage when it has multiple tabs
        />
      </Tabs.TabContainer>
    );
  };

  toggleScratchpad = showNotification => {
    const { isEnableScratchpad } = this.state;

    if (showNotification && !isEnableScratchpad) {
      this.setState(
        {
          isEnableScratchpad: !isEnableScratchpad
        },
        () => {
          notification({
            type: "info",
            messageKey: "scratchpadInfoMultipart"
          });
        }
      );
      return null;
    }
    this.setState({ isEnableScratchpad: !isEnableScratchpad });
  };

  renderLeftButtons = (showScratch, showNotification) => {
    const { onlySratchpad, toggleReportIssue } = this.props;
    const { isEnableScratchpad } = this.state;

    const scratchpadHandler = () => this.toggleScratchpad(showNotification);

    return (
      <>
        {showScratch && (
          <ButtonsContainer style={onlySratchpad ? { display: "none" } : {}}>
            <ButtonsWrapper justifyContent="flex-start">
              <EduButton isGhost height="28px" onClick={scratchpadHandler}>
                {isEnableScratchpad ? "Hide Scratchpad" : "Show Scratchpad"}
              </EduButton>
            </ButtonsWrapper>
          </ButtonsContainer>
        )}
        <div style={{ position: "absolute", right: "40px", bottom: "10px", zIndex: "1" }}>
          <ReportIssueBtn title="Report Issue" height="28px" width="30px" IconBtn isGhost onClick={toggleReportIssue}>
            <FontAwesomeIcon icon={faExclamationTriangle} aria-hidden="true" />
          </ReportIssueBtn>
        </div>
      </>
    );
  };

  renderRightButtons = () => {
    const { isPassage, item, goToItem, passageTestItems, page } = this.props;

    return (
      <>
        {isPassage && passageTestItems.length > 1 && (page === "addItems" || page === "itemList") && (
          <PassageNavigation>
            <span>PASSAGE ITEMS </span>
            <Pagination
              total={passageTestItems.length}
              pageSize={1}
              current={passageTestItems.findIndex(i => i === item.versionId) + 1}
              onChange={goToItem}
            />
          </PassageNavigation>
        )}
      </>
    );
  };

  getScrollContainerProps = showScratch => {
    const { page, fullModal, viewComponent, isPassage } = this.props;
    const commonProps = {
      style: {
        overflow: "auto"
      },
      ref: this.scrollContainer,
      "data-cy": "scroll-conteianer"
    };

    // item preview popup
    // 90px is scratchpad toolbox height
    if (viewComponent === "authorPreviewPopup") {
      const tempHeight = isPassage && fullModal ? "calc(100vh - 160px)" : fullModal ? "calc(100vh - 100px)" : "70vh";
      commonProps.style.height = showScratch ? `calc(${tempHeight} - 90px)` : tempHeight;
      return commonProps;
    }

    // item detail preview
    if (page === "itemAuthoring") {
      commonProps.style.height = showScratch ? "calc(100vh - 272px)" : "calc(100vh - 182px)";
      return commonProps;
    }
    return {};
  };

  renderColumns(col, colIndex, sectionQue, resourceCount, showScratch, saveScratchpad, scratchpadData) {
    const { style, windowWidth, onlySratchpad, viewComponent, fullModal, item, isPassage, ...restProps } = this.props;
    const { value, isEnableScratchpad } = this.state;
    const { createdBy, data = {}, maxScore, _id } = item;
    const { questions = [] } = data;
    const [firstQuestion = {}] = questions;
    const standardIdentfiers =
      questions
        ?.flatMap(q => q?.alignment)
        ?.flatMap(x => x?.domains)
        ?.flatMap(d => d?.standards)
        ?.map(s => s?.name)
        ?.filter(s => Boolean(s)) || [];
    const { authorDifficulty, depthOfKnowledge, bloomsTaxonomy, tags } = firstQuestion;

    let subCount = 0;
    const columns = (
      <>
        {col.tabs && !!col.tabs.length && windowWidth >= MAX_MOBILE_WIDTH && (
          <Tabs value={value} onChange={this.handleTabChange}>
            {col.tabs.map((tab, tabIndex) => (
              <Tabs.Tab
                key={tabIndex}
                label={tab}
                style={{
                  width: `calc(${100 / col.tabs.length}% - 30px)`,
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
        {showScratch && isEnableScratchpad && <ScratchpadTool />}
        <WidgetContainer alignItems="flex-start" {...this.getScrollContainerProps(showScratch)}>
          <ScratchpadAndWidgetWrapper>
            {showScratch && isEnableScratchpad && (
              <Scratchpad hideTools saveData={saveScratchpad} data={scratchpadData} />
            )}

            {col?.widgets?.map((widget, i) => (
              <React.Fragment key={i}>
                {col.tabs &&
                  !!col.tabs.length &&
                  value === widget.tabIndex &&
                  this.renderTabContent({
                    widget,
                    flowLayout: col.flowLayout,
                    widgetIndex: i,
                    colIndex,
                    sectionQue,
                    subCount: subCount++,
                    resourceCount
                  })}
                {((col.tabs && !col.tabs.length) || !col.tabs) &&
                  this.renderTabContent({
                    widget,
                    flowLayout: col.flowLayout,
                    widgetIndex: i,
                    colIndex,
                    sectionQue,
                    subCount: subCount++,
                    resourceCount
                  })}
              </React.Fragment>
            ))}
          </ScratchpadAndWidgetWrapper>
          {!isPassage && (
            <QuestionPreviewDetails
              id={_id}
              createdBy={createdBy}
              maxScore={maxScore}
              depthOfKnowledge={depthOfKnowledge}
              authorDifficulty={authorDifficulty}
              bloomsTaxonomy={bloomsTaxonomy}
              tags={tags}
              standards={standardIdentfiers}
            />
          )}
          {isPassage && colIndex === 1 && (
            <QuestionPreviewDetails
              id={_id}
              createdBy={createdBy}
              maxScore={maxScore}
              depthOfKnowledge={depthOfKnowledge}
              authorDifficulty={authorDifficulty}
              bloomsTaxonomy={bloomsTaxonomy}
              tags={tags}
            />
          )}
        </WidgetContainer>
      </>
    );

    return columns;
  }

  renderColumnContentAreaWithRejectNote = (sectionQue, resourceCount) => {
    const { item, onlySratchpad } = this.props;
    return (
      <PreviewModalWithRejectNote
        item={item}
        columnsContentArea={this.renderColumnsContentArea}
        sectionQue={sectionQue}
        resourceCount={resourceCount}
        submitReviewFeedback={this.submitReviewFeedback}
        onlySratchpad={onlySratchpad}
      />
    );
  };

  get collapseButtons() {
    const { collapseDirection } = this.state;
    return (
      <Divider isCollapsed={!!collapseDirection} collapseDirection={collapseDirection}>
        <div className="button-wrapper">
          <CollapseBtn collapseDirection={collapseDirection} onClick={() => this.setCollapseView("left")} left>
            <IconChevronLeft />
          </CollapseBtn>
          <CollapseBtn collapseDirection={collapseDirection} mid>
            <div className="vertical-line first" />
            <div className="vertical-line second" />
            <div className="vertical-line third" />
          </CollapseBtn>
          <CollapseBtn collapseDirection={collapseDirection} onClick={() => this.setCollapseView("right")} right>
            <IconGraphRightArrow />
          </CollapseBtn>
        </div>
      </Divider>
    );
  }

  getSectionQue = cols => {
    if (cols.length !== 2) return [cols[0]?.widgets?.length];

    const sections = [];

    if (cols[0]?.tabs?.length === 2) {
      sections.push([
        cols[0]?.widgets?.filter(x => x.tabIndex === 0).length,
        cols[0]?.widgets?.filter(x => x.tabIndex === 1).length
      ]);
    } else sections.push(cols[0]?.widgets?.length);

    if (cols[1]?.tabs?.length === 2) {
      sections.push([
        cols[1]?.widgets?.filter(x => x.tabIndex === 0).length,
        cols[1]?.widgets?.filter(x => x.tabIndex === 1).length
      ]);
    } else sections.push(cols[1]?.widgets?.length);

    return sections;
  };

  /**
   * need to show scratchpad on clicking reject button.
   * @param {string} scratchpadData is from PreviewModalWithRejectNote component.
   * @param {func}  saveScratchpad is from PeviewModalWithRejectNote component.
   */
  renderColumnsContentArea = ({ sectionQue, resourceCount, scratchpadData, saveScratchpad }) => {
    const { cols, passageNavigator } = this.props;
    const { collapseDirection } = this.state;

    return cols.map((col, i) => {
      const hideColumn = (collapseDirection === "left" && i === 0) || (collapseDirection === "right" && i === 1);
      const widgets = col.widgets || [];
      const isHighlightImageType = w => w.type === questionType.HIGHLIGHT_IMAGE;
      const showScratch = widgets.some(isHighlightImageType) || !!saveScratchpad;
      const hasMultipleWidgets = widgets.length > 1;
      const allHighLight = widgets.length > 0 && widgets.every(isHighlightImageType);
      const showNotification = hasMultipleWidgets && !allHighLight;

      return (
        <Container width={!collapseDirection ? col.dimension : hideColumn ? "0px" : "100%"}>
          <ColumnContentArea>
            {i === 1 && passageNavigator}
            {i === 0 ? this.renderLeftButtons(showScratch, showNotification) : this.renderRightButtons()}
            {this.renderColumns(col, i, sectionQue, resourceCount, showScratch, saveScratchpad, scratchpadData)}
          </ColumnContentArea>
          {i === 0 && cols.length > 1 && this.collapseButtons}
        </Container>
      );
    });
  };

  render() {
    const { cols, onlySratchpad } = this.props;
    const { isRejectMode } = this.state;
    let questionCount = 0;
    let resourceCount = 0;
    cols
      .filter(item => item.widgets?.length > 0)
      .forEach(({ widgets }) => {
        questionCount += widgets.length;
        resourceCount += widgets.reduce((count, wid) => {
          if (wid.widgetType === "resource") {
            return count + 1;
          }
          return count;
        }, 0);
      });
    if (questionCount === 0) {
      return null;
    }
    // send in an array of lengths to preserve the sub-question count
    // filter out the questions with different tab indices in each section
    const sectionQue = this.getSectionQue(cols);
    return (
      <ThemeProvider theme={themes.default}>
        <ScrollContext.Provider value={{ getScrollElement: () => this.scrollContainer.current }}>
          {isRejectMode || onlySratchpad
            ? this.renderColumnContentAreaWithRejectNote(sectionQue, resourceCount)
            : this.renderColumnsContentArea({ sectionQue, resourceCount })}
        </ScrollContext.Provider>
      </ThemeProvider>
    );
  }
}
const enhance = compose(
  withWindowSizes,
  connect(
    state => ({
      deleting: getItemDeletingSelector(state),
      userFeatures: getUserFeatures(state),
      userId: getUserId(state),
      user: getUserSelector(state).user,
      userRole: getUserRole(state)
    }),
    {
      deleteItem: deleteItemAction,
      approveOrRejectSingleItem: approveOrRejectSingleItemAction,
      submitReviewFeedback: submitReviewFeedbackAction,
      loadScratchPad: loadScratchPadAction
    }
  )
);

export default enhance(AuthorTestItemPreview);
