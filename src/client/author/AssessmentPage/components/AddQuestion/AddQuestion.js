import React from 'react'
import PropTypes from 'prop-types'
import {
  SHORT_TEXT,
  MULTIPLE_CHOICE,
  CLOZE_DROP_DOWN,
  MATH,
  TRUE_OR_FALSE,
  ESSAY_PLAIN_TEXT,
  ESSAY_RICH_TEXT,
} from '@edulastic/constants/const/questionType'
import {
  IconNewList,
  IconMath,
  IconTrueFalse,
  IconPencilHollow,
  IconTextEntry,
  IconDropDown,
} from '@edulastic/icons'
import { Tooltip } from '../../../../common/utils/helpers'

import AddBulkModal from '../AddBulkModal/AddBulkModal'
import {
  AddQuestionWrapper,
  AddQuestionIcon,
  QuestionTypes,
  ContentWrapper,
  AddButton,
} from './styled'

class AddQuestion extends React.Component {
  state = {
    bulkModalVisible: false,
  }

  toggleBulkModal = () => {
    this.setState(({ bulkModalVisible }) => ({
      bulkModalVisible: !bulkModalVisible,
    }))
  }

  handleApply = ({
    number,
    type,
    startingIndex,
    alignment,
    authorDifficulty,
    depthOfKnowledge,
  }) => {
    const { onAddQuestion, scrollToBottom } = this.props

    for (let i = 0; i < number; i++) {
      const index = startingIndex + i
      onAddQuestion(type, index, startingIndex, {
        alignment,
        authorDifficulty,
        depthOfKnowledge,
      })()
    }

    this.toggleBulkModal()
    scrollToBottom()
  }

  render() {
    const { bulkModalVisible } = this.state
    const {
      onAddQuestion,
      onAddSection,
      minAvailableQuestionIndex,
    } = this.props
    return (
      <AddQuestionWrapper>
        <ContentWrapper>
          <QuestionTypes flexDirection="column">
            <Tooltip placement="top" title="Multiple Choice">
              <AddQuestionIcon
                onClick={onAddQuestion(MULTIPLE_CHOICE)}
                data-cy={MULTIPLE_CHOICE}
              >
                <IconNewList />
              </AddQuestionIcon>
            </Tooltip>
            <Tooltip placement="top" title="Text Entry">
              <AddQuestionIcon
                onClick={onAddQuestion(SHORT_TEXT)}
                data-cy={SHORT_TEXT}
              >
                <IconTextEntry />
              </AddQuestionIcon>
            </Tooltip>
            <Tooltip placement="top" title="Drop down">
              <AddQuestionIcon
                onClick={onAddQuestion(CLOZE_DROP_DOWN)}
                data-cy={CLOZE_DROP_DOWN}
              >
                <IconDropDown />
              </AddQuestionIcon>
            </Tooltip>
            <Tooltip placement="top" title="Math">
              <AddQuestionIcon onClick={onAddQuestion(MATH)} data-cy={MATH}>
                <IconMath />
              </AddQuestionIcon>
            </Tooltip>
            <Tooltip placement="top" title="True/False">
              <AddQuestionIcon
                onClick={onAddQuestion(TRUE_OR_FALSE)}
                data-cy={TRUE_OR_FALSE}
              >
                <IconTrueFalse />
              </AddQuestionIcon>
            </Tooltip>
            <Tooltip placement="top" title="Essay">
              <AddQuestionIcon
                onClick={onAddQuestion(ESSAY_PLAIN_TEXT)}
                data-cy={ESSAY_PLAIN_TEXT}
              >
                <IconPencilHollow />
              </AddQuestionIcon>
            </Tooltip>
            <Tooltip placement="top" title="Essay Rich Text">
              <AddQuestionIcon
                onClick={onAddQuestion(ESSAY_RICH_TEXT)}
                data-cy={ESSAY_RICH_TEXT}
              >
                <IconPencilHollow />
              </AddQuestionIcon>
            </Tooltip>
          </QuestionTypes>
          <QuestionTypes>
            <AddButton onClick={this.toggleBulkModal} data-cy="addBulk">
              Add Bulk
            </AddButton>
            <AddButton onClick={onAddSection} data-cy="addSection">
              Add Section
            </AddButton>
          </QuestionTypes>
          <AddBulkModal
            visible={bulkModalVisible}
            onCancel={this.toggleBulkModal}
            onApply={this.handleApply}
            minAvailableQuestionIndex={minAvailableQuestionIndex}
          />
        </ContentWrapper>
      </AddQuestionWrapper>
    )
  }
}

AddQuestion.propTypes = {
  minAvailableQuestionIndex: PropTypes.number.isRequired,
  onAddQuestion: PropTypes.func.isRequired,
  onAddSection: PropTypes.func.isRequired,
}

export default AddQuestion
