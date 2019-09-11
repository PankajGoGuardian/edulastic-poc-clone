import React from "react";
import PropTypes from "prop-types";

import {
  SHORT_TEXT,
  MULTIPLE_CHOICE,
  CLOZE_DROP_DOWN,
  MATH,
  ESSAY_PLAIN_TEXT
} from "@edulastic/constants/const/questionType";
import { IconNewList, IconPencilEdit, IconCaretDown, IconMath, IconSummary } from "@edulastic/icons";

import AddBulkModal from "../AddBulkModal/AddBulkModal";
import { AddQuestionWrapper, AddQuestionIcon, QuestionTypes, ContentWrapper, AddButton } from "./styled";

class AddQuestion extends React.Component {
  state = {
    bulkModalVisible: false
  };

  toggleBulkModal = () => {
    this.setState(({ bulkModalVisible }) => ({
      bulkModalVisible: !bulkModalVisible
    }));
  };

  handleApply = ({ number, type, startingIndex }) => {
    const { onAddQuestion, scrollToBottom } = this.props;

    for (let i = 0; i < number; i++) {
      const index = startingIndex + i;
      onAddQuestion(type, index, startingIndex)();
    }

    this.toggleBulkModal();
    scrollToBottom();
  };

  render() {
    const { bulkModalVisible } = this.state;
    const { onAddQuestion, onAddSection, minAvailableQuestionIndex } = this.props;
    return (
      <AddQuestionWrapper>
        <ContentWrapper>
          <QuestionTypes>
            <AddQuestionIcon onClick={onAddQuestion(MULTIPLE_CHOICE)}>
              <IconNewList />
            </AddQuestionIcon>
            <AddQuestionIcon onClick={onAddQuestion(SHORT_TEXT)}>
              <IconPencilEdit />
            </AddQuestionIcon>
            <AddQuestionIcon onClick={onAddQuestion(CLOZE_DROP_DOWN)}>
              <IconCaretDown />
            </AddQuestionIcon>
            <AddQuestionIcon onClick={onAddQuestion(MATH)}>
              <IconMath />
            </AddQuestionIcon>
            <AddQuestionIcon onClick={onAddQuestion(ESSAY_PLAIN_TEXT)}>
              <IconSummary />
            </AddQuestionIcon>
          </QuestionTypes>
          <QuestionTypes>
            <AddButton onClick={this.toggleBulkModal}>Add Bulk</AddButton>
            <AddButton onClick={onAddSection}>Add Section</AddButton>
          </QuestionTypes>
          <AddBulkModal
            visible={bulkModalVisible}
            onCancel={this.toggleBulkModal}
            onApply={this.handleApply}
            minAvailableQuestionIndex={minAvailableQuestionIndex}
          />
        </ContentWrapper>
      </AddQuestionWrapper>
    );
  }
}

AddQuestion.propTypes = {
  minAvailableQuestionIndex: PropTypes.number.isRequired,
  onAddQuestion: PropTypes.func.isRequired,
  onAddSection: PropTypes.func.isRequired
};

export default AddQuestion;
