import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import { test as testConstants } from '@edulastic/constants'
import { WithResources } from '@edulastic/common/src/HOC/withResources'
import { compose } from 'redux'
import { connect } from 'react-redux'
import AssessmentPlayer from '../assessment'
import AppConfig from '../../app-config'
import { finishedPreviewTestAction } from '../assessment/sharedDucks/previewTest'
import {
  setShowTestInfoSuccesAction,
  setTestLoadingAction,
} from '../assessment/actions/test'
import TestActivityPreview from './Assignments/components/Container/TestActivityPreview'

const DemoPlayer = ({
  match,
  testType,
  isModalVisible,
  error,
  finishedPreviewTest,
  setShowTestInfoSucces,
  setTestLoading,
  resetOnClose,
  unmountOnClose,
}) => {
  const { id: testId } = match.params
  /**
   * Assessment player need to be wrapped with jquery loading
   */
  const _closeTestPreviewModal = () => {
    window.location.href = '/'
  }

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
    // if preview is on edulastic.com then close parent preview modal
    if (window?.location?.host === 'preview.edulastic.com') {
      window.parent.postMessage(
        JSON.stringify({ type: 'EXIT_DEMO_ASSIGNMENT' }),
        '*'
      )
    }
    closeTestPreviewModal()
    finishedPreviewTest()
    setShowStudentPerformancePreview(false)
  }

  const submitPreviewTest = () => {
    setShowStudentPerformancePreview(true)
  }

  return (
    <>
      {showStudentPerformancePreview && (
        <TestActivityPreview onClose={handleCloseModal} previewModal />
      )}
      {!showStudentPerformancePreview && (
        <WithResources
          resources={[`${AppConfig.jqueryPath}/jquery.min.js`]}
          fallBack={<Spin />}
        >
          <AssessmentPlayer
            testId={testId}
            preview
            demo
            closeTestPreviewModal={closeTestPreviewModal}
            submitPreviewTest={submitPreviewTest}
            defaultAP={testType !== testConstants.type.PRACTICE}
            isTestDemoPlayer
          />
        </WithResources>
      )}
    </>
  )
}

DemoPlayer.propTypes = {
  match: PropTypes.object.isRequired,
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      testType: state.test.testType,
    }),
    {
      finishedPreviewTest: finishedPreviewTestAction,
      setShowTestInfoSucces: setShowTestInfoSuccesAction,
      setTestLoading: setTestLoadingAction,
    }
  )
)
export default enhance(DemoPlayer)
