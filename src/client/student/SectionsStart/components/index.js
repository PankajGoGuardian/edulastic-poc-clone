import React, { useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  IconCircleLogout,
  IconLock,
  IconLogoCompact,
  // IconMessage,
  IconTick,
} from '@edulastic/icons'
import styled, { ThemeProvider } from 'styled-components'
import { themeColor } from '@edulastic/colors'
import { EduButton, EduElse, EduIf, EduThen } from '@edulastic/common'
import { Spin } from 'antd'
import { SECTION_STATUS } from '@edulastic/constants/const/testActivityStatus'
import { themes } from '../../../theme'
import {
  getActivityDataSelector,
  getIsLoadingSelector,
  getItemstoDeliverWithAttemptCount,
  getPreventSectionNavigationSelector,
  slice,
} from '../ducks'
import { SaveAndExitButton } from '../../../assessment/themes/common/styledCompoenents'
import { utaStartTimeUpdateRequired } from '../../sharedDucks/AssignmentModule/ducks'
import { TIME_UPDATE_TYPE } from '../../../assessment/themes/common/TimedTestTimer'

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
    return <EduButton onClick={handleStartSection(index)}>Start Test</EduButton>
  }
  if (totalVisited > 0 && status !== SECTION_STATUS.SUBMITTED) {
    return (
      <EduButton onClick={handleStartSection(index, true)}>Continue</EduButton>
    )
  }
  if (preventSectionNavigation && status === SECTION_STATUS.SUBMITTED) {
    return (
      <Completed>
        <IconTick fill={themeColor} />
        Completed
      </Completed>
    )
  }
  if (status === SECTION_STATUS.SUBMITTED) {
    return <EduButton onClick={handleReviewSection(index)}>Review</EduButton>
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
        return (
          <Section noBorder={isLast} disabled={showLockIcon}>
            <FlexBox>
              {showLockIcon && <IconLockStyled />}
              <SectionContent>
                <h4>{groupName}</h4>
                <EduIf condition={!showLockIcon}>
                  <EduThen>
                    <p>
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
  } = props
  const { groupId, utaId, testId, assessmentType } = match.params

  useEffect(() => {
    fetchSectionsData({ utaId, groupId })
  }, [])

  const handleStartSection = (index, resume) => () => {
    const nextItemId = itemsToDeliverInGroup[index].items[0]
    if (resume && activityData?.assignmentSettings?.timedAssignment) {
      utaStartTimeUpdate(TIME_UPDATE_TYPE.RESUME)
    }
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
      <Header>
        <IconLogoCompact style={{ fill: themeColor, marginLeft: '21px' }} />
        <SaveAndExitButton
          data-cy="finishTest"
          aria-label="Save and exit"
          onClick={exitSectionsPage}
          style={{ border: '1px solid', marginRight: '30px' }}
        >
          <IconCircleLogout />
        </SaveAndExitButton>
      </Header>
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
    }),
    {
      fetchSectionsData: slice.actions.fetchSectionsData,
      utaStartTimeUpdate: utaStartTimeUpdateRequired,
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

const Header = styled(FlexBox)`
  align-items: center;
  justify-content: space-between;
  height: 53px;
  border: 1px solid #dadae4;
  opacity: 1;
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
