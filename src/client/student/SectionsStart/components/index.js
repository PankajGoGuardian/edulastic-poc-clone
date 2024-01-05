import React, { useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { keyBy, isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import { test as testConstants } from '@edulastic/constants'
import { ThemeProvider } from 'styled-components'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { Spin } from 'antd'
import {
  FirestorePings,
  ForceFullScreenModal,
  useFullScreenListener,
  useTabNavigationCounterEffect,
} from '../../../assessment/themes/index'
import { themes } from '../../../theme'
import {
  getActivityDataSelector,
  getAssignmentSettingsSelector,
  getIsLoadingSelector,
  getItemstoDeliverWithAttemptCount,
  getPasswordValidatedStatusSelector,
  getPreventSectionNavigationSelector,
  slice,
} from '../ducks'
import { utaStartTimeUpdateRequired } from '../../sharedDucks/AssignmentModule/ducks'
import { TIME_UPDATE_TYPE } from '../../../assessment/themes/common/TimedTestTimer'
import SummaryHeader from '../../TestAttemptReview/components/SummaryHeader'
import { saveBlurTimeAction } from '../../../assessment/actions/items'
import SectionsTestRequirePassword from './SectionsTestRequirePassword'
import { MainContainer, ContentArea } from '../styled-components'
import SectionsInfo from './SectionsInfo'
import TestSectionsContainer from './TestSectionsContainer'

const getLastVisitedItemId = (activityData, sectionIndex, resume) => {
  const { questionActivities, itemsToBeExcluded, testActivity } = activityData
  const { itemsToDeliverInGroup } = testActivity
  const excludeItemsById = keyBy(itemsToBeExcluded)
  const currentSectionItems = itemsToDeliverInGroup[sectionIndex].items.filter(
    (item) => !excludeItemsById[item]
  )
  if (!resume) {
    return currentSectionItems[0]
  }
  const currentGroupItemsById = keyBy(currentSectionItems)
  const currentSectionActivities = questionActivities.filter(
    (uqa) => currentGroupItemsById[uqa.testItemId]
  )
  let lastAttemptedItem = currentSectionItems[0]
  if (!currentSectionActivities.length) {
    return lastAttemptedItem
  }
  const activitiesByTestItemId = keyBy(currentSectionActivities, 'testItemId')
  currentSectionItems.forEach((item, index) => {
    const uqa = activitiesByTestItemId[item]
    if (uqa && !uqa.skipped && index < currentSectionItems.length - 1) {
      lastAttemptedItem = currentSectionItems[index + 1]
    }
  })
  return lastAttemptedItem
}

const SummaryContainer = (props) => {
  const {
    history,
    match,
    preventSectionNavigation,
    fetchSectionsData,
    itemsToDeliverInGroup,
    isLoading,
    activityData,
    utaStartTimeUpdate,
    assignmentSettings,
    userId,
    saveBlurTime,
    savedBlurTime: blurTimeAlreadySaved = 0,
    isPasswordValidated,
    setIsSectionsTestPasswordValidated,
  } = props
  const { groupId, utaId, testId, assessmentType } = match.params
  const {
    restrictNavigationOut,
    restrictNavigationOutAttemptsThreshold,
    blockSaveAndContinue,
    passwordPolicy,
    questionsDelivery,
  } = assignmentSettings
  const { testActivity } = activityData

  useEffect(() => {
    fetchSectionsData({ utaId, groupId })
  }, [])

  const currentlyFullScreen = useFullScreenListener({
    enabled: restrictNavigationOut,
    assignmentId: testActivity?.assignmentId,
    classId: groupId,
    testActivityId: utaId,
    history,
    disableSave: blockSaveAndContinue,
    userId,
  })

  useTabNavigationCounterEffect({
    testActivityId: utaId,
    enabled: restrictNavigationOut && currentlyFullScreen,
    threshold: restrictNavigationOutAttemptsThreshold,
    history,
    assignmentId: testActivity?.assignmentId,
    classId: groupId,
    userId,
    onTimeInBlurChange: (v) => {
      saveBlurTime(v)
    },
    blurTimeAlreadySaved,
  })

  const handleStartSection = (index, resume) => () => {
    if (resume && activityData?.assignmentSettings?.timedAssignment) {
      utaStartTimeUpdate(TIME_UPDATE_TYPE.RESUME)
    }
    const nextItemId = getLastVisitedItemId(activityData, index, resume)
    history.push({
      pathname: `/student/${assessmentType}/${testId}/class/${groupId}/uta/${utaId}/itemId/${nextItemId}`,
      state: { fromSummary: true },
    })
  }

  const handleReviewSection = (index) => () => {
    const sectionId = itemsToDeliverInGroup[index].groupId
    history.push({
      pathname: `/student/${assessmentType}/${testId}/class/${groupId}/uta/${utaId}/section/${sectionId}/test-summary`,
      state: { fromSummary: true },
    })
  }

  const exitSectionsPage = () => {
    setIsSectionsTestPasswordValidated(false)
    history.push('/home/assignments')
  }

  if (
    !isEmpty(assignmentSettings) &&
    passwordPolicy !==
      testConstants?.passwordPolicy?.REQUIRED_PASSWORD_POLICY_OFF &&
    !isPasswordValidated
  ) {
    return <SectionsTestRequirePassword />
  }

  return (
    <ThemeProvider theme={themes.default}>
      {restrictNavigationOut && (
        <>
          <ForceFullScreenModal
            testActivityId={utaId}
            history={history}
            visible={!currentlyFullScreen}
            finishTest={exitSectionsPage}
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
          assignmentId={testActivity?.assignmentId}
        />
      )}
      <SummaryHeader
        showExit={!isLoading}
        hidePause={blockSaveAndContinue}
        onExitClick={exitSectionsPage}
      />
      <MainContainer>
        <ContentArea>
          <EduIf condition={isLoading}>
            <EduThen>
              <Spin />
            </EduThen>
            <EduElse>
              <SectionsInfo
                title={activityData?.test?.title}
                thumbnail={activityData?.test?.thumbnail}
              />
              <TestSectionsContainer
                itemsToDeliverInGroup={itemsToDeliverInGroup}
                preventSectionNavigation={preventSectionNavigation}
                questionsDelivery={questionsDelivery}
                handleStartSection={handleStartSection}
                handleReviewSection={handleReviewSection}
              />
            </EduElse>
          </EduIf>
        </ContentArea>
      </MainContainer>
    </ThemeProvider>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      isLoading: getIsLoadingSelector(state),
      activityData: getActivityDataSelector(state),
      itemsToDeliverInGroup: getItemstoDeliverWithAttemptCount(state),
      preventSectionNavigation: getPreventSectionNavigationSelector(state),
      assignmentSettings: getAssignmentSettingsSelector(state),
      userId: state.user?.user?._id,
      savedBlurTime: state.test?.savedBlurTime,
      isPasswordValidated: getPasswordValidatedStatusSelector(state),
    }),
    {
      fetchSectionsData: slice.actions.fetchSectionsData,
      setIsSectionsTestPasswordValidated:
        slice.actions.setIsSectionsTestPasswordValidated,
      utaStartTimeUpdate: utaStartTimeUpdateRequired,
      saveBlurTime: saveBlurTimeAction,
    }
  )
)

export default enhance(SummaryContainer)

SummaryContainer.propTypes = {
  history: PropTypes.func.isRequired,
}
