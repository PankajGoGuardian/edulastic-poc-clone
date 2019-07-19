import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

import { MoveLink } from "@edulastic/common";
import PreviewModal from "../../../../src/components/common/PreviewModal";
import { getQuestionType } from "../../../../dataUtils";
import { LabelText, Label } from "../../../../ItemList/components/Item/styled";
class MainInfoCell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowPreviewModal: false
    };
  }

  previewItem = () => {
    this.setState({ isShowPreviewModal: true });
  };

  closeModal = () => {
    this.setState({ isShowPreviewModal: false });
  };

  render() {
    const { data, testId, showModal, addDuplicate, isEditable = false, checkAnswer, showAnswer } = this.props;
    const { isShowPreviewModal } = this.state;
    const itemType = getQuestionType(data.item);
    return (
      <div className="fr-view">
        <MoveLink onClick={() => this.previewItem()}>{data.stimulus}</MoveLink>
        <TypeContainer>
          {itemType && (
            <Label>
              <LabelText>{itemType}</LabelText>
            </Label>
          )}
        </TypeContainer>
        <PreviewModal
          isVisible={isShowPreviewModal}
          testId={testId}
          isEditable={isEditable}
          page="addItems"
          showEvaluationButtons
          checkAnswer={() => checkAnswer({ ...data.item, id: data.id, isItem: true })}
          showAnswer={() => showAnswer(data)}
          addDuplicate={addDuplicate}
          showModal={showModal}
          onClose={this.closeModal}
          data={data}
        />
      </div>
    );
  }
}

MainInfoCell.propTypes = {
  data: PropTypes.object.isRequired,
  isEditable: PropTypes.bool,
  showModal: PropTypes.bool,
  addDuplicate: PropTypes.func
};

export default withRouter(MainInfoCell);

const TypeContainer = styled.div`
  margin-top: 30px;
  display: flex;
  .ant-tag {
    background: rgba(0, 176, 255, 0.2);
    color: rgb(0, 131, 190);
  }
`;
