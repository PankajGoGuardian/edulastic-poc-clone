/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Pagination, message, Icon } from "antd";
import { ThemeProvider } from "styled-components";
import { themeColor, white, red } from "@edulastic/colors";
import { Tabs, EduButton, withWindowSizes } from "@edulastic/common";
import ScrollContext from "@edulastic/common/src/contexts/ScrollContext";
import { IconPencilEdit, IconArrowLeft, IconArrowRight, IconCopy, IconRemove } from "@edulastic/icons";
import { get } from "lodash";
import { themes } from "../../../../../theme";
import QuestionWrapper from "../../../../../assessment/components/QuestionWrapper";
import { MAX_MOBILE_WIDTH } from "../../../../../assessment/constants/others";

import {
  Container,
  ButtonsContainer,
  ColumnContentArea,
  EvaluateButton,
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
import { approveOrRejectSingleItem } from "../../../../ItemList/ducks";
import { getUserId, getUserFeatures } from "../../../selectors/user";
import FeaturesSwitch from "../../../../../features/components/FeaturesSwitch";

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
      collapseDirection: ""
    };
  }

  scrollContainer = React.createRef();

  handleTabChange = value => {
    this.setState({
      value
    });
  };

  handleDeleteItem = () => {
    const {
      item,
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

  handleSingleApproveOrReject = status => {
    const { approveOrRejectSingleItem, item } = this.props;
    if (item?._id) {
      approveOrRejectSingleItem({ itemId: item._id, status });
    }
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
    sectionQue data format -> [section1,section2] || [[section1.tab1,section1.tab2],[section2.tab1, section2.tab2]]
    for the current section/tab that is being rendered, add the lengths of previous sections/tab's question length to 
    the subCount so that the sub-question count numbering flow remains ie. a-z
    */
    if (colIndex === 0) {
      if (widget?.tabIndex === 0) return subCount;
      return Array.isArray(sectionQue[0]) ? sectionQue[0][0] + subCount : sectionQue[0] + subCount;
    }

    if (widget?.tabIndex === 0)
      return (Array.isArray(sectionQue[0]) ? sectionQue[0][0] + sectionQue[0][1] : sectionQue[0]) + subCount;
    else {
      if (Array.isArray(sectionQue[1])) {
        return (
          (Array.isArray(sectionQue[0]) ? sectionQue[0][0] + sectionQue[0][1] : sectionQue[0]) +
          sectionQue[1][0] +
          subCount
        );
      } else {
        return (
          (Array.isArray(sectionQue[0]) ? sectionQue[0][0] + sectionQue[0][1] : sectionQue[0]) +
          sectionQue[1] +
          subCount
        );
      }
    }
  };

  renderTabContent = (widget, flowLayout, index, colIndex, sectionQue, subCount, resourceCount) => {
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
    const questionCount = get(item, ["data", "questions"], []).length;
    // TODO
    // make resources and questions consistent
    // resources are not saving as a part of item.data.resources
    const isMultiPart = questionCount > 1;
    const timespent = widget.timespent !== undefined ? widget.timespent : null;
    const alphabets = "abcdefghijklmnopqrstuvwxyz";

    const subIndex = this.getSubIndex(colIndex, widget, sectionQue, subCount);
    const question =
      questions[widget.reference] && questions[widget.reference].qLabel
        ? questions[widget.reference]
        : {
            ...questions[widget.reference],
            // need to remove the resource count fromt the subCount
            // because resources should not have labels
            // hence, reduce that many from the question's subCount    (EV-10560)
            qLabel: isMultiPart || resourceCount > 0 ? alphabets[subIndex - resourceCount] : "" // show subIndex if multipart, otherwise nothing
          };
    if (!question) {
      return <div />;
    }
    if (question.activity && question.activity.filtered) {
      return <div />;
    }

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
      userFeatures
    } = this.props;
    const isOwner = item?.createdBy?._id === userId;

    return (
      <>
        <ButtonsContainer>
          <ButtonsWrapper justifyContent="flex-start">
            {allowDuplicate && (
              <EduButton
                title="CLONE"
                style={{ padding: 0, borderColor: themeColor, height: "28px" }}
                size="large"
                onClick={handleDuplicateTestItem}
              >
                <StyledFlex>
                  <SyledSpan>
                    <IconCopy color={themeColor} />
                  </SyledSpan>
                  <StyledText>CLONE</StyledText>
                </StyledFlex>
              </EduButton>
            )}
            {isEditable && (
              <EduButton
                title="Edit item"
                style={{ padding: 0, borderColor: themeColor, height: "28px" }}
                size="large"
                onClick={editTestItem}
              >
                <StyledFlex>
                  <SyledSpan>
                    <IconPencilEdit color={themeColor} />
                  </SyledSpan>
                  <StyledText>edit</StyledText>
                </StyledFlex>
              </EduButton>
            )}
            {isOwner &&
              !(userFeatures?.isPublisherAuthor && item.status === "published") &&
              (page === "addItems" || page === "itemList") && (
                <EduButton
                  title="Delete item"
                  style={{ padding: 0, borderColor: red, fontSize: "16px", color: red, height: "28px" }}
                  size="large"
                  onClick={this.handleDeleteItem}
                  disabled={this.props.deleting}
                >
                  <StyledFlex>
                    <SyledSpan>
                      <Icon type="delete" color={red} />
                    </SyledSpan>
                    <StyledText danger>delete</StyledText>
                  </StyledFlex>
                </EduButton>
              )}
            <FeaturesSwitch inputFeatures="isCurator" actionOnInaccessible="hidden">
              <>
                {item.status === "inreview" ? (
                  <EduButton
                    title="Reject"
                    style={{ padding: 0, borderColor: red, fontSize: "16px", color: red, height: "28px" }}
                    size="large"
                    onClick={() => this.handleSingleApproveOrReject("rejected")}
                  >
                    <StyledFlex>
                      <SyledSpan>
                        <Icon type="stop" color={red} />
                      </SyledSpan>
                      <StyledText danger>Reject</StyledText>
                    </StyledFlex>
                  </EduButton>
                ) : null}
                {item.status === "inreview" || item.status === "rejected" ? (
                  <EduButton
                    title="Approve"
                    style={{ padding: 0, borderColor: themeColor, height: "28px" }}
                    size="large"
                    onClick={() => this.handleSingleApproveOrReject("published")}
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
      toggleReportIssue
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
        >
          {page !== "itemAuthoring" && showHintsBtn && (
            <EvaluateButton
              onClick={handleShowHints}
              style={showHints ? { background: themeColor, color: white } : null}
            >
              Hint
            </EvaluateButton>
          )}
          {isAnswerBtnVisible && (
            <>
              <EvaluateButton data-cy="check-answer-btn" onClick={handleCheckAnswer}>
                CHECK ANSWER
              </EvaluateButton>
              <EvaluateButton data-cy="show-answers-btn" onClick={handleShowAnswer}>
                SHOW ANSWER
              </EvaluateButton>
            </>
          )}
          {page !== "itemAuthoring" && (
            <EvaluateButton data-cy="clear-btn" onClick={clearView}>
              CLEAR
            </EvaluateButton>
          )}

          <ReportIssueButton title="Report Issue" type="danger" ghost onClick={() => toggleReportIssue()}>
            <i className="fa fa-exclamation-triangle" aria-hidden="true" />
          </ReportIssueButton>
        </ButtonsWrapper>
      </>
    );
  };

  renderColumns(col, colIndex, sectionQue, resourceCount) {
    const { style, windowWidth, ...restProps } = this.props;
    const { value } = this.state;
    let subCount = 0;
    return (
      <>
        {col.tabs && !!col.tabs.length && windowWidth >= MAX_MOBILE_WIDTH && (
          <Tabs value={value} onChange={this.handleTabChange}>
            {col.tabs.map((tab, tabIndex) => (
              <Tabs.Tab
                key={tabIndex}
                label={tab}
                style={{
                  width: "50%",
                  textAlign: "center",
                  padding: "20px 15px"
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
                this.renderTabContent(widget, col.flowLayout, i, colIndex, sectionQue, subCount++, resourceCount)}
              {col.tabs &&
                !col.tabs.length &&
                this.renderTabContent(widget, col.flowLayout, i, colIndex, sectionQue, subCount++, resourceCount)}
            </React.Fragment>
          ))}
        </WidgetContainer>
      </>
    );
  }

  renderCollapseButtons = () => {
    const { collapseDirection } = this.state;
    return (
      <Divider isCollapsed={!!collapseDirection} collapseDirection={collapseDirection}>
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

  render() {
    const { cols, page } = this.props;
    const { collapseDirection } = this.state;
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
          <Container ref={this.scrollContainer} data-cy="scroll-conteianer">
            {cols.map((col, i) => {
              const hideColumn =
                (collapseDirection === "left" && i === 0) || (collapseDirection === "right" && i === 1);
              if (hideColumn) return "";
              return (
                <>
                  {(i > 0 || collapseDirection === "left") && this.renderCollapseButtons(i)}
                  <ColumnContentArea isAuthoring={page === "itemAuthoring"} hide={hideColumn}>
                    {i === 0 ? this.renderLeftButtons() : this.renderRightButtons()}
                    {this.renderColumns(col, i, sectionQue, resourceCount)}
                  </ColumnContentArea>
                  {collapseDirection === "right" && this.renderCollapseButtons(i)}
                </>
              );
            })}
          </Container>
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
      userId: getUserId(state)
    }),
    {
      deleteItem: deleteItemAction,
      approveOrRejectSingleItem
    }
  )
);

export default enhance(AuthorTestItemPreview);
