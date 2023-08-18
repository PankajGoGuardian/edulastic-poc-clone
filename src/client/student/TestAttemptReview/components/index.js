import React, { useState, useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { IconLogoCompact } from '@edulastic/icons'
import styled, { ThemeProvider } from 'styled-components'
import { themeColor } from '@edulastic/colors'
import { Spin } from 'antd'
import { WithResources } from '@edulastic/common'
import { get } from 'lodash'
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
  getItemGroupsSelector,
  hasSectionsSelector,
} from '../../../assessment/selectors/test'

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
    blockSaveAndContinue = false,
    user: { firstName = '', lastName = '' },
    attachments,
    saveUserWork,
    itemGroups,
    submitSection,
    hasSections,
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
    enabled: restrictNavigationOut,
    history,
  })

  useEffect(() => {
    if (currentAssignment && !assignmentObj) {
      fetchAssignments()
    }
  }, [currentAssignment])

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
    if (hasSections && sectionId && itemGroups.length) {
      const currentSectionIndex = itemGroups.findIndex(
        (item) => item._id === sectionId
      )
      const nextItemId = itemGroups[currentSectionIndex + 1].items[0]._id
      const urlToGo = `/student/${assessmentType}/${testId}/class/${_groupId}/uta/${utaId}/itemId/${nextItemId}`
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

  return (
    <ThemeProvider theme={themes.default}>
      <Header>
        <IconLogoCompact style={{ fill: themeColor, marginLeft: '21px' }} />
      </Header>
      <MainContainer>
        {restrictNavigationOut && (
          <>
            <ForceFullScreenModal
              testActivityId={utaId}
              history={history}
              visible={!currentlyFullScreen}
              finishTest={() => submitSectionOrTest(groupId)}
            />
          </>
        )}
        {(blockSaveAndContinue || restrictNavigationOut) && (
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
          sectionId={sectionId}
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
      user: get(state, 'user.user', {}),
      attachments: getTestLevelUserWorkSelector(state),
      itemGroups: getItemGroupsSelector(state),
      hasSections: hasSectionsSelector(state),
    }),
    {
      finishTest: finishTestAcitivityAction,
      clearUserWork: clearUserWorkAction,
      fetchAssignments: fetchAssignmentsAction,
      saveUserWork: saveUserWorkAction,
      submitSection: submitSectionAction,
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
}

const MainContainer = styled.div`
  width: 100%;
  @media (min-width: 1200px) {
    display: flex;
    flex-direction: column;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 53px;
  border: 1px solid #dadae4;
  opacity: 1;
`
