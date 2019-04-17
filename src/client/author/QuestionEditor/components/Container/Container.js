import { get } from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { withNamespaces } from "@edulastic/localization";
import { ContentWrapper, withWindowSizes } from "@edulastic/common";
import { IconClose } from "@edulastic/icons";

import SourceModal from "../SourceModal/SourceModal";
import { changeViewAction, changePreviewAction } from "../../../src/actions/view";
import { getViewSelector } from "../../../src/selectors/view";
import { ButtonBar, SecondHeadBar } from "../../../src/components/common";
import QuestionWrapper from "../../../../assessment/components/QuestionWrapper";
import QuestionMetadata from "../../../../assessment/containers/QuestionMetadata";
import { ButtonClose } from "../../../ItemDetail/components/Container/styled";
import ItemHeader from "../ItemHeader/ItemHeader";
import { saveQuestionAction, setQuestionDataAction } from "../../ducks";
import { getItemIdSelector } from "../../../ItemDetail/ducks";
import { getCurrentQuestionSelector } from "../../../sharedDucks/questions";
import { checkAnswerAction, showAnswerAction } from "../../../src/actions/testItem";

class Container extends Component {
  state = {
    showModal: false,
    saveClicked: false,
    previewTab: "clear"
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
    const { saveQuestion, modalItemId, onCompleteItemCreation } = this.props;
    saveQuestion(modalItemId);
    onCompleteItemCreation();
  };

  handleChangePreviewTab = previewTab => {
    const { checkAnswer, showAnswer, changePreview } = this.props;

    if (previewTab === "check") {
      checkAnswer("edit");
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
    const { view, question } = this.props;
    const { previewTab, saveClicked } = this.state;
    const questionType = question && question.type;
    if (view === "metadata") {
      return <QuestionMetadata />;
    }
    if (questionType) {
      return (
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
      );
    }
  };

  get breadcrumb() {
    const { question, testItemId, modalItemId, navigateToPickupQuestionType, navigateToItemDetail } = this.props;

    if (modalItemId) {
      return [
        {
          title: "ITEM DETAIL",
          to: "",
          onClick: navigateToItemDetail
        },
        {
          title: "SELECT A QUESTION TYPE",
          to: "",
          onClick: navigateToPickupQuestionType
        },
        {
          title: question.title,
          to: ""
        }
      ];
    }

    return [
      {
        title: "ITEM DETAIL",
        to: `/author/items/${testItemId}/item-detail`
      },
      {
        title: question.title,
        to: ""
      }
    ];
  }

  render() {
    const { view, question, history, modalItemId, onModalClose } = this.props;

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

    const { previewTab, showModal } = this.state;
    const itemId = question === null ? "" : question._id;
    const { checkAnswerButton = false, checkAttempts = 1 } = question.validation || {};

    return (
      <div>
        {showModal && (
          <SourceModal onClose={this.handleHideSource} onApply={this.handleApplySource}>
            {JSON.stringify(question, null, 4)}
          </SourceModal>
        )}
        <ItemHeader title={question.title} reference={itemId}>
          <ButtonBar
            onChangeView={this.handleChangeView}
            onShowSource={this.handleShowSource}
            changePreviewTab={this.handleChangePreviewTab}
            onSave={this.handleSave}
            view={view}
            previewTab={previewTab}
            renderExtra={() =>
              modalItemId && (
                <ButtonClose onClick={onModalClose}>
                  <IconClose />
                </ButtonClose>
              )
            }
          />
        </ItemHeader>

        <SecondHeadBar
          onShowSource={this.handleShowSource}
          onShowSettings={this.handleShowSettings}
          onChangeView={this.handleChangeView}
          changePreviewTab={this.handleChangePreviewTab}
          onSave={this.handleSave}
          view={view}
          showCheckButton={checkAnswerButton}
          allowedAttempts={checkAttempts}
          previewTab={previewTab}
          breadcrumb={this.breadcrumb}
        />

        <ContentWrapper>{this.renderQuestion()}</ContentWrapper>
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
  onCompleteItemCreation: PropTypes.func
};

Container.defaultProps = {
  question: null,
  modalItemId: undefined,
  navigateToPickupQuestionType: () => {},
  navigateToItemDetail: () => {},
  onCompleteItemCreation: () => {},
  onModalClose: () => {}
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces("author"),
  connect(
    state => ({
      view: getViewSelector(state),
      question: getCurrentQuestionSelector(state),
      testItemId: getItemIdSelector(state)
    }),
    {
      changeView: changeViewAction,
      saveQuestion: saveQuestionAction,
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction,
      showAnswer: showAnswerAction,
      changePreview: changePreviewAction
    }
  )
);

export default enhance(Container);
