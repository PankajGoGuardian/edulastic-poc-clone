import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Modal } from 'antd'
import { values } from 'lodash'
import QuestionEditor from '../../../QuestionEditor'
import PickUpQuestionType from '../../../PickUpQuestionType'
import {
  changeCurrentQuestionAction,
  getCurrentQuestionSelector,
  deleteQuestionAction,
  updateQuestionAction,
} from '../../../sharedDucks/questions'
import { savePassageAction } from '../../ducks'
import {
  resourceTypeQuestions,
  saveQuestionAction,
} from '../../../QuestionEditor/ducks'

const QuestionToPassage = ({
  onCancel,
  isTestFlow,
  isEditFlow,
  question,
  updateQuestion,
  removeQuestion,
  setCurrentQuestion,
  saveWidgetToPassage,
  saveQuestionToPassage,
  isEditPassageQuestion,
  rowIndex,
  tabIndex,
}) => {
  const [prevQuestion, setPrevQuestion] = useState()
  const handleCancel = () => {
    onCancel()
    if (question?.id) {
      setCurrentQuestion('')
    }
    if (isEditPassageQuestion) {
      updateQuestion(prevQuestion)
    }
    if (!isEditPassageQuestion && question?.id) {
      removeQuestion(question.id)
    }
  }

  const handleAddWideget = () => {
    if (values(resourceTypeQuestions).includes(question.type)) {
      saveWidgetToPassage({
        rowIndex,
        tabIndex,
        isEdit: isEditPassageQuestion,
        callback: onCancel,
      })
    } else {
      saveQuestionToPassage({ rowIndex, tabIndex, callback: onCancel })
    }
  }

  useEffect(() => {
    if (isEditPassageQuestion && question?.id) {
      setPrevQuestion(question)
    }
  }, [question?.id, isEditPassageQuestion])

  return (
    <StyledModal visible footer={null} title={null} onCancel={handleCancel}>
      {question?.id && (
        <QuestionEditor
          isTestFlow={isTestFlow}
          isEditFlow={isEditFlow}
          isPassageWithQuestions
          onAddWidgetToPassage={handleAddWideget}
          onCloseEditModal={handleCancel}
        />
      )}
      {!question?.id && (
        <PickUpQuestionType addQuestionToPassage onModalClose={onCancel} />
      )}
    </StyledModal>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      question: getCurrentQuestionSelector(state),
    }),
    {
      removeQuestion: deleteQuestionAction,
      updateQuestion: updateQuestionAction,
      saveQuestionToPassage: saveQuestionAction,
      saveWidgetToPassage: savePassageAction,
      setCurrentQuestion: changeCurrentQuestionAction,
    }
  )
)
export default enhance(QuestionToPassage)

const StyledModal = styled(Modal).attrs({
  style: { top: 0 },
  width: '100%',
  height: '100%',
})`
  .ant-modal-header {
    display: none;
  }
  .ant-modal-body {
    padding: 0px;
    position: relative;
    & > div:not(.ant-spin) {
      & > svg {
        height: 100%;
      }
    }
  }
  .ant-modal-close {
    display: none;
  }
`
