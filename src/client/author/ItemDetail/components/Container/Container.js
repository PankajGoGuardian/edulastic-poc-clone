import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import styled from "styled-components";
import { questionType as constantsQuestionType } from "@edulastic/constants";
import { Progress, withWindowSizes, AnswerContext } from "@edulastic/common";
import { IconClose } from "@edulastic/icons";
import { cloneDeep, get, uniq, intersection } from "lodash";
import { Row, Col, Switch, Input, Layout } from "antd";
import { MAX_MOBILE_WIDTH } from "../../../src/constants/others";
import { changeViewAction, changePreviewAction } from "../../../src/actions/view";
import { getViewSelector, getPreviewSelector } from "../../../src/selectors/view";
import { checkAnswerAction, showAnswerAction, toggleCreateItemModalAction } from "../../../src/actions/testItem";
import {
  getItemDetailByIdAction,
  updateItemDetailByIdAction,
  setItemDetailDataAction,
  updateItemDetailDimensionAction,
  deleteWidgetAction,
  updateTabTitleAction,
  useTabsAction,
  useFlowLayoutAction,
  getItemDetailLoadingSelector,
  getItemDetailRowsSelector,
  getItemDetailSelector,
  getItemDetailUpdatingSelector,
  getItemDetailDimensionTypeSelector,
  publishTestItemAction,
  getTestItemStatusSelector,
  clearRedirectTestAction,
  setRedirectTestAction,
  setItemLevelScoringAction,
  setItemLevelScoreAction
} from "../../ducks";
import { toggleSideBarAction } from "../../../src/actions/toggleMenu";

import { getQuestionsSelector } from "../../../sharedDucks/questions";
import { Content, ItemDetailWrapper, PreviewContent, ButtonClose, BackLink } from "./styled";
import { loadQuestionAction } from "../../../QuestionEditor/ducks";
import ItemDetailRow from "../ItemDetailRow";
import { ButtonAction, ButtonBar, SecondHeadBar } from "../../../src/components/common";
import SourceModal from "../../../QuestionEditor/components/SourceModal/SourceModal";
import ItemHeader from "../ItemHeader/ItemHeader";
import SettingsBar from "../SettingsBar";
import TestItemPreview from "../../../../assessment/components/TestItemPreview";
import TestItemMetadata from "../../../../assessment/components/TestItemMetadata";
import { CLEAR } from "../../../../assessment/constants/constantsForQuestions";
import { clearAnswersAction } from "../../../src/actions/answers";
import { changePreviewTabAction } from "../../../ItemAdd/ducks";

const InputGroup = Input.Group;
const testItemStatusConstants = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived"
};

class Container extends Component {
  state = {
    showModal: false,
    showSettings: false,
    enableEdit: false,
    hasAuthorPermission: false
  };

  componentDidMount() {
    const {
      getItemDetailById,
      match,
      modalItemId,
      setRedirectTest,
      isTestFlow,
      history,
      t,
      clearAnswers,
      changePreviewTab
    } = this.props;
    const { itemId, testId } = match.params;

    getItemDetailById(modalItemId || match.params.id || match.params.itemId, { data: true, validation: true });

    if (match.params.testId) {
      setRedirectTest(match.params.testId);
    }

    clearAnswers();
    changePreviewTab(CLEAR);
  }

  componentDidUpdate(prevProps) {
    const { getItemDetailById, match, rows, history, t, loading, redirectOnEmptyItem, isTestFlow } = this.props;
    const oldId = prevProps.match.params.id;
    const newId = match.params.id;
    const { itemId, testId } = match.params;

    if (oldId !== newId) {
      getItemDetailById(newId, { data: true, validation: true });
    }

    if (!loading && (rows.length === 0 || rows[0].widgets.length === 0) && redirectOnEmptyItem) {
      history.replace({
        pathname: isTestFlow
          ? `/author/tests/${testId}/createItem/${itemId}/pickup-questiontype`
          : `/author/items/${match.params.id}/pickup-questiontype`,
        state: {
          backText: t("component.itemDetail.backText"),
          backUrl: isTestFlow ? `/author/tests/${testId}/createItem/${itemId}` : "/author/items",
          rowIndex: 0,
          tabIndex: 0,
          testItemId: isTestFlow ? itemId : match.params._id
        }
      });
    }

    if (this.isPassage(rows)) {
      this.handleApplySettings({ type: "50-50" });
    }
  }

  static getDerivedStateFromProps(props, state) {
    const authors = (props.item && props.item.authors) || [];
    const isAuthor = authors.some(author => author._id === props.currentAuthorId);
    if (isAuthor !== state.hasAuthorPermission) {
      return {
        hasAuthorPermission: true
      };
    }
    return null;
  }

  isPassage = rows =>
    rows[0] &&
    rows[0].widgets &&
    rows[0].widgets.length === 1 &&
    rows[0].widgets[0].type === "passage" &&
    rows[0].dimension !== "50%";

  getSizes = type => {
    switch (type) {
      case "100-100":
        return {
          left: "100%",
          right: "100%"
        };
      case "30-70":
        return {
          left: "30%",
          right: "70%"
        };
      case "70-30":
        return {
          left: "70%",
          right: "30%"
        };
      case "50-50":
        return {
          left: "50%",
          right: "50%"
        };
      case "40-60":
        return {
          left: "40%",
          right: "60%"
        };
      case "60-40":
        return {
          left: "60%",
          right: "40%"
        };
      default:
        return {
          left: "100%",
          right: "100%"
        };
    }
  };

  handleChangeView = view => {
    const { changeView } = this.props;
    changeView(view);
  };

  handleShowSource = () => {
    this.setState({ showModal: true });
  };

  handleShowSettings = () => {
    this.setState(state => ({
      showSettings: !state.showSettings
    }));
  };

  handleAdd = ({ rowIndex, tabIndex }) => {
    const { match, history, t, changeView, modalItemId, navigateToPickupQuestionType, isTestFlow } = this.props;
    changeView("edit");

    if (modalItemId) {
      navigateToPickupQuestionType();
      return;
    }
    history.push({
      pathname: isTestFlow
        ? `/author/tests/${match.params.testId}/createItem/${match.params.itemId}/pickup-questiontype`
        : `/author/items/${match.params.id}/pickup-questiontype`,
      state: {
        backText: t("component.itemDetail.backText"),
        backUrl: match.url,
        rowIndex,
        tabIndex,
        testItemId: isTestFlow ? match.params.itemId : match.params._id
      }
    });
  };

  handleCancelSettings = () => {
    this.setState({
      showSettings: false
    });
  };

  handleApplySettings = ({ type }) => {
    const { updateDimension } = this.props;
    const { left, right } = this.getSizes(type);
    updateDimension(left, right);
  };

  handleApplySource = data => {
    const { setItemDetailData } = this.props;

    try {
      setItemDetailData(JSON.parse(data));
      this.handleHideSource();
    } catch (err) {
      console.error(err);
    }
  };

  handleHideSource = () => {
    this.setState({
      showModal: false
    });
  };

  handleSave = () => {
    const { updateItemDetailById, match, item, isTestFlow } = this.props;
    if (isTestFlow) {
      updateItemDetailById(match.params.itemId, item, match.params.testId, true);
    } else {
      updateItemDetailById(match.params.id, item, match.params.testId);
    }
  };

  handleEditWidget = (widget, rowIndex) => {
    const { loadQuestion, changeView } = this.props;
    changeView("edit");
    loadQuestion(widget, rowIndex);
  };

  handleDeleteWidget = i => widgetIndex => {
    const { deleteWidget } = this.props;
    deleteWidget(i, widgetIndex);
  };

  handleVerticalDividerChange = () => {
    const { item, setItemDetailData } = this.props;
    const newItem = cloneDeep(item);

    newItem.verticalDivider = !newItem.verticalDivider;
    setItemDetailData(newItem);
  };

  handleScrollingChange = () => {
    const { item, setItemDetailData } = this.props;
    const newItem = cloneDeep(item);

    newItem.scrolling = !newItem.scrolling;
    setItemDetailData(newItem);
  };

  handleChangePreviewTab = previewTab => {
    const { checkAnswer, showAnswer, changePreview } = this.props;

    if (previewTab === "check") {
      checkAnswer();
    }
    if (previewTab === "show") {
      showAnswer();
    }

    changePreview(previewTab);
  };

  handlePublishTestItem = () => {
    const { publishTestItem, item } = this.props;
    const { _id } = item;
    publishTestItem(_id);
    this.setState({ enableEdit: false });
  };

  handleEnableEdit = () => {
    this.setState({ enableEdit: true });
  };

  componentWillUnmount() {
    // reset the view to "edit" while leaving.
    const { changeView } = this.props;
    changeView("edit");
  }

  renderPreview = () => {
    const { rows, preview, questions, item: itemProps } = this.props;
    const item = itemProps || {};
    return (
      <PreviewContent>
        <TestItemPreview
          cols={rows}
          previewTab={preview}
          preview={preview}
          verticalDivider={item.verticalDivider}
          scrolling={item.scrolling}
          style={{ width: "100%" }}
          questions={questions}
        />
      </PreviewContent>
    );
  };

  renderMetadata = () => (
    <Content>
      <TestItemMetadata />
    </Content>
  );

  renderButtons = () => {
    const { item, updating, testItemStatus, changePreview, preview, view, isTestFlow, rows } = this.props;

    const { enableEdit } = this.state;

    let showPublishButton = false;

    if (item) {
      const { _id: testItemId } = item;
      showPublishButton =
        isTestFlow &&
        ((testItemId && testItemStatus && testItemStatus !== testItemStatusConstants.PUBLISHED) || enableEdit);
    }
    const questionsType = rows && uniq(rows.flatMap(itm => itm.widgets.map(i => i.type)));
    const intersectionCount = intersection(questionsType, constantsQuestionType.manuallyGradableQn).length;
    const isAnswerBtnVisible = questionsType && intersectionCount < questionsType.length;

    return (
      <ButtonAction
        onShowSource={this.handleShowSource}
        onShowSettings={this.handleShowSettings}
        onChangeView={this.handleChangeView}
        changePreview={changePreview}
        changePreviewTab={this.handleChangePreviewTab}
        onSave={this.handleSave}
        saving={updating}
        view={view}
        previewTab={preview}
        showPublishButton={showPublishButton}
        isShowAnswerVisible={isAnswerBtnVisible}
        showCheckButton={isAnswerBtnVisible}
      />
    );
  };

  render() {
    const { showModal, showSettings, enableEdit, hasAuthorPermission } = this.state;
    const {
      t,
      match,
      rows,
      loading,
      item,
      updating,
      type,
      updateTabTitle,
      useTabs,
      useFlowLayout,
      changePreview,
      windowWidth,
      testItemStatus,
      modalItemId,
      onModalClose,
      toggleSideBar,
      currentAuthorId,
      history,
      setItemLevelScore,
      setItemLevelScoring,
      view,
      isTestFlow,
      preview
    } = this.props;
    const qLength = rows.flatMap(x => x.widgets.filter(x => x.widgetType === "question")).length;

    let showPublishButton = false;
    if (item) {
      const { _id: testItemId } = item;
      showPublishButton =
        (!isTestFlow && (testItemId && testItemStatus && testItemStatus !== testItemStatusConstants.PUBLISHED)) ||
        enableEdit;
    }
    const { testId } = match.params;
    let breadCrumb = [
      {
        title: "TEST LIBRARY",
        to: "/author/tests"
      },
      {
        title: "TEST",
        to: `/author/tests/${testId}#review`
      }
    ];
    return (
      <Layout>
        {showModal && item && (
          <SourceModal onClose={this.handleHideSource} onApply={this.handleApplySource}>
            {JSON.stringify(item, null, 4)}
          </SourceModal>
        )}
        {showSettings && (
          <SettingsBar
            type={type}
            onCancel={this.handleCancelSettings}
            onApply={this.handleApplySettings}
            useTabs={useTabs}
            useTabsLeft={!!rows[0].tabs.length}
            useTabsRight={!!rows[1] && !!rows[1].tabs.length}
            useFlowLayout={useFlowLayout}
            useFlowLayoutLeft={rows[0].flowLayout}
            useFlowLayoutRight={rows[1] && rows[1].flowLayout}
            onVerticalDividerChange={this.handleVerticalDividerChange}
            onScrollingChange={this.handleScrollingChange}
            verticalDivider={item.verticalDivider}
            scrolling={item.scrolling}
            itemLevelScoring={item.itemLevelScoring}
            setItemLevelScoring={setItemLevelScoring}
          />
        )}
        <ItemHeader
          showIcon
          title={t("component.itemDetail.itemDetail")}
          reference={match.params._id}
          windowWidth={windowWidth}
          toggleSideBar={toggleSideBar}
        >
          <ButtonBar
            onShowSource={this.handleShowSource}
            onShowSettings={this.handleShowSettings}
            onChangeView={this.handleChangeView}
            changePreview={changePreview}
            changePreviewTab={this.handleChangePreviewTab}
            onSave={this.handleSave}
            onPublishTestItem={this.handlePublishTestItem}
            saving={updating}
            view={view}
            previewTab={preview}
            isTestFlow={isTestFlow}
            onEnableEdit={this.handleEnableEdit}
            showPublishButton={showPublishButton}
            hasAuthorPermission={hasAuthorPermission}
            itemStatus={item && item.status}
            withLabels
            renderExtra={() =>
              modalItemId && (
                <ButtonClose onClick={onModalClose}>
                  <IconClose />
                </ButtonClose>
              )
            }
            renderRightSide={view === "edit" ? this.renderButtons : () => {}}
          />
        </ItemHeader>
        <BreadCrumbBar>
          <Col md={view === "preview" ? 12 : 24}>
            {windowWidth > MAX_MOBILE_WIDTH ? (
              <SecondHeadBar breadcrumb={isTestFlow ? breadCrumb : undefined}>
                {item && view !== "preview" && qLength > 1 && (
                  <Row type="flex" justify="end" style={{ width: 250 }}>
                    <Col style={{ paddingRight: 5 }}>Item Level Scoring</Col>
                    <Col>
                      <Switch
                        checked={item.itemLevelScoring}
                        checkedChildren="on"
                        unCheckedChildren="off"
                        onChange={v => {
                          setItemLevelScoring(v);
                        }}
                      />
                    </Col>
                  </Row>
                )}
              </SecondHeadBar>
            ) : (
              <BackLink onClick={history.goBack}>Back to Item List</BackLink>
            )}
          </Col>
          {view === "preview" && (
            <RightActionButtons col={12}>
              <div>{this.renderButtons()}</div>
            </RightActionButtons>
          )}
        </BreadCrumbBar>
        {view === "edit" && (
          <AnswerContext.Provider value={{ isAnswerModifiable: false }}>
            <ItemDetailWrapper>
              {rows &&
                rows.map((row, i) => (
                  <ItemDetailRow
                    key={i}
                    row={row}
                    view={view}
                    rowIndex={i}
                    itemData={item}
                    count={rows.length}
                    onAdd={this.handleAdd}
                    windowWidth={windowWidth}
                    onDeleteWidget={this.handleDeleteWidget(i)}
                    onEditWidget={this.handleEditWidget}
                    onEditTabTitle={(tabIndex, value) => updateTabTitle({ rowIndex: i, tabIndex, value })}
                  />
                ))}
            </ItemDetailWrapper>
          </AnswerContext.Provider>
        )}
        {view === "preview" && this.renderPreview()}
        {view === "metadata" && this.renderMetadata()}
      </Layout>
    );
  }
}

Container.propTypes = {
  t: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  getItemDetailById: PropTypes.func.isRequired,
  rows: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  item: PropTypes.object,
  preview: PropTypes.string.isRequired,
  updateItemDetailById: PropTypes.func.isRequired,
  setItemDetailData: PropTypes.func.isRequired,
  updating: PropTypes.bool.isRequired,
  updateDimension: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  deleteWidget: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  updateTabTitle: PropTypes.func.isRequired,
  useFlowLayout: PropTypes.func.isRequired,
  useTabs: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  showAnswer: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  changePreview: PropTypes.func.isRequired,
  loadQuestion: PropTypes.func.isRequired,
  questions: PropTypes.object.isRequired,
  changeView: PropTypes.func.isRequired,
  testItemStatus: PropTypes.string,
  setRedirectTest: PropTypes.func,
  publishTestItem: PropTypes.func,
  modalItemId: PropTypes.string,
  onModalClose: PropTypes.func,
  navigateToPickupQuestionType: PropTypes.func,
  toggleSideBar: PropTypes.func.isRequired,
  redirectOnEmptyItem: PropTypes.bool,
  setItemLevelScore: PropTypes.func,
  setItemLevelScoring: PropTypes.func,
  isTestFlow: PropTypes.bool,
  clearAnswers: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired
};

Container.defaultProps = {
  rows: [],
  setRedirectTest: () => {},
  publishTestItem: () => {},
  item: {},
  modalItemId: undefined,
  onModalClose: () => {},
  navigateToPickupQuestionType: () => {},
  redirectOnEmptyItem: true,
  testItemStatus: "",
  setItemLevelScore: () => {},
  setItemLevelScoring: () => {},
  isTestFlow: false
};

const enhance = compose(
  withWindowSizes,
  withNamespaces("author"),
  connect(
    state => ({
      rows: getItemDetailRowsSelector(state),
      loading: getItemDetailLoadingSelector(state),
      item: getItemDetailSelector(state),
      updating: getItemDetailUpdatingSelector(state),
      type: getItemDetailDimensionTypeSelector(state),
      questions: getQuestionsSelector(state),
      testItemStatus: getTestItemStatusSelector(state),
      preview: state.view.preview,
      currentAuthorId: get(state, ["user", "user", "_id"]),
      view: getViewSelector(state)
    }),
    {
      changeView: changeViewAction,
      changePreview: changePreviewAction,
      showAnswer: showAnswerAction,
      checkAnswer: checkAnswerAction,
      getItemDetailById: getItemDetailByIdAction,
      updateItemDetailById: updateItemDetailByIdAction,
      setItemDetailData: setItemDetailDataAction,
      updateDimension: updateItemDetailDimensionAction,
      deleteWidget: deleteWidgetAction,
      updateTabTitle: updateTabTitleAction,
      useTabs: useTabsAction,
      useFlowLayout: useFlowLayoutAction,
      loadQuestion: loadQuestionAction,
      publishTestItem: publishTestItemAction,
      clearRedirectTest: clearRedirectTestAction,
      setRedirectTest: setRedirectTestAction,
      toggleCreateItemModal: toggleCreateItemModalAction,
      toggleSideBar: toggleSideBarAction,
      setItemLevelScoring: setItemLevelScoringAction,
      setItemLevelScore: setItemLevelScoreAction,
      clearAnswers: clearAnswersAction,
      changePreviewTab: changePreviewTabAction
    }
  )
);

export default enhance(Container);

const BreadCrumbBar = styled(Row)`
  padding: 10px 30px 10px 0px;
`;

const RightActionButtons = styled(Col)`
  div {
    float: right;
  }
`;
