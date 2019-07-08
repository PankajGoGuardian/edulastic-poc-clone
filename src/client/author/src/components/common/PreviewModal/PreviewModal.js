import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { get, keyBy } from "lodash";
import { Spin, Button } from "antd";
import styled from "styled-components";
import { FlexContainer, EduButton } from "@edulastic/common";
import Modal from "react-responsive-modal";
import { withRouter } from "react-router-dom";

import { IconPencilEdit, IconDuplicate } from "@edulastic/icons";
import { testItemsApi } from "@edulastic/api";
import TestItemPreview from "../../../../../assessment/components/TestItemPreview";
import { addTestItemAction } from "../../../../TestPage/ducks";
import { getItemDetailSelectorForPreview } from "../../../../ItemDetail/ducks";
import { getCollectionsSelector } from "../../../selectors/user";
import { changePreviewAction } from "../../../actions/view";
import { clearAnswersAction } from "../../../actions/answers";

const ModalStyles = {
  minWidth: 750,
  borderRadius: "5px",
  padding: "30px",
  background: "#f7f7f7"
};

const { duplicateTestItem } = testItemsApi;
class PreviewModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flag: false
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
    const { data, addTestItemToList } = this.props;
    const itemId = data.id;
    this.closeModal();
    const duplicatedItem = await duplicateTestItem(itemId);
    addTestItemToList(duplicatedItem);
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
      showEvaluationButtons,
      questions
    } = this.props;
    const { authors = [], rows } = item;
    const getAuthorsId = authors.map(item => item._id);
    const authorHasPermission = getAuthorsId.includes(currentAuthorId);
    const { allowDuplicate } = collections.find(o => o._id === item.collectionName) || { allowDuplicate: true };
    return (
      <Modal styles={{ modal: ModalStyles }} open={isVisible} onClose={this.closeModal} center>
        <HeadingWrapper>
          <Title>Preview</Title>
        </HeadingWrapper>
        <QuestionWrapper padding="0px">
          {showEvaluationButtons && (
            <FlexContainer padding="15px 15px 0px" justifyContent={"flex-end"} style={{ "flex-basis": "400px" }}>
              <ButtonsWrapper>
                {allowDuplicate && isEditable && (
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
                <Button onClick={checkAnswer}> Check Answer </Button>
                <Button onClick={showAnswer}> Show Answer </Button>
                <Button onClick={this.clearView}> Clear </Button>
              </ButtonsWrapper>
            </FlexContainer>
          )}
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
      </Modal>
    );
  }
}

PreviewModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  isEditable: PropTypes.bool,
  owner: PropTypes.bool,
  addDuplicate: PropTypes.func,
  showModal: PropTypes.bool,
  item: PropTypes.object,
  checkAnswer: PropTypes.func,
  showAnswer: PropTypes.func,
  changeView: PropTypes.func.isRequired,
  showEvaluationButtons: PropTypes.bool,
  questions: PropTypes.object.isRequired
};

PreviewModal.defaultProps = {
  checkAnswer: () => {},
  showAnswer: () => {},
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
      clearAnswers: clearAnswersAction,
      addTestItemToList: addTestItemAction
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

const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
  margin-top: -25px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  margin-left: auto;
  justify-content: space-between;
  * {
    margin: 0 10px;
  }
`;
const ButtonEdit = styled(Button)`
  margin-left: 20px;
`;
const QuestionWrapper = styled.div`
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  padding: ${props => (props.padding ? props.padding : "20px")};
`;
