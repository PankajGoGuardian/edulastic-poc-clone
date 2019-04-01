import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { get } from "lodash";
import { Spin, Button } from "antd";
import styled from "styled-components";
import Modal from "react-responsive-modal";
import { withRouter } from "react-router-dom";

import TestItemPreview from "../../../../../assessment/components/TestItemPreview";
import {
  getItemDetailByIdAction,
  getItemDetailLoadingSelector,
  getItemDetailRowsSelector,
  getItemDetailSelector
} from "../../../../ItemDetail/ducks";
import { getQuestionsSelector } from "../../../../sharedDucks/questions";

import { testItemsApi } from "@edulastic/api";

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
    const { getItemDetailById, data, isVisible } = nextProps;
    if (isVisible && !flag) {
      getItemDetailById(data.id, { data: true, validation: true, addItem: true });
      this.setState({ flag: true });
    }
  }

  closeModal = () => {
    const { onClose } = this.props;
    this.setState({ flag: false });
    onClose();
  };

  handleDuplicateTestItem = () => {
    const { data, history } = this.props;
    const itemId = data.id;
    duplicateTestItem(itemId).then(duplicateId => {
      const duplicateTestItemId = duplicateId._id;
      history.push(`/author/items/${duplicateTestItemId}/item-detail`);
    });
  };

  editTestItem = () => {
    const { data, history } = this.props;
    const itemId = data.id;
    history.push(`/author/items/${itemId}/item-detail`);
  };

  render() {
    const { isVisible, loading, item, rows, questions, currentAuthorId, authors } = this.props;
    const getAuthorsId = authors.map(item => item._id);
    const authorHasPermission = getAuthorsId.includes(currentAuthorId);
    return (
      <Modal styles={{ modal: ModalStyles }} open={isVisible} onClose={this.closeModal} center>
        <HeadingWrapper>
          <Title>Preview</Title>
          <ButtonsWrapper>
            <Button onClick={this.handleDuplicateTestItem}>Duplicate</Button>
            {authorHasPermission && <ButtonEdit onClick={this.editTestItem}>EDIT</ButtonEdit>}
          </ButtonsWrapper>
        </HeadingWrapper>
        {loading || item === null ? (
          <ProgressContainer>
            <Spin tip="" />
          </ProgressContainer>
        ) : (
          <TestItemPreview
            cols={rows}
            previewTab="clear"
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
  getItemDetailById: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  rows: PropTypes.array,
  item: PropTypes.object
};

PreviewModal.defaultProps = {
  rows: [],
  item: null
};

const enhance = compose(
  withRouter,
  connect(
    state => ({
      rows: getItemDetailRowsSelector(state),
      loading: getItemDetailLoadingSelector(state),
      item: getItemDetailSelector(state),
      questions: getQuestionsSelector(state),
      currentAuthorId: get(state, ["user", "user", "_id"]),
      authors: get(state, ["tests", "entity", "authors"], [])
    }),
    {
      getItemDetailById: getItemDetailByIdAction
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
