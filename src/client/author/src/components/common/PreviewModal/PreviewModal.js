import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { get, keyBy } from "lodash";
import { Spin, Button } from "antd";
import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import Modal from "react-responsive-modal";
import { withRouter } from "react-router-dom";

import TestItemPreview from "../../../../../assessment/components/TestItemPreview";
import { getItemDetailSelectorForPreview } from "../../../../ItemDetail/ducks";
import { testItemsApi } from "@edulastic/api";
import { getCollectionsSelector } from "../../../selectors/user";
import { changePreviewAction } from "../../../actions/view";
import { clearAnswersAction } from "../../../actions/answers";

const ModalStyles = {
  minWidth: 750,
  borderRadius: "5px",
  padding: "30px"
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

  handleDuplicateTestItem = () => {
    const { data, history, match, addDuplicate } = this.props;
    const itemId = data.id;
    const { path } = match;
    duplicateTestItem(itemId).then(duplicateId => {
      const duplicateTestItemId = duplicateId._id;
      if (path.includes("tests")) {
        this.closeModal();
        addDuplicate(duplicateTestItemId);
      } else {
        history.push(`/author/items/${duplicateTestItemId}/item-detail`);
      }
    });
  };

  editTestItem = () => {
    const { data, history, testId } = this.props;
    const itemId = data.id;
    if (testId) {
      history.push(`/author/tests/${testId}/createItem/${itemId}#edit`);
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
      readOnlyMode = false,
      checkAnswer,
      showAnswer,
      preview,
      showEvaluationButtons
    } = this.props;
    const questions = keyBy(get(item, "data.questions", []), "id");
    const { authors = [], rows } = item;
    const getAuthorsId = authors.map(item => item._id);
    const authorHasPermission = getAuthorsId.includes(currentAuthorId);
    const { allowDuplicate } = collections.find(o => o._id === item.collectionName) || { allowDuplicate: true };
    return (
      <Modal styles={{ modal: ModalStyles }} open={isVisible} onClose={this.closeModal} center>
        <HeadingWrapper>
          <Title>Preview</Title>
          <ButtonsWrapper>
            {allowDuplicate && !readOnlyMode && <Button onClick={this.handleDuplicateTestItem}>Duplicate</Button>}
            {authorHasPermission && !readOnlyMode && <ButtonEdit onClick={this.editTestItem}>EDIT</ButtonEdit>}
          </ButtonsWrapper>
        </HeadingWrapper>
        {showEvaluationButtons && (
          <FlexContainer style={{ justifyContent: "flex-start" }}>
            <Button onClick={checkAnswer}> Check Answer </Button>
            <Button onClick={showAnswer}> Show Answer </Button>
            <Button onClick={this.clearView}> Clear </Button>
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
      </Modal>
    );
  }
}

PreviewModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  readOnlyMode: PropTypes.bool,
  owner: PropTypes.bool,
  addDuplicate: PropTypes.func,
  showModal: PropTypes.bool,
  item: PropTypes.object,
  checkAnswer: PropTypes.func,
  showAnswer: PropTypes.func,
  changeView: PropTypes.func.isRequired,
  showEvaluationButtons: PropTypes.bool
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

const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  margin-left: auto;
  justify-content: space-between;
`;
const ButtonEdit = styled(Button)`
  margin-left: 20px;
`;
