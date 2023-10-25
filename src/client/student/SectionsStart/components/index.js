import React, { useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { keyBy } from 'lodash'
import PropTypes from 'prop-types'
import { IconLock, IconTick } from '@edulastic/icons'
import styled, { ThemeProvider } from 'styled-components'
import { themeColor } from '@edulastic/colors'
import { EduButton, EduElse, EduIf, EduThen } from '@edulastic/common'
import { Spin } from 'antd'
import { SECTION_STATUS } from '@edulastic/constants/const/testActivityStatus'
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
  getPreventSectionNavigationSelector,
  slice,
} from '../ducks'
import { utaStartTimeUpdateRequired } from '../../sharedDucks/AssignmentModule/ducks'
import { TIME_UPDATE_TYPE } from '../../../assessment/themes/common/TimedTestTimer'
import SummaryHeader from '../../TestAttemptReview/components/SummaryHeader'
import { saveBlurTimeAction } from '../../../assessment/actions/items'

const RenderButton = ({
  attempted,
  skipped,
  preventSectionNavigation,
  handleReviewSection,
  handleStartSection,
  showLockIcon,
  index,
  status,
}) => {
  // Tried applying EduIf here but looks so much nested hence going with this approach for readability
  const totalVisited = attempted + skipped
  if (totalVisited === 0 && !showLockIcon) {
    return (
      <EduButton
        onClick={handleStartSection(index)}
        data-cy={`startButtton-${index}`}
      >
        Start Test
      </EduButton>
    )
  }
  if (totalVisited > 0 && status !== SECTION_STATUS.SUBMITTED) {
    return (
      <EduButton
        onClick={handleStartSection(index, true)}
        data-cy={`continueButton-${index}`}
      >
        Continue
      </EduButton>
    )
  }
  if (preventSectionNavigation && status === SECTION_STATUS.SUBMITTED) {
    return (
      <Completed data-cy={`completedSectionStatus-${index}`}>
        <IconTick fill={themeColor} />
        Completed
      </Completed>
    )
  }
  if (status === SECTION_STATUS.SUBMITTED) {
    return (
      <EduButton
        onClick={handleReviewSection(index)}
        data-cy={`reviewButton-${index}`}
      >
        Review
      </EduButton>
    )
  }
  return null
}
const TestSectionsContainer = ({
  itemsToDeliverInGroup,
  preventSectionNavigation,
  handleReviewSection,
  handleStartSection,
}) => {
  // Find first non submitted section
  const nextSection =
    itemsToDeliverInGroup.find(
      (item) => item.status !== SECTION_STATUS.SUBMITTED
    ) || {}
  return (
    <TestSections>
      {itemsToDeliverInGroup.map((section, index) => {
        const { items, attempted, skipped, status, groupName } = section
        const isLast = itemsToDeliverInGroup.length == index + 1
        const showLockIcon =
          nextSection.groupId !== section.groupId &&
          section.status !== SECTION_STATUS.SUBMITTED &&
          preventSectionNavigation
        if (!items.length) {
          return null
        }
        return (
          <Section noBorder={isLast} disabled={showLockIcon}>
            <FlexBox>
              {showLockIcon && <IconLockStyled />}
              <SectionContent>
                <h4 data-cy={`sectionName-${index}`}>{groupName}</h4>
                <EduIf condition={!showLockIcon}>
                  <EduThen>
                    <p data-cy={`questionsCompleted-${index}`}>
                      {attempted}/{items.length} questions completed
                    </p>
                  </EduThen>
                  <EduElse>
                    <p>
                      Opens after completing{' '}
                      <b>{itemsToDeliverInGroup[index - 1]?.groupName}</b>
                    </p>
                  </EduElse>
                </EduIf>
              </SectionContent>
            </FlexBox>
            <SectionProgress>
              <RenderButton
                attempted={attempted}
                skipped={skipped}
                preventSectionNavigation={preventSectionNavigation}
                handleReviewSection={handleReviewSection}
                handleStartSection={handleStartSection}
                showLockIcon={showLockIcon}
                index={index}
                status={status}
              />
            </SectionProgress>
          </Section>
        )
      })}
    </TestSections>
  )
}

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
  } = props
  const { groupId, utaId, testId, assessmentType } = match.params
  const {
    restrictNavigationOut,
    restrictNavigationOutAttemptsThreshold,
    blockSaveAndContinue,
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
    history.push('/home/assignments')
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
              <TestImage>
                <img
                  src={activityData?.test?.thumbnail}
                  alt={activityData?.test?.title}
                />
              </TestImage>
              <TestTitle>{activityData?.test?.title}</TestTitle>
              <TestInstruction>
                {/* <IconParent>
                  <IconMessage />
                </IconParent>
                <div>
                  <span>Teachers Instruction :</span> You are required to submit
                  the test section by section and once a section is submitted,
                  you wouldn’t be able to change it.
                </div> */}
              </TestInstruction>
              <SectionTitle>Your Test Sections</SectionTitle>
              <TestSectionsContainer
                itemsToDeliverInGroup={itemsToDeliverInGroup}
                preventSectionNavigation={preventSectionNavigation}
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
    }),
    {
      fetchSectionsData: slice.actions.fetchSectionsData,
      utaStartTimeUpdate: utaStartTimeUpdateRequired,
      saveBlurTime: saveBlurTimeAction,
    }
  )
)

export default enhance(SummaryContainer)

SummaryContainer.propTypes = {
  history: PropTypes.func.isRequired,
}

const FlexBox = styled.div`
  display: flex;
`
const MainContainer = styled(FlexBox)`
  justify-content: center;
`

const ContentArea = styled(FlexBox)`
  padding: 100px 20px 20px 20px;
  flex-direction: column;
  width: 40%;
  @media (max-width: 1400px) {
    width: 60%;
  }
  @media (max-width: 994px) {
    width: 80%;
  }
`

const TestTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
`

// const IconParent = styled.div`
//   height: 20px;
//   margin-right: 5px;
// `

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
`

const TestSections = styled.div`
  border: 1px solid #d8d8d8;
  padding: 20px;
  border-radius: 10px;
`

const Section = styled(FlexBox)`
  ${(props) => (props.noBorder ? '' : `border-bottom: 1px solid #d8d8d8`)};
  padding: 15px 0;
  justify-content: space-between;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'initial')};
`

const TestInstruction = styled(FlexBox)`
  span {
    color: #777777;
  }
`

const TestImage = styled.div`
  width: 114px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  img {
    width: 100%;
  }
`

const Completed = styled(FlexBox)`
  align-items: center;
  svg {
    margin-right: 10px;
  }
`

const SectionProgress = styled.div``

const SectionContent = styled.div`
  h4 {
    font-weight: 600;
  }
`

const IconLockStyled = styled(IconLock)`
  margin-right: 5px;
  margin-top: 5px;
`
