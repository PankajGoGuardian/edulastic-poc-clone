import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Pagination, message, Icon } from "antd";
import { ThemeProvider } from "styled-components";
import { themeColor, white, red } from "@edulastic/colors";
import { Tabs, EduButton, withWindowSizes } from "@edulastic/common";
import ScrollContext from "@edulastic/common/src/contexts/ScrollContext";
import { IconPencilEdit, IconArrowLeft, IconArrowRight, IconCopy, IconTrash } from "@edulastic/icons";
import { get } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { themes } from "../../../../../theme";
import QuestionWrapper from "../../../../../assessment/components/QuestionWrapper";
import { MAX_MOBILE_WIDTH } from "../../../../../assessment/constants/others";

import {
  Container,
  ButtonsContainer,
  ColumnContentArea,
  ReportIssueButton,
  PassageNavigation,
  Divider,
  CollapseBtn,
  ButtonsWrapper,
  WidgetContainer,
  IconArrow,
  MobileLeftSide,
  MobileRightSide,
  SyledSpan,
  StyledFlex,
  StyledText
} from "./styled";
import { deleteItemAction, getItemDeletingSelector } from "../../../../ItemDetail/ducks";
import {
  approveOrRejectSingleItem as approveOrRejectSingleItemAction,
  submitReviewFeedbackAction,
  loadScratchPadAction
} from "../../../../ItemList/ducks";
import { getUserId, getUserFeatures, getUserSelector } from "../../../selectors/user";
import FeaturesSwitch from "../../../../../features/components/FeaturesSwitch";
import PreviewModalWithScratchPad from "./PreviewModalWithScratchPad";
import ScoreBlock from "../ScoreBlock";

class AuthorTestItemPreview extends Component {
  static defaultProps = {
    showFeedback: false,
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
      isRejectMode: false
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

  handleDeleteItem = () => {
    const {
      item: { _id },
      deleteItem,
      isEditable,
      page
    } = this.props;
    if (!isEditable) {
      return message.error("Don't have write permission to delete the item");
    }
    return deleteItem({ id: _id, isItemPrevew: page === "addItems" || page === "itemList" });
  };

  handleApproveOrRejectSingleItem = value => {
    const { approveOrRejectSingleItem: _approveOrRejectSingleItem, item } = this.props;
    if (item?._id) {
      _approveOrRejectSingleItem({ itemId: item._id, status: value });
    }
  };

  handleReject = () => this.setState({ isRejectMode: true });

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
        />
      </Tabs.TabContainer>
    );
  };

  renderLeftButtons = () => {
    const {
      allowDuplicate,
      handleDuplicateTestItem,
      isEditable,
      editTestItem,
      cols,
      item,
      userId,
      page,
      userFeatures,
      onlySratchpad,
      deleting
    } = this.props;

    const { isRejectMode } = this.state;
    const isOwner = item?.createdBy?._id === userId;
    return (
      <>
        <ButtonsContainer style={onlySratchpad ? { visibility: "hidden" } : {}}>
          <ButtonsWrapper justifyContent="flex-start">
            {allowDuplicate && (
              <EduButton isGhost height="28px" title="CLONE" onClick={handleDuplicateTestItem}>
                <IconCopy color={themeColor} />
                <span>CLONE</span>
              </EduButton>
            )}
            {isEditable && (
              <EduButton isGhost height="28px" title="Edit item" onClick={editTestItem}>
                <IconPencilEdit color={themeColor} />
                <span>edit</span>
              </EduButton>
            )}
            {isOwner &&
              !(userFeatures?.isPublisherAuthor && item.status === "published") &&
              (page === "addItems" || page === "itemList") && (
                <EduButton
                  title="Delete item"
                  isGhost
                  height="28px"
                  onClick={this.handleDeleteItem}
                  disabled={deleting}
                >
                  <IconTrash />
                  <span>delete</span>
                </EduButton>
              )}
            <FeaturesSwitch inputFeatures="isCurator" actionOnInaccessible="hidden">
              <>
                {item.status === "inreview" ? (
                  <EduButton
                    title="Reject"
                    isGhost
                    height="28px"
                    onClick={this.handleReject}
                    type={isRejectMode ? "primary" : ""}
                  >
                    <StyledFlex>
                      <SyledSpan>
                        <Icon type="stop" color={red} />
                      </SyledSpan>
                      <StyledText style={{ color: isRejectMode ? white : themeColor }}>Reject</StyledText>
                    </StyledFlex>
                  </EduButton>
                ) : null}
                {item.status === "inreview" || item.status === "rejected" ? (
                  <EduButton
                    title="Approve"
                    isGhost
                    height="28px"
                    onClick={() => this.handleApproveOrRejectSingleItem("published")}
                  >
                    <StyledFlex>
                      <SyledSpan>
                        <Icon type="check" color={themeColor} />
                      </SyledSpan>
                      <StyledText>Approve</StyledText>
                    </StyledFlex>
                  </EduButton>
                ) : null}
              </>
            </FeaturesSwitch>
          </ButtonsWrapper>
          {cols.length === 1 && this.renderRightButtons()}
        </ButtonsContainer>
      </>
    );
  };

  renderRightButtons = () => {
    const {
      isAnswerBtnVisible,
      handleCheckAnswer,
      handleShowAnswer,
      isPassage,
      item,
      goToItem,
      passageTestItems,
      clearView,
      page,
      handleShowHints,
      showHints,
      toggleReportIssue,
      onlySratchpad
    } = this.props;
    const hints = get(item, "data.questions.[0].hints", []);
    const showHintsBtn = hints.length > 0 ? hints[0].label : false;

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
        <ButtonsWrapper
          padding={isPassage ? "15px 15px 0px 45px" : "0px"}
          mb={isPassage ? "5px" : "0px"}
          justifyContent="flex-end"
          style={onlySratchpad ? { visibility: "hidden", position: "relative" } : { position: "relative" }}
        >
          <ScoreBlock customStyle={{ left: "-5px" }} />
          {/* we may need to bring hint button back */}
          {/* {page !== "itemAuthoring" && showHintsBtn && (
            <EduButton height="28px" isGhost={!showHints} onClick={handleShowHints}>
              Hint
            </EduButton>
          )} */}
          {isAnswerBtnVisible && (
            <>
              <EduButton isGhost height="28px" data-cy="check-answer-btn" onClick={handleCheckAnswer}>
                CHECK ANSWER
              </EduButton>
              <EduButton isGhost height="28px" data-cy="show-answers-btn" onClick={handleShowAnswer}>
                SHOW ANSWER
              </EduButton>
            </>
          )}
          {page !== "itemAuthoring" && (
            <EduButton isGhost height="28px" data-cy="clear-btn" onClick={clearView}>
              CLEAR
            </EduButton>
          )}

          <ReportIssueButton title="Report Issue" type="danger" ghost onClick={() => toggleReportIssue()}>
            <FontAwesomeIcon icon={faExclamationTriangle} aria-hidden="true" />
          </ReportIssueButton>
        </ButtonsWrapper>
      </>
    );
  };

  renderColumns(col, colIndex, sectionQue, resourceCount) {
    const { style, windowWidth, onlySratchpad, ...restProps } = this.props;
    const { value, isRejectMode } = this.state;
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
        <WidgetContainer>
          {col.widgets.map((widget, i) => (
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
              {col.tabs &&
                !col.tabs.length &&
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
        </WidgetContainer>
      </>
    );

    if ((isRejectMode || onlySratchpad) && colIndex === 0) {
      return <div style={{ paddingLeft: "45px" }}>{columns}</div>;
    }
    return columns;
  }

  renderColumnContentAreaWithScratchpad = (sectionQue, resourceCount) => {
    const { item, onlySratchpad } = this.props;
    return (
      <PreviewModalWithScratchPad
        item={item}
        columnsContentArea={this.renderColumnsContentArea}
        sectionQue={sectionQue}
        resourceCount={resourceCount}
        submitReviewFeedback={this.submitReviewFeedback}
        onlySratchpad={onlySratchpad}
        scrollContainerRef={this.scrollContainer}
      />
    );
  };

  renderCollapseButtons = () => {
    const { collapseDirection } = this.state;
    const { onlySratchpad } = this.props;
    return (
      <Divider
        isCollapsed={!!collapseDirection}
        collapseDirection={collapseDirection}
        style={onlySratchpad ? { visibility: "hidden" } : {}}
      >
        <div>
          <CollapseBtn collapseDirection={collapseDirection} onClick={() => this.setCollapseView("left")} left>
            <IconArrowLeft />
          </CollapseBtn>
          <CollapseBtn collapseDirection={collapseDirection} onClick={() => this.setCollapseView("right")} right>
            <IconArrowRight />
          </CollapseBtn>
        </div>
      </Divider>
    );
  };

  getSectionQue = cols => {
    if (cols.length !== 2) return [cols[0].widgets.length];

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

  renderColumnsContentArea = ({ sectionQue, resourceCount, children = null, ...rest }) => {
    const { cols, page, onlySratchpad } = this.props;
    const { collapseDirection } = this.state;

    return (
      <Container ref={this.scrollContainer} data-cy="scroll-conteianer" {...rest}>
        {cols.map((col, i) => {
          const hideColumn = (collapseDirection === "left" && i === 0) || (collapseDirection === "right" && i === 1);
          if (hideColumn) return "";
          return (
            <>
              {(i > 0 || collapseDirection === "left") && this.renderCollapseButtons(i)}
              <ColumnContentArea
                isAuthoring={page === "itemAuthoring"}
                hide={hideColumn}
                style={onlySratchpad ? { boxShadow: "none" } : {}}
              >
                {i === 0 ? this.renderLeftButtons() : this.renderRightButtons()}
                {this.renderColumns(col, i, sectionQue, resourceCount)}
              </ColumnContentArea>
              {collapseDirection === "right" && this.renderCollapseButtons(i)}
            </>
          );
        })}
        {children}
      </Container>
    );
  };

  render() {
    const { cols, onlySratchpad } = this.props;
    const { isRejectMode } = this.state;
    let questionCount = 0;
    let resourceCount = 0;
    cols
      .filter(item => item.widgets.length > 0)
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
            ? this.renderColumnContentAreaWithScratchpad(sectionQue, resourceCount)
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
      user: getUserSelector(state).user
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
