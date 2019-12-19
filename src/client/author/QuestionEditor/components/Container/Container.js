/* eslint-disable react/prop-types */
import { get } from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter, Prompt } from "react-router-dom";
import { Row, Col } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { ContentWrapper, withWindowSizes, Hints } from "@edulastic/common";
import ScrollContext from "@edulastic/common/src/contexts/ScrollContext";
import { IconClose } from "@edulastic/icons";
import { desktopWidth } from "@edulastic/colors";
import { questionType as constantsQuestionType } from "@edulastic/constants";

import styled from "styled-components";
import SourceModal from "../SourceModal/SourceModal";
import { changeViewAction, changePreviewAction } from "../../../src/actions/view";
import { getViewSelector, getPreviewSelector } from "../../../src/selectors/view";
import { ButtonBar, SecondHeadBar, ButtonAction } from "../../../src/components/common";
import QuestionWrapper from "../../../../assessment/components/QuestionWrapper";
import QuestionMetadata from "../../../../assessment/containers/QuestionMetadata";
import { ButtonClose } from "../../../ItemDetail/components/Container/styled";

import ItemHeader from "../ItemHeader/ItemHeader";
import { saveQuestionAction, setQuestionDataAction } from "../../ducks";
import {
  getItemIdSelector,
  getItemSelector,
  proceedPublishingItemAction,
  savePassageAction
} from "../../../ItemDetail/ducks";
import { getCurrentQuestionSelector } from "../../../sharedDucks/questions";
import { checkAnswerAction, showAnswerAction, toggleCreateItemModalAction } from "../../../src/actions/testItem";
import { saveScrollTop } from "../../../src/actions/pickUpQuestion";
import { removeUserAnswerAction } from "../../../../assessment/actions/answers";
import { BackLink } from "./styled";
import HideScoringBlackContext from "./QuestionContext";
import WarningModal from "../../../ItemDetail/components/WarningModal";

const shouldHideScoringBlock = (item, currentQuestionId) => {
  const questions = get(item, "data.questions", []);
  const newQuestionTobeAdded = !questions.find(x => x.id === currentQuestionId);
  const itemLevelScoring = get(item, "itemLevelScoring", true);
  let canHideScoringBlock = true;
  if (questions.length === 0) {
    canHideScoringBlock = false;
  } else if (questions.length === 1 && !newQuestionTobeAdded) {
    canHideScoringBlock = false;
  }
  const hideScoringBlock = canHideScoringBlock ? itemLevelScoring : false;
  return hideScoringBlock;
};

class Container extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      saveClicked: false,
      showHints: false
    };

    this.innerDiv = React.createRef();
    this.scrollContainer = React.createRef();
  }

  componentDidUpdate = () => {
    const { view, savedWindowScrollTop, onSaveScrollTop } = this.props;

    const { current: innerDiv } = this.innerDiv;

    if (
      savedWindowScrollTop !== 0 &&
      view.toString() === "edit" &&
      innerDiv.clientHeight + window.outerHeight >= savedWindowScrollTop
    ) {
      window.scrollTo(0, savedWindowScrollTop);
      onSaveScrollTop(0);
    }
  };

  handleChangeView = view => {
    const { changeView } = this.props;
    this.setState({
      showHints: false
    });
    changeView(view);
  };

  handleShowSource = () => {
    this.setState({ showModal: true });
  };

  handleShowSettings = () => {};

  handleHideSource = () => {
    this.setState({ showModal: false });
  };

  handleApplySource = json => {
    try {
      const state = JSON.parse(json);
      const { setQuestionData } = this.props;

      setQuestionData(state);
      this.handleHideSource();
    } catch (err) {
      console.error(err);
    }
  };

  handleSave = () => {
    const {
      saveQuestion,
      savePassage,
      removeAnswers,
      setAuthoredByMeFilter,
      match,
      history,
      isEditFlow,
      isTestFlow
    } = this.props;
    const { testId } = match.params;

    const isPassageWithQuestions = get(history, "location.state.isPassageWithQuestions", false);
    if (isPassageWithQuestions) {
      return savePassage({ isTestFlow, isEditFlow, testId });
    }

    saveQuestion(testId, isTestFlow, isEditFlow);
    removeAnswers();
    if (setAuthoredByMeFilter) setAuthoredByMeFilter();
  };

  handleChangePreviewTab = previewTab => {
    const { checkAnswer, showAnswer, changePreview } = this.props;

    if (previewTab === "check") {
      checkAnswer("question");
    }
    if (previewTab === "show") {
      showAnswer("edit");
    }

    changePreview(previewTab);
  };

  renderQuestion = () => {
    const { view, question, preview, itemFromState } = this.props;
    const { saveClicked, showHints } = this.state;
    const questionType = question && question.type;
    if (view === "metadata") {
      return <QuestionMetadata />;
    }
    if (questionType) {
      const hidingScoringBlock = shouldHideScoringBlock(itemFromState, question.id);
      return (
        <HideScoringBlackContext.Provider value={hidingScoringBlock}>
          <QuestionWrapper
            type={questionType}
            view={view}
            previewTab={preview}
            changePreviewTab={this.handleChangePreviewTab}
            key={questionType && view && saveClicked}
            data={question}
            questionId={question.id}
            saveClicked={saveClicked}
            scrollContainer={this.scrollContainer}
          />
          {showHints && <Hints questions={[question]} />}
        </HideScoringBlackContext.Provider>
      );
    }
  };

  get breadcrumb() {
    const {
      question,
      testItemId,
      navigateToPickupQuestionType,
      testName,
      testId,
      location,
      toggleModalAction,
      isItem,
      itemFromState
    } = this.props;

    const questionTitle =
      question.type !== constantsQuestionType.PASSAGE
        ? question.title
        : itemFromState?.isPassageWithQuestions || location?.state?.canAddMultipleItems
        ? "Passage with Questions"
        : "Passage With Multipart";

    // TODO: remove dependency on using path for this!!
    if (location.pathname.includes("author/tests") || location?.state?.isTestFlow) {
      const testPath = `/author/tests/${testId || "create"}`;
      let crumbs = [
        {
          title: "TEST LIBRARY",
          to: "/author/tests"
        },
        {
          title: testName,
          to: testPath,
          onClick: toggleModalAction,
          state: { persistStore: true }
        },
        {
          title: "SELECT A QUESTION TYPE",
          to: testPath,
          onClick: navigateToPickupQuestionType
        },
        {
          title: questionTitle,
          to: ""
        }
      ];
      if (itemFromState?.isPassageWithQuestions || itemFromState?.multipartItem) {
        const title = "MULTIPART ITEM";
        crumbs = [...crumbs.slice(0, 3), { title, to: `${testPath}/createItem/${itemFromState._id}` }, crumbs[3]];
      }

      return crumbs;
    }

    const crumbs = [
      {
        title: "ITEM BANK",
        to: "/author/items"
      },
      {
        title: "SELECT THE TYPE OF WIDGET",
        to: `/author/items/${testItemId}/item-detail`
      },
      {
        title: questionTitle,
        to: ""
      }
    ];

    if (isItem) crumbs.splice(1, 1);
    return crumbs;
  }

  toggleHints = () => {
    this.setState(prevState => ({
      showHints: !prevState.showHints
    }));
  };

  renderButtons = () => {
    const { view, question, authorQuestions, preview } = this.props;
    const { showHints } = this.state;
    const { checkAnswerButton = false, checkAttempts = 1 } = question.validation || {};

    const isShowAnswerVisible =
      authorQuestions && !constantsQuestionType.manuallyGradableQn.includes(authorQuestions.type);

    return (
      <ButtonAction
        onShowSource={this.handleShowSource}
        onShowSettings={this.handleShowSettings}
        onChangeView={this.handleChangeView}
        changePreviewTab={this.handleChangePreviewTab}
        onSave={this.handleSave}
        handleShowHints={this.toggleHints}
        showHints={showHints}
        view={view}
        showCheckButton={isShowAnswerVisible || checkAnswerButton}
        allowedAttempts={checkAttempts}
        previewTab={preview}
        showSettingsButton={false}
        isShowAnswerVisible={isShowAnswerVisible}
      />
    );
  };

  renderRightSideButtons = () => {
    const {
      item,
      updating,
      testItemStatus,
      changePreview,
      preview,
      view,
      isTestFlow,
      isEditable,
      setShowSettings
    } = this.props;

    let showPublishButton = false;

    if (item) {
      const { _id: testItemId } = item;
      showPublishButton =
        isTestFlow && ((testItemId && testItemStatus && testItemStatus !== "published") || isEditable);
    }

    return (
      <ButtonAction
        onShowSource={this.handleShowSource}
        onShowSettings={() => setShowSettings(true)}
        onChangeView={this.handleChangeView}
        changePreview={changePreview}
        changePreviewTab={this.handleChangePreviewTab}
        onSave={this.handleSave}
        saving={updating}
        view={view}
        previewTab={preview}
        showPublishButton={showPublishButton}
      />
    );
  };

  header = () => {
    const {
      view,
      modalItemId,
      onModalClose,
      isItem,
      showPublishButton,
      isTestFlow = false,
      item,
      setEditable,
      publishTestItem,
      hasAuthorPermission,
      onSaveScrollTop,
      savedWindowScrollTop,
      setShowSettings,
      saveItem,
      preview,
      authorQuestions
    } = this.props;

    const commonProps = {
      onChangeView: this.handleChangeView,
      onShowSource: this.handleShowSource,
      changePreviewTab: this.handleChangePreviewTab,
      view,
      preview,
      isTestFlow,
      showMetaData: authorQuestions.type !== "passage",
      withLabels: true
    };

    return isItem ? (
      <ButtonBar
        onSave={saveItem}
        {...commonProps}
        showPublishButton={showPublishButton}
        onPublishTestItem={publishTestItem}
        onEnableEdit={() => setEditable(true)}
        onSaveScrollTop={onSaveScrollTop}
        hasAuthorPermission={hasAuthorPermission}
        itemStatus={item && item.status}
        renderRightSide={view === "edit" ? this.renderRightSideButtons : () => {}}
        onShowSettings={() => setShowSettings(true)}
      />
    ) : (
      <ButtonBar
        {...commonProps}
        onSave={this.handleSave}
        renderRightSide={view === "edit" ? this.renderButtons : () => {}}
        withLabels
        onSaveScrollTop={onSaveScrollTop}
        savedWindowScrollTop={savedWindowScrollTop}
        renderExtra={() =>
          modalItemId && (
            <ButtonClose onClick={onModalClose}>
              <IconClose />
            </ButtonClose>
          )
        }
      />
    );
  };

  render() {
    const { view, question, history, windowWidth, showWarningModal, proceedSave, hasUnsavedChanges } = this.props;
    if (!question) {
      const backUrl = get(history, "location.state.backUrl", "");
      if (backUrl.includes("pickup-questiontype")) {
        const itemId = backUrl.split("/")[3];
        history.push(`/author/items/${itemId}/item-detail`);
      } else {
        history.push("/author/items");
      }

      return <div />;
    }

    const { showModal } = this.state;
    const itemId = question === null ? "" : question._id;

    return (
      <EditorContainer ref={this.innerDiv}>
        <Prompt
          when={!!hasUnsavedChanges}
          message={loc =>
            loc.pathname.startsWith("/author/items/") ||
            loc.pathname.startsWith("/author/questions/") ||
            "There are unsaved changes. Are you sure you want to leave?"
          }
        />
        <ScrollContext.Provider value={{ getScrollElement: () => this.scrollContainer.current }}>
          {showModal && (
            <SourceModal onClose={this.handleHideSource} onApply={this.handleApplySource}>
              {JSON.stringify(question, null, 4)}
            </SourceModal>
          )}
          <ItemHeader title={question.title} reference={itemId}>
            {this.header()}
          </ItemHeader>

          <BreadCrumbBar>
            <Col span={12}>
              {windowWidth > desktopWidth.replace("px", "") ? (
                <SecondHeadBar breadcrumb={this.breadcrumb} />
              ) : (
                <BackLink onClick={history.goBack}>Back to Item List</BackLink>
              )}
            </Col>
            <RightActionButtons span={12}>
              <div>{view === "preview" && this.renderButtons()}</div>
            </RightActionButtons>
          </BreadCrumbBar>
          <ContentWrapper ref={this.scrollContainer}>{this.renderQuestion()}</ContentWrapper>
          <WarningModal visible={showWarningModal} proceedPublish={proceedSave} />
        </ScrollContext.Provider>
      </EditorContainer>
    );
  }
}

Container.propTypes = {
  view: PropTypes.string.isRequired,
  preview: PropTypes.string.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  changePreview: PropTypes.func.isRequired,
  showAnswer: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  question: PropTypes.object,
  saveQuestion: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  testItemId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  modalItemId: PropTypes.string,
  onModalClose: PropTypes.func,
  navigateToPickupQuestionType: PropTypes.func,
  navigateToItemDetail: PropTypes.func,
  onCompleteItemCreation: PropTypes.func,
  windowWidth: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
  testName: PropTypes.string.isRequired,
  toggleModalAction: PropTypes.func.isRequired,
  onSaveScrollTop: PropTypes.func.isRequired,
  savedWindowScrollTop: PropTypes.number,
  authorQuestions: PropTypes.object,
  testId: PropTypes.string
};

Container.defaultProps = {
  question: null,
  modalItemId: undefined,
  navigateToPickupQuestionType: () => {},
  navigateToItemDetail: () => {},
  onCompleteItemCreation: () => {},
  onModalClose: () => {},
  authorQuestions: {},
  savedWindowScrollTop: 0,
  testId: ""
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces("author"),
  connect(
    state => ({
      view: getViewSelector(state),
      preview: getPreviewSelector(state),
      question: getCurrentQuestionSelector(state),
      testItemId: getItemIdSelector(state),
      itemFromState: getItemSelector(state),
      testName: state.tests.entity.title,
      testId: state.tests.entity._id,
      savedWindowScrollTop: state.pickUpQuestion.savedWindowScrollTop,
      authorQuestions: getCurrentQuestionSelector(state),
      hasUnsavedChanges: state?.authorQuestions?.updated || false,
      showWarningModal: get(state, ["itemDetail", "showWarningModal"], false)
    }),
    {
      changeView: changeViewAction,
      saveQuestion: saveQuestionAction,
      proceedSave: proceedPublishingItemAction,
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction,
      showAnswer: showAnswerAction,
      changePreview: changePreviewAction,
      removeAnswers: removeUserAnswerAction,
      toggleModalAction: toggleCreateItemModalAction,
      onSaveScrollTop: saveScrollTop,
      savePassage: savePassageAction
    }
  )
);

export default enhance(Container);

const BreadCrumbBar = styled(Row)`
  padding: 10px 30px;
`;

const RightActionButtons = styled(Col)`
  div {
    float: right;
  }
`;

const EditorContainer = styled.div`
  min-height: 100vh;
  overflow: hidden;
`;
