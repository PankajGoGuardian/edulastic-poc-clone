import { get } from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Row, Col } from "antd";

import { withNamespaces } from "@edulastic/localization";
import { ContentWrapper, withWindowSizes } from "@edulastic/common";
import { IconClose } from "@edulastic/icons";
import { desktopWidth } from "@edulastic/colors";
import { questionType as constantsQuestionType } from "@edulastic/constants";

import styled from "styled-components";
import SourceModal from "../SourceModal/SourceModal";
import { changeViewAction, changePreviewAction } from "../../../src/actions/view";
import { getViewSelector } from "../../../src/selectors/view";
import { ButtonBar, SecondHeadBar, ButtonAction } from "../../../src/components/common";
import QuestionWrapper from "../../../../assessment/components/QuestionWrapper";
import QuestionMetadata from "../../../../assessment/containers/QuestionMetadata";
import { ButtonClose } from "../../../ItemDetail/components/Container/styled";

import ItemHeader from "../ItemHeader/ItemHeader";
import { saveQuestionAction, setQuestionDataAction } from "../../ducks";
import {
  getItemIdSelector,
  getItemLevelScoringSelector,
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
  } else if (questions.length == 1 && !newQuestionTobeAdded) {
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
      previewTab: "clear"
    };

    this.innerDiv = React.createRef();
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

    this.setState({
      previewTab
    });
  };

  renderQuestion = () => {
    const { view, question, itemLevelScoring, containsVideoOrPassage } = this.props;
    const { previewTab, saveClicked } = this.state;
    const questionType = question && question.type;
    if (view === "metadata") {
      return <QuestionMetadata />;
    }
    if (questionType) {
      const hidingScoringBlock = shouldHideScoringBlock(this.props.itemFromState, this.props.question.id);
      return (
        <HideScoringBlackContext.Provider value={hidingScoringBlock}>
          <QuestionWrapper
            type={questionType}
            view={view}
            previewTab={previewTab}
            changePreviewTab={this.handleChangePreviewTab}
            key={questionType && view && saveClicked}
            data={question}
            questionId={question.id}
            saveClicked={saveClicked}
          />
        </HideScoringBlackContext.Provider>
      );
    }
  };

  get breadcrumb() {
    const {
      question,
      testItemId,
      modalItemId,
      navigateToPickupQuestionType,
      navigateToItemDetail,
      testName,
      testId,
      location,
      toggleModalAction,
      isItem
    } = this.props;

    if (location.pathname.includes("author/tests")) {
      const testPath = `/author/tests/${testId || "create"}`;
      return [
        {
          title: "TEST LIBRARY",
          to: "/author/tests"
        },
        {
          title: testName,
          to: testPath,
          onClick: toggleModalAction
        },
        {
          title: "SELECT A QUESTION TYPE",
          to: testPath,
          onClick: navigateToPickupQuestionType
        },
        {
          title: question.title,
          to: ""
        }
      ];
    }

    const crumbs = [
      {
        title: "ITEM BANK",
        to: "/author/items"
      },
      {
        title: "ITEM DETAIL",
        to: `/author/items/${testItemId}/item-detail`
      },
      {
        title: question.title,
        to: ""
      }
    ];

    if (isItem) crumbs.splice(1, 1);
    return crumbs;
  }

  renderButtons = () => {
    const { view, question, authorQuestions } = this.props;
    const { previewTab } = this.state;
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
        view={view}
        showCheckButton={isShowAnswerVisible || checkAnswerButton}
        allowedAttempts={checkAttempts}
        previewTab={previewTab}
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
      saveItem,
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
      saveItem
    } = this.props;
    const { previewTab } = this.state;

    const commonProps = {
      onChangeView: this.handleChangeView,
      onShowSource: this.handleShowSource,
      changePreviewTab: this.handleChangePreviewTab,
      view,
      previewTab,
      isTestFlow,
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
    const { view, question, history, windowWidth, isItem, showWarningModal, proceedSave } = this.props;
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
      <div ref={this.innerDiv}>
        {showModal && (
          <SourceModal onClose={this.handleHideSource} onApply={this.handleApplySource}>
            {JSON.stringify(question, null, 4)}
          </SourceModal>
        )}
        <ItemHeader title={question.title} reference={itemId}>
          {this.header()}
        </ItemHeader>

        <BreadCrumbBar>
          <Col md={12}>
            {windowWidth > desktopWidth.replace("px", "") ? (
              <SecondHeadBar breadcrumb={this.breadcrumb} />
            ) : (
              <BackLink onClick={history.goBack}>Back to Item List</BackLink>
            )}
          </Col>
          <RightActionButtons md={12}>
            <div>{view === "preview" && this.renderButtons()}</div>
          </RightActionButtons>
        </BreadCrumbBar>

        <ContentWrapper>{this.renderQuestion()}</ContentWrapper>
        <WarningModal visible={showWarningModal} proceedPublish={proceedSave} />
      </div>
    );
  }
}

Container.propTypes = {
  view: PropTypes.string.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  changePreview: PropTypes.func.isRequired,
  showAnswer: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  question: PropTypes.object,
  saveQuestion: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  testItemId: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  modalItemId: PropTypes.string,
  onModalClose: PropTypes.func,
  navigateToPickupQuestionType: PropTypes.func,
  navigateToItemDetail: PropTypes.func,
  onCompleteItemCreation: PropTypes.func,
  windowWidth: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
  testName: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  toggleModalAction: PropTypes.string.isRequired,
  savedWindowScrollTop: PropTypes.number.isRequired,
  onSaveScrollTop: PropTypes.func.isRequired,
  authorQuestions: PropTypes.object
};

Container.defaultProps = {
  question: null,
  modalItemId: undefined,
  navigateToPickupQuestionType: () => {},
  navigateToItemDetail: () => {},
  onCompleteItemCreation: () => {},
  onModalClose: () => {},
  authorQuestions: {}
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces("author"),
  connect(
    state => ({
      view: getViewSelector(state),
      question: getCurrentQuestionSelector(state),
      testItemId: getItemIdSelector(state),
      itemFromState: getItemSelector(state),
      itemLevelScoring: getItemLevelScoringSelector(state),
      testName: state.tests.entity.title,
      testId: state.tests.entity._id,
      savedWindowScrollTop: state.pickUpQuestion.savedWindowScrollTop,
      authorQuestions: getCurrentQuestionSelector(state),
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
