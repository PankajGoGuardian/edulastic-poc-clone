import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Modal, Spin } from 'antd'
import { WithResources } from '@edulastic/common/src/HOC/withResources'
import { test as testConstants } from '@edulastic/constants'
import AssessmentPlayer from '../../../../assessment'
import TestActivityPreview from './TestActivityPreview'
import { finishedPreviewTestAction } from '../../../../assessment/sharedDucks/previewTest'
import AppConfig from '../../../../../app-config'
import {
  setShowTestInfoSuccesAction,
  setTestLoadingAction,
} from '../../../../assessment/actions/test'

const TestPreviewModal = ({
  isModalVisible,
  LCBPreviewModal,
  testId,
  test,
  error,
  closeTestPreviewModal: _closeTestPreviewModal,
  isStudentReport = false,
  passages,
  studentReportModal,
  currentAssignmentId,
  currentAssignmentClass,
  showStudentPerformance,
  finishedPreviewTest,
  testType,
  setShowTestInfoSucces,
  setTestLoading,
  resetOnClose,
  unmountOnClose = false,
  ...restProps
}) => {
  const [
    showStudentPerformancePreview,
    setShowStudentPerformancePreview,
  ] = useState(false)

  useEffect(() => {
    if (error) {
      _closeTestPreviewModal()
    }
  }, [error])

  useEffect(() => {
    if (!isModalVisible) {
      setShowTestInfoSucces(false)
      setTestLoading(true)
    }
  }, [isModalVisible])

  useEffect(() => {
    return () => {
      if (unmountOnClose) {
        setShowTestInfoSucces(false)
        setTestLoading(true)
        if (resetOnClose) {
          resetOnClose()
        }
      }
    }
  }, [])

  const closeTestPreviewModal = () => {
    _closeTestPreviewModal()
    setShowTestInfoSucces(false)
    setTestLoading(true)
  }

  const handleCloseModal = () => {
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
      maskClosable={false}
      centered
    >
      {showStudentPerformancePreview && (
        <TestActivityPreview onClose={handleCloseModal} previewModal />
      )}
      {!showStudentPerformancePreview && (
        <WithResources
          resources={[`${AppConfig.jqueryPath}/jquery.min.js`]}
          fallBack={<Spin />}
        >
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
            defaultAP={testType !== testConstants.type.PRACTICE}
            isModalVisible={isModalVisible}
            {...restProps}
          />
        </WithResources>
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

const enhanced = connect(
  (state) => ({
    testType: state.test.testType,
  }),
  {
    finishedPreviewTest: finishedPreviewTestAction,
    setShowTestInfoSucces: setShowTestInfoSuccesAction,
    setTestLoading: setTestLoadingAction,
  }
)

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
