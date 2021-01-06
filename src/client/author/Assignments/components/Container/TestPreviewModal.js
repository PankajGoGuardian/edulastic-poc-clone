import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Modal } from 'antd'
import AssessmentPlayer from '../../../../assessment'
import TestActivityPreview from './TestActivityPreview'
import { finishedPreviewTestAction } from '../../../../assessment/sharedDucks/previewTest'

const TestPreviewModal = ({
  isModalVisible,
  LCBPreviewModal,
  testId,
  test,
  error,
  closeTestPreviewModal,
  isStudentReport = false,
  passages,
  studentReportModal,
  currentAssignmentId,
  currentAssignmentClass,
  showStudentPerformance,
  finishedPreviewTest,
  demo,
  ...restProps
}) => {
  const [
    showStudentPerformancePreview,
    setShowStudentPerformancePreview,
  ] = useState(false)
  useEffect(() => {
    if (error) {
      closeTestPreviewModal()
    }
  }, [error])

  const handleCloseModal = () => {
    if (demo) {
      return
    }
    closeTestPreviewModal()
    finishedPreviewTest()
    setShowStudentPerformancePreview(false)
  }

  const submitPreviewTest = () => {
    if (showStudentPerformance) {
      setShowStudentPerformancePreview(true)
    } else {
      handleCloseModal()
    }
  }

  return (
    <StyledModal
      visible={isModalVisible}
      title="Test Preview"
      onCancel={closeTestPreviewModal}
      onOk={closeTestPreviewModal}
      width="100%"
      destroyOnClose
      footer={null}
      header={null}
      wrapClassName="test-preview-modal"
      closable={false}
      centered
    >
      {showStudentPerformancePreview && (
        <TestActivityPreview onClose={handleCloseModal} previewModal />
      )}
      {!showStudentPerformancePreview && (
        <AssessmentPlayer
          closeTestPreviewModal={handleCloseModal}
          submitPreviewTest={submitPreviewTest}
          LCBPreviewModal={LCBPreviewModal}
          testId={testId}
          test={test}
          passages={passages}
          preview
          showTools={!isStudentReport}
          isStudentReport={isStudentReport}
          studentReportModal={studentReportModal}
          currentAssignmentId={currentAssignmentId}
          currentAssignmentClass={currentAssignmentClass}
          demo={demo}
          {...restProps}
        />
      )}
    </StyledModal>
  )
}

TestPreviewModal.propTypes = {
  isModalVisible: PropTypes.bool,
  LCBPreviewModal: PropTypes.bool,
  test: PropTypes.object,
  testId: PropTypes.string.isRequired,
}

TestPreviewModal.defaultProps = {
  test: {},
  isModalVisible: false,
  LCBPreviewModal: false,
}

const enhanced = connect(null, {
  finishedPreviewTest: finishedPreviewTestAction,
})

export default enhanced(TestPreviewModal)

const StyledModal = styled(Modal)`
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
`
