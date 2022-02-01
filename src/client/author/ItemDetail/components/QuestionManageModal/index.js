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
import UnsavedChangesModal from '../UnsavedChangesModal'

const QuestionManageModal = ({
  onCancel,
  isTestFlow,
  isEditFlow,
  isPassage,
  question,
  testId,
  updateQuestion,
  removeQuestion,
  setCurrentQuestion,
  saveWidgetToPassage,
  saveQuestionToItem,
  isEditMultipartQuestion,
  rowIndex,
  tabIndex,
  hasUnsavedChanges,
}) => {
  const [prevQuestion, setPrevQuestion] = useState()
  const [isFullModal, setIsFullModal] = useState(false)
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false)

  const handleToggleFullModal = () => {
    setIsFullModal(!isFullModal)
  }

  const applyCancel = () => {
    onCancel()
    if (question?.id) {
      setCurrentQuestion('')
    }
    if (isEditMultipartQuestion) {
      updateQuestion(prevQuestion)
    }
    if (!isEditMultipartQuestion && question?.id) {
      removeQuestion(question.id)
    }
  }

  const handleCancel = () => {
    console.log({ hasUnsavedChanges })
    if (question?.type === 'passage' && hasUnsavedChanges) {
      setShowUnsavedChangesModal(true)
    } else {
      applyCancel()
    }
  }

  const handleAddWideget = () => {
    if (isPassage && values(resourceTypeQuestions).includes(question.type)) {
      saveWidgetToPassage({
        rowIndex,
        tabIndex,
        isEdit: isEditMultipartQuestion,
        callback: onCancel,
        isTestFlow,
        testId,
      })
    } else {
      saveQuestionToItem({
        rowIndex,
        tabIndex,
        callback: onCancel,
        isTestFlow,
        testId,
      })
    }
  }

  useEffect(() => {
    if (isEditMultipartQuestion && question?.id) {
      setPrevQuestion(question)
    }
  }, [question?.id, isEditMultipartQuestion])

  const [modalWidth, modalHeight, modalStyle] = useMemo(() => {
    if (isFullModal) {
      return ['100vw', '100vh', { top: 0 }]
    }
    return ['95%', 'calc(100vh - 50px)', { top: 25 }]
  }, [isFullModal])

  console.log({ question })

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
            isQuestionManageModal
            isTestFlow={isTestFlow}
            isEditFlow={isEditFlow}
            isMultipartItem
            isInModal={!isFullModal}
            onToggleFullModal={handleToggleFullModal}
            onAddWidgetToItem={handleAddWideget}
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
      {}
      <StyledModal
        visible={showUnsavedChangesModal}
        title="You have unsaved changes"
        onCancel={() => setShowUnsavedChangesModal(false)}
        onOk={() => applyCancel(true)}
        centered
        //  width={modalWidth}
        //  height={modalHeight}
        style={modalStyle}
      >
        <UnsavedChangesModal />
      </StyledModal>
    </StyledModal>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      question: getCurrentQuestionSelector(state),
      hasUnsavedChanges: state?.authorQuestions?.updated || false,
    }),
    {
      removeQuestion: deleteQuestionAction,
      updateQuestion: updateQuestionAction,
      saveQuestionToItem: saveQuestionAction,
      saveWidgetToPassage: savePassageAction,
      setCurrentQuestion: changeCurrentQuestionAction,
    }
  )
)
export default enhance(QuestionManageModal)

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
