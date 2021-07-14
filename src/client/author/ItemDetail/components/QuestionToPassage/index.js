import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Modal } from 'antd'
import { values } from 'lodash'
import { ScrollContext } from '@edulastic/common'
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
  const [isFullModal, setIsFullModal] = useState(false)

  const handleToggleFullModal = () => {
    setIsFullModal(!isFullModal)
  }

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

  const [modalWidth, modalHeight, modalStyle] = useMemo(() => {
    if (isFullModal) {
      return ['100vw', '100vh', { top: 0 }]
    }
    return ['90%', 'calc(100vh - 110px)', { top: 60 }]
  }, [isFullModal])

  return (
    <StyledModal
      visible
      footer={null}
      title={null}
      onCancel={handleCancel}
      width={modalWidth}
      height={modalHeight}
      style={modalStyle}
      isFullModal={isFullModal}
    >
      <ScrollContext.Provider
        value={{
          getScrollElement: () =>
            document.getElementsByClassName('question-editor-container')[0],
        }}
      >
        {question?.id && (
          <QuestionEditor
            isTestFlow={isTestFlow}
            isEditFlow={isEditFlow}
            isPassageWithQuestions
            isInModal={!isFullModal}
            onToggleFullModal={handleToggleFullModal}
            onAddWidgetToPassage={handleAddWideget}
            onCloseEditModal={handleCancel}
          />
        )}
        {!question?.id && (
          <PickUpQuestionType
            addQuestionToPassage
            onModalClose={onCancel}
            isInModal={!isFullModal}
            onToggleFullModal={handleToggleFullModal}
          />
        )}
      </ScrollContext.Provider>
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

const StyledModal = styled(Modal)`
  .ant-modal-header {
    display: none;
  }
  .ant-modal-content {
    border-radius: ${({ isFullModal }) => (isFullModal ? '' : '10px')};
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
