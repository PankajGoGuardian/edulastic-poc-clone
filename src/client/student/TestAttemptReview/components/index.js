import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled, { ThemeProvider } from 'styled-components'
import { Spin } from 'antd'
import { WithResources } from '@edulastic/common'
import { get } from 'lodash'
import { SECTION_STATUS } from '@edulastic/constants/const/testActivityStatus'
import { themes } from '../../../theme'
import AppConfig from '../../../../app-config'
import SummaryTest from './Content'
import {
  finishTestAcitivityAction,
  submitSectionAction,
} from '../../../assessment/actions/test'
import {
  FirestorePings,
  ForceFullScreenModal,
  useFullScreenListener,
  useTabNavigationCounterEffect,
} from '../../../assessment/themes/index'
import {
  clearUserWorkAction,
  saveUserWorkAction,
} from '../../../assessment/actions/userWork'
import { fetchAssignmentsAction } from '../../Reports/ducks'
import useUploadToS3 from '../../../assessment/hooks/useUploadToS3'
import UserWorkUploadModal from '../../../assessment/components/UserWorkUploadModal'
import { getTestLevelUserWorkSelector } from '../../sharedDucks/TestItem'
import {
  getItemGroupsByExcludingItemsSelector,
  getItemsSelector,
  getItemsToDeliverInGroupByIdSelector,
  getPreventSectionNavigationSelector,
  hasSectionsSelector,
} from '../../../assessment/selectors/test'
import { saveBlurTimeAction } from '../../../assessment/actions/items'
import SummaryHeader from './SummaryHeader'

const SummaryContainer = (props) => {
  const {
    finishTest,
    history,
    match,
    assignmentById,
    currentAssignment,
    userId,
    fetchAssignments,
    restrictNavigationOut = false,
    restrictNavigationOutAttemptsThreshold,
    saveBlurTime,
    savedBlurTime: blurTimeAlreadySaved = 0,
    blockSaveAndContinue = false,
    user: { firstName = '', lastName = '' },
    attachments,
    saveUserWork,
    deliveringItemGroups,
    submitSection,
    hasSections,
    preventSectionNavigation,
    itemsToDeliverIngroupById,
    preview,
    closeTestPreviewModal,
    setCurrentItemIdForPreview,
    submitPreviewTest,
    testPreviewSectionId,
    showSectionStartPageCallback,
    setShowTestAttemptReview,
  } = props

  const assignmentObj = currentAssignment && assignmentById[currentAssignment]
  const [cameraImageIndex, setCameraImageIndex] = useState(1)
  const [
    isUserWorkUploadModalVisible,
    setUserWorkUploadModalVisible,
  ] = useState(false)

  const [, uploadToS3] = useUploadToS3(userId)

  const { groupId, utaId, sectionId, assessmentType, id: testId } = match.params

  const currentlyFullScreen = useFullScreenListener({
    enabled: restrictNavigationOut,
    assignmentId: assignmentObj?._id,
    classId: groupId,
    testActivityId: utaId,
    history,
    disableSave: blockSaveAndContinue,
    userId,
  })

  useTabNavigationCounterEffect({
    testActivityId: utaId,
    enabled: restrictNavigationOut && currentlyFullScreen,
    threshold:
      restrictNavigationOut === 'warn-and-report-after-n-alerts'
        ? restrictNavigationOutAttemptsThreshold
        : 0,
    history,
    assignmentId: assignmentObj?._id,
    classId: groupId,
    userId,
    onTimeInBlurChange: (v) => {
      saveBlurTime(v)
    },
    blurTimeAlreadySaved,
  })

  useEffect(() => {
    if (preview) {
      return
    }
    if (currentAssignment && !assignmentObj) {
      fetchAssignments()
    }
  }, [currentAssignment])

  useEffect(() => {
    if (preview) {
      return
    }
    // Teacher enabled to restrict going back to a submitted section ?
    // There are no UI components that allows student to navigate to this page from a new section
    // Incase if user come through browser back button or hard coded url navigate them to home screen
    if (
      preventSectionNavigation &&
      sectionId &&
      itemsToDeliverIngroupById[sectionId] &&
      itemsToDeliverIngroupById[sectionId].status === SECTION_STATUS.SUBMITTED
    ) {
      // It is possible to navigate user to window.history.go(1) so that they will launch back to from where they came
      // However that wont work for a deeplink or hard coded url navigation hence redirect them to home screen
      history.push('/home/assignments')
    }
  }, [preventSectionNavigation, sectionId, itemsToDeliverIngroupById])

  const openUserWorkUploadModal = () => setUserWorkUploadModalVisible(true)
  const closeUserWorkUploadModal = () => setUserWorkUploadModalVisible(false)
  const cameraImageName = `${firstName}_${lastName}_${(
    assignmentObj?.title || ''
  )
    .split(' ')
    .join('_')}_${cameraImageIndex}.png`

  const saveUserWorkAttachments = (files) => {
    const newAttachments = files.map(({ name, type, size, source }) => ({
      name,
      type,
      size,
      source,
    }))

    saveUserWork({ attachments: [...(attachments || []), ...newAttachments] })
    setCameraImageIndex((x) => x + 1)
    closeUserWorkUploadModal()
  }

  // Submit the sections of test on click of submit either from section summary or final summary
  const submitSectionOrTest = (_groupId) => {
    if (preview) {
      if (testPreviewSectionId) {
        setShowTestAttemptReview(false)
        showSectionStartPageCallback()
        return
      }
      submitPreviewTest()
      return
    }
    if (hasSections && sectionId && deliveringItemGroups.length) {
      const urlToGo = `/student/${assessmentType}/${testId}/class/${_groupId}/uta/${utaId}/sections-start`
      const locationState = {
        fromSummary: true,
        ...history.location.state,
      }
      return submitSection({
        testActivityId: utaId,
        sectionId,
        urlToGo,
        locationState,
      })
    }
    finishTest(_groupId)
  }

  const exitSectionsPage = () => {
    if (preview && typeof closeTestPreviewModal === 'function') {
      closeTestPreviewModal()
      return
    }
    history.push('/home/assignments')
  }

  return (
    <ThemeProvider theme={themes.default}>
      <SummaryHeader
        showExit={sectionId || preview}
        hidePause={blockSaveAndContinue}
        onExitClick={exitSectionsPage}
        isTestPreviewModal={preview}
      />
      <MainContainer>
        {!preview && restrictNavigationOut && (
          <>
            <ForceFullScreenModal
              testActivityId={utaId}
              history={history}
              visible={!currentlyFullScreen}
              finishTest={() => submitSectionOrTest(groupId)}
            />
          </>
        )}
        {!preview && (blockSaveAndContinue || restrictNavigationOut) && (
          <FirestorePings
            testActivityId={utaId}
            history={history}
            blockSaveAndContinue={blockSaveAndContinue}
            userId={userId}
            classId={groupId}
            assignmentId={assignmentObj?._id}
          />
        )}
        <SummaryTest
          finishTest={() => submitSectionOrTest(groupId)}
          openUserWorkUploadModal={openUserWorkUploadModal}
          sectionId={preview ? testPreviewSectionId : sectionId}
          preview={preview}
          setCurrentItemIdForPreview={setCurrentItemIdForPreview}
        />
      </MainContainer>
      <UserWorkUploadModal
        isModalVisible={isUserWorkUploadModalVisible}
        onCancel={closeUserWorkUploadModal}
        uploadFile={uploadToS3}
        onUploadFinished={saveUserWorkAttachments}
        cameraImageName={cameraImageName}
      />
    </ThemeProvider>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      userId: state.user?.user?._id,
      assignmentById: state.studentAssignment?.byId,
      currentAssignment: state.studentAssignment?.current,
      blockSaveAndContinue: state.test?.settings?.blockSaveAndContinue,
      restrictNavigationOut: state.test?.settings?.restrictNavigationOut,
      restrictNavigationOutAttemptsThreshold:
        state.test?.settings?.restrictNavigationOutAttemptsThreshold,
      savedBlurTime: state.test?.savedBlurTime,
      user: get(state, 'user.user', {}),
      attachments: getTestLevelUserWorkSelector(state),
      hasSections: hasSectionsSelector(state),
      testItems: getItemsSelector(state),
      deliveringItemGroups: getItemGroupsByExcludingItemsSelector(state),
      itemsToDeliverIngroupById: getItemsToDeliverInGroupByIdSelector(state),
      preventSectionNavigation: getPreventSectionNavigationSelector(state),
    }),
    {
      finishTest: finishTestAcitivityAction,
      clearUserWork: clearUserWorkAction,
      fetchAssignments: fetchAssignmentsAction,
      saveUserWork: saveUserWorkAction,
      submitSection: submitSectionAction,
      saveBlurTime: saveBlurTimeAction,
    }
  )
)

function SummaryContainerWithjQuery(props) {
  return (
    <WithResources resources={[AppConfig.jqueryPath]} fallBack={<Spin />}>
      <SummaryContainer {...props} />
    </WithResources>
  )
}

export default enhance(SummaryContainerWithjQuery)

SummaryContainer.propTypes = {
  finishTest: PropTypes.func.isRequired,
  history: PropTypes.func.isRequired,
  preview: PropTypes.bool,
  closeTestPreviewModal: PropTypes.func,
  setCurrentItemIdForPreview: PropTypes.func,
  submitPreviewTest: PropTypes.func,
  showSectionStartPageCallback: PropTypes.func,
  setShowTestAttemptReview: PropTypes.func,
}

SummaryContainer.defaultProps = {
  preview: false,
  closeTestPreviewModal: () => {},
  setCurrentItemIdForPreview: () => {},
  submitPreviewTest: () => {},
  showSectionStartPageCallback: () => {},
  setShowTestAttemptReview: () => {},
}

const MainContainer = styled.div`
  width: 100%;
  @media (min-width: 1200px) {
    display: flex;
    flex-direction: column;
  }
`
