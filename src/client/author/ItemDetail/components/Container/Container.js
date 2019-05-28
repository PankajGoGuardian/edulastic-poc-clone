import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withNamespaces } from "@edulastic/localization";
import PropTypes from "prop-types";
import { Progress, withWindowSizes } from "@edulastic/common";
import { IconClose } from "@edulastic/icons";
import { cloneDeep, get } from "lodash";
import { Row, Col, InputNumber, Input, Layout } from "antd";
import { MAX_MOBILE_WIDTH } from "../../../src/constants/others";
import { changeViewAction, changePreviewAction } from "../../../src/actions/view";
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
  stateSelector,
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
    view: "preview",
    enableEdit: false,
    previewTab: "clear",
    hasAuthorPermission: false
  };

  componentDidMount() {
    const { getItemDetailById, match, modalItemId, setRedirectTest } = this.props;
    getItemDetailById(modalItemId || match.params.id, { data: true, validation: true });

    if (match.params.testId) {
      setRedirectTest(match.params.testId);
    }
  }

  componentDidUpdate(prevProps) {
    const { getItemDetailById, match, rows, history, t, loading, redirectOnEmptyItem } = this.props;
    const oldId = prevProps.match.params.id;
    const newId = match.params.id;

    if (oldId !== newId) {
      getItemDetailById(newId, { data: true, validation: true });
    }

    if (!loading && (rows.length === 0 || rows[0].widgets.length === 0) && redirectOnEmptyItem) {
      history.replace({
        pathname: `/author/items/${match.params.id}/pickup-questiontype`,
        state: {
          backText: t("component.itemDetail.backText"),
          backUrl: "/author/items",
          rowIndex: 0,
          tabIndex: 0,
          testItemId: match.params._id
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
        view: "edit",
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
    this.setState({
      view
    });
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
    const { match, history, t, changeView, modalItemId, navigateToPickupQuestionType } = this.props;
    changeView("edit");

    if (modalItemId) {
      navigateToPickupQuestionType();
      return;
    }

    history.push({
      pathname: `/author/items/${match.params.id}/pickup-questiontype`,
      state: {
        backText: t("component.itemDetail.backText"),
        backUrl: match.url,
        rowIndex,
        tabIndex,
        testItemId: match.params._id
      }
    });
  };

  handleCancelSettings = () => {
    this.setState({
      showSettings: false
    });
  };

  handleApplySettings = ({ type }) => {
    console.log(type, "type");
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
    const { updateItemDetailById, match, item } = this.props;
    console.log(match.params.id, item, match.params.testId);
    updateItemDetailById(match.params.id, item, match.params.testId);
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

    this.setState({
      previewTab
    });
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
    const { item, updating, testItemStatus, changePreview } = this.props;

    const { previewTab, view, enableEdit } = this.state;

    let showPublishButton = false;

    if (item) {
      const { _id: testItemId } = item;
      showPublishButton =
        (testItemId && testItemStatus && testItemStatus !== testItemStatusConstants.PUBLISHED) || enableEdit;
    }

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
        previewTab={previewTab}
        showPublishButton={showPublishButton}
      />
    );
  };

  render() {
    const { showModal, showSettings, view, previewTab, enableEdit, hasAuthorPermission } = this.state;
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
      history
    } = this.props;

    let showPublishButton = false;
    if (item) {
      const { _id: testItemId } = item;
      showPublishButton =
        (testItemId && testItemStatus && testItemStatus !== testItemStatusConstants.PUBLISHED) || enableEdit;
    }

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
            setItemLevelScoring={this.props.setItemLevelScoring}
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
            previewTab={previewTab}
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
            renderRightSide={this.renderButtons}
          />
        </ItemHeader>
        {windowWidth > MAX_MOBILE_WIDTH ? (
          <SecondHeadBar>
            {item && item.itemLevelScoring && (
              <Row type="flex" justify="end">
                <Col>
                  <InputGroup compact>
                    <label>
                      <b> Total Score :</b>
                    </label>
                    <InputNumber value={item.itemLevelScore} onChange={v => this.props.setItemLevelScore(v)} />
                  </InputGroup>
                </Col>
              </Row>
            )}
          </SecondHeadBar>
        ) : (
          <BackLink onClick={history.goBack}>Back to Item List</BackLink>
        )}
        {view === "edit" && (
          <ItemDetailWrapper>
            {loading && <Progress />}
            {rows &&
              rows.map((row, i) => (
                <ItemDetailRow
                  key={i}
                  row={row}
                  rowIndex={i}
                  count={rows.length}
                  onAdd={this.handleAdd}
                  windowWidth={windowWidth}
                  onDeleteWidget={this.handleDeleteWidget(i)}
                  onEditWidget={this.handleEditWidget}
                  onEditTabTitle={(tabIndex, value) => updateTabTitle({ rowIndex: i, tabIndex, value })}
                />
              ))}
          </ItemDetailWrapper>
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
  redirectOnEmptyItem: PropTypes.bool
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
  testItemStatus: ""
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
      currentAuthorId: get(state, ["user", "user", "_id"])
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
      setItemLevelScore: setItemLevelScoreAction
    }
  )
);

export default enhance(Container);
