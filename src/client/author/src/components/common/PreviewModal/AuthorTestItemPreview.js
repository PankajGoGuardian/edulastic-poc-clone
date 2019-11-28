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
  MobileRightSide
} from "./styled";
import { deleteItemAction, getItemDeletingSelector } from "../../../../ItemDetail/ducks";
import { getUserId } from "../../../selectors/user";

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
    if (item.status !== "draft") {
      return message.error("Status of the Item is not in the DRAFT state to proceed");
    }
    if (!isEditable) {
      return message.error("Don't have write permission to delete the item");
    }
    return deleteItem({ id: _id, isItemPrevew: page === "addItems" || page === "itemList" });
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

  renderTabContent = (widget, flowLayout, index) => {
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
      ...restProps
    } = this.props;
    const timespent = widget.timespent !== undefined ? widget.timespent : null;
    // question label for preview mode
    const question =
      questions[widget.reference] && questions[widget.reference].qLabel
        ? questions[widget.reference]
        : { ...questions[widget.reference], qLabel: `Q${index + 1}` };
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
    const { allowDuplicate, handleDuplicateTestItem, isEditable, editTestItem, cols, item, userId, page } = this.props;
    const isOwner = item?.createdBy?._id === userId;
    return (
      <>
        <ButtonsContainer>
          <ButtonsWrapper justifyContent="flex-start">
            {allowDuplicate && (
              <EduButton
                title="Duplicate"
                style={{ width: 42, padding: 0, borderColor: themeColor, paddingTop: "5px" }}
                size="large"
                onClick={handleDuplicateTestItem}
              >
                <IconCopy color={themeColor} />
              </EduButton>
            )}
            {isEditable && (
              <EduButton
                title="Edit item"
                style={{ width: 42, padding: 0, borderColor: themeColor, paddingTop: "5px" }}
                size="large"
                onClick={editTestItem}
              >
                <IconPencilEdit color={themeColor} />
              </EduButton>
            )}
            {isOwner && (page === "addItems" || page === "itemList") && (
              <EduButton
                title="Delete item"
                style={{ width: 42, padding: 0, borderColor: red, paddingTop: "5px", fontSize: "16px", color: red }}
                size="large"
                onClick={this.handleDeleteItem}
                disabled={this.props.deleting}
              >
                <Icon type="delete" color={red} />
              </EduButton>
            )}
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
        <ButtonsWrapper justifyContent="flex-end">
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
              <EvaluateButton onClick={handleCheckAnswer}>CHECK ANSWER</EvaluateButton>
              <EvaluateButton onClick={handleShowAnswer}>SHOW ANSWER</EvaluateButton>
            </>
          )}
          {page !== "itemAuthoring" && <EvaluateButton onClick={clearView}>CLEAR</EvaluateButton>}

          <ReportIssueButton title="Report Issue" type="danger" ghost onClick={() => toggleReportIssue()}>
            <i className="fa fa-exclamation-triangle" aria-hidden="true" />
          </ReportIssueButton>
        </ButtonsWrapper>
      </>
    );
  };

  renderColumns(col) {
    const { style, windowWidth, ...restProps } = this.props;
    const { value } = this.state;
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
        <WidgetContainer flowLayout={col.flowLayout}>
          {col.widgets.map((widget, i) => (
            <React.Fragment key={i}>
              {col.tabs &&
                !!col.tabs.length &&
                value === widget.tabIndex &&
                this.renderTabContent(widget, col.flowLayout)}
              {col.tabs && !col.tabs.length && this.renderTabContent(widget, col.flowLayout, i)}
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

  render() {
    const { cols, page } = this.props;
    const { collapseDirection } = this.state;
    let questionCount = 0;
    cols
      .filter(item => item.widgets.length > 0)
      .forEach(({ widgets }) => {
        questionCount += widgets.length;
      });
    if (questionCount === 0) {
      return null;
    }

    return (
      <ThemeProvider theme={themes.default}>
        <ScrollContext.Provider value={{ getScrollElement: () => this.scrollContainer.current }}>
          <Container ref={this.scrollContainer}>
            {cols.map((col, i) => {
              const hideColumn =
                (collapseDirection === "left" && i === 0) || (collapseDirection === "right" && i === 1);
              if (hideColumn) return "";
              return (
                <>
                  {(i > 0 || collapseDirection === "left") && this.renderCollapseButtons(i)}
                  <ColumnContentArea
                    isAuthoring={page === "itemAuthoring"}
                    width={collapseDirection ? "90%" : col.dimension || "auto"}
                    hide={hideColumn}
                  >
                    {i === 0 ? this.renderLeftButtons() : this.renderRightButtons()}
                    {this.renderColumns(col)}
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
      userId: getUserId(state)
    }),
    {
      deleteItem: deleteItemAction
    }
  )
);

export default enhance(AuthorTestItemPreview);
