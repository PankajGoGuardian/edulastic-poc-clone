import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { get, keyBy, intersection, uniq } from "lodash";
import { Spin, Button, Modal } from "antd";
import styled from "styled-components";
import { FlexContainer, EduButton } from "@edulastic/common";
import { withRouter } from "react-router-dom";

import { questionType } from "@edulastic/constants";
import { IconPencilEdit, IconDuplicate } from "@edulastic/icons";
import { testItemsApi } from "@edulastic/api";
import { white } from "@edulastic/colors";
import TestItemPreview from "../../../../../assessment/components/TestItemPreview";
import DragScrollContainer from "../../../../../assessment/components/DragScrollContainer";
import { getItemDetailSelectorForPreview } from "../../../../ItemDetail/ducks";
import { getCollectionsSelector } from "../../../selectors/user";
import { changePreviewAction } from "../../../actions/view";
import { clearAnswersAction } from "../../../actions/answers";

const { duplicateTestItem } = testItemsApi;
class PreviewModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flag: false,
      scrollElement: null
    };
  }

  componentWillReceiveProps(nextProps) {
    const { flag } = this.state;
    const { isVisible } = nextProps;
    if (isVisible && !flag) {
      this.setState({ flag: true });
    }
  }

  closeModal = () => {
    const { onClose, changeView, clearAnswers } = this.props;
    this.setState({ flag: false });
    changeView("clear");
    onClose();
    clearAnswers();
  };

  handleDuplicateTestItem = async () => {
    const { data, testId, history } = this.props;
    const itemId = data.id;
    this.closeModal();
    const duplicatedItem = await duplicateTestItem(itemId);
    if (testId) {
      history.push(`/author/tests/${testId}/createItem/${duplicatedItem._id}`);
    } else {
      history.push(`/author/items/${duplicatedItem._id}/item-detail`);
    }
  };

  editTestItem = () => {
    const { data, history, testId } = this.props;
    const itemId = data.id;
    if (testId) {
      history.push(`/author/tests/${testId}/createItem/${itemId}`);
    } else {
      history.push(`/author/items/${itemId}/item-detail`);
    }
  };

  clearView = () => {
    const { changeView, clearAnswers } = this.props;
    changeView("clear");
    clearAnswers();
  };

  mountedQuestion = node => {
    if (node) {
      this.setState({ scrollElement: node });
    }
  };

  render() {
    const {
      isVisible,
      collections,
      loading,
      item = { rows: [], data: {}, authors: [] },
      currentAuthorId,
      isEditable = false,
      checkAnswer,
      showAnswer,
      preview,
      showEvaluationButtons
    } = this.props;
    const { scrollElement } = this.state;
    const questions = keyBy(get(item, "data.questions", []), "id");
    const { authors = [], rows, data = {} } = item;
    const questionsType = data.questions && uniq(data.questions.map(question => question.type));
    const intersectionCount = intersection(questionsType, questionType.manuallyGradableQn).length;
    const isAnswerBtnVisible = questionsType && intersectionCount < questionsType.length;

    const getAuthorsId = authors.map(author => author._id);
    const authorHasPermission = getAuthorsId.includes(currentAuthorId);
    const { allowDuplicate } = collections.find(o => o._id === item.collectionName) || { allowDuplicate: true };
    return (
      <PreviewModalWrapper
        bodyStyle={{ padding: 20 }}
        width="80%"
        visible={isVisible}
        onCancel={this.closeModal}
        footer={null}
      >
        <HeadingWrapper>
          <Title>Preview</Title>
        </HeadingWrapper>
        <ModalContentArea>
          {showEvaluationButtons && (
            <ButtonsContainer>
              <ButtonsWrapper>
                {allowDuplicate && (
                  <EduButton
                    title="Duplicate"
                    style={{ width: 42, padding: 0 }}
                    size="large"
                    onClick={this.handleDuplicateTestItem}
                  >
                    <IconDuplicate color="#00AD50" />
                  </EduButton>
                )}
                {authorHasPermission && isEditable && (
                  <EduButton
                    title="Edit item"
                    style={{ width: 42, padding: 0 }}
                    size="large"
                    onClick={this.editTestItem}
                  >
                    <IconPencilEdit color="#00AD50" />
                  </EduButton>
                )}
              </ButtonsWrapper>
              <ButtonsWrapper>
                {isAnswerBtnVisible && (
                  <>
                    <Button onClick={checkAnswer}> Check Answer </Button>
                    <Button onClick={showAnswer}> Show Answer </Button>
                  </>
                )}
                <Button onClick={this.clearView}> Clear </Button>
              </ButtonsWrapper>
            </ButtonsContainer>
          )}
          {scrollElement && <DragScrollContainer scrollWrraper={scrollElement} height={50} />}
          <QuestionWrapper padding="0px" innerRef={this.mountedQuestion}>
            {loading || item === null ? (
              <ProgressContainer>
                <Spin tip="" />
              </ProgressContainer>
            ) : (
              <TestItemPreview
                cols={rows}
                preview={preview}
                previewTab={preview}
                verticalDivider={item.verticalDivider}
                scrolling={item.scrolling}
                style={{ width: "100%" }}
                questions={questions}
              />
            )}
          </QuestionWrapper>
        </ModalContentArea>
      </PreviewModalWrapper>
    );
  }
}

PreviewModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  isEditable: PropTypes.bool,
  item: PropTypes.object.isRequired,
  preview: PropTypes.any.isRequired,
  currentAuthorId: PropTypes.string.isRequired,
  collections: PropTypes.any.isRequired,
  loading: PropTypes.bool,
  checkAnswer: PropTypes.func,
  showAnswer: PropTypes.func,
  clearAnswers: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  showEvaluationButtons: PropTypes.bool,
  testId: PropTypes.string.isRequired,
  history: PropTypes.any.isRequired
};

PreviewModal.defaultProps = {
  checkAnswer: () => {},
  showAnswer: () => {},
  loading: false,
  isEditable: false,
  showEvaluationButtons: false
};

const enhance = compose(
  withRouter,
  connect(
    (state, ownProps) => ({
      item: getItemDetailSelectorForPreview(state, (ownProps.data || {}).id, ownProps.page),
      collections: getCollectionsSelector(state),
      preview: get(state, ["view", "preview"]),
      currentAuthorId: get(state, ["user", "user", "_id"])
    }),
    {
      changeView: changePreviewAction,
      clearAnswers: clearAnswersAction
    }
  )
);

export default enhance(PreviewModal);

const ProgressContainer = styled.div`
  min-width: 250px;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewModalWrapper = styled(Modal)`
  border-radius: 5px;
  background: #f7f7f7;
  top: 30px;
  padding: 0px;
  .ant-modal-content {
    background: transparent;
    box-shadow: none;
  }
`;

const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
  margin-top: -15px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
`;

const ModalContentArea = styled.div`
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
`;

const ButtonsContainer = styled(FlexContainer)`
  background: ${white};
  padding: 15px 15px 0px;
  justify-content: flex-end;
  flex-basis: 400px;
  border-radius: 10px 10px 0px 0px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  margin-left: auto;
  justify-content: space-between;
  * {
    margin: 0 10px;
  }
`;

const QuestionWrapper = styled.div`
  border-radius: 0px 0px 10px 10px;
  height: calc(100vh - 180px);
  background: ${white};
  padding: ${props => (props.padding ? props.padding : "20px")};
  overflow: auto;
`;
