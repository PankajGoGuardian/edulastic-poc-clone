import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Col, Tooltip } from 'antd'
import {
  extraDesktopWidth,
  largeDesktopWidth,
  mobileWidthMax,
  smallDesktopWidth,
  desktopWidth,
  themeColor,
  greyThemeDark3,
} from '@edulastic/colors'
import { testActivity as testActivityConstants } from '@edulastic/constants'
import { FlexContainer, notification, TestTypeIcon } from '@edulastic/common'
import { IconSchedule, IconHourGlass } from '@edulastic/icons'
import { curriculumSequencesApi } from '@edulastic/api'
import { pick } from 'lodash'
import { ResouceIcon } from '../../author/CurriculumSequence/components/ResourceItem'
import { themes } from '../../theme'
import {
  formatDateAndTimeForAssignmentCard,
  formatStudentPastDueTag,
} from '../utils'
import { submitLTIForm } from '../../author/CurriculumSequence/components/CurriculumModuleRow'
import { cdnURI } from '../../../app-config'

const { pastDueTagBackground, pastDueTagColor } = themes.default.default

const {
  studentAssignmentConstants: { assignmentStatus },
} = testActivityConstants

const AssessmentDetails = ({
  title,
  thumbnail,
  testType,
  t,
  started,
  resume,
  dueDate,
  type,
  startDate,
  safeBrowser,
  graded = assignmentStatus.GRADED,
  absent,
  isPaused,
  lastAttempt,
  isDueDate,
  serverTimeStamp,
  timedAssignment,
  allowedTime,
  setEmbeddedVideoPreviewModal,
  studentResources = [],
}) => {
  const status =
    started || resume
      ? `${t('common.inProgress')} ${isPaused ? ' (PAUSED)' : ''}`
      : `${t('common.notStartedTag')} ${isPaused ? ' (PAUSED)' : ''}`

  let { endDate } = lastAttempt
  const pastDueTag =
    isDueDate &&
    !absent &&
    formatStudentPastDueTag({
      status: started || graded ? 'submitted' : 'inprogress',
      dueDate,
      endDate,
    })

  if (endDate && dueDate && endDate > dueDate) {
    endDate = dueDate
  }

  const showResource = async (resource) => {
    resource =
      resource &&
      pick(resource, [
        'toolProvider',
        'url',
        'customParams',
        'consumerKey',
        'sharedSecret',
      ])
    try {
      const signedRequest = await curriculumSequencesApi.getSignedRequest({
        resource,
      })
      submitLTIForm(signedRequest)
    } catch (e) {
      notification({ messageKey: 'failedToLoadResource' })
    }
  }

  const viewResource = (data) => (e) => {
    e.stopPropagation()
    if (data.contentType === 'lti_resource') showResource(data.contentId)
    if (data.contentType === 'website_resource')
      window.open(data.contentUrl, '_blank')
    if (data.contentType === 'video_resource')
      setEmbeddedVideoPreviewModal({
        title: data.contentTitle,
        url: data.contentUrl,
      })
  }

  return (
    <Wrapper>
      <Col>
        <ImageWrapper>
          <Thumbnail src={thumbnail} alt="" />
        </ImageWrapper>
      </Col>
      <CardDetails>
        <CardTitle>
          <Tooltip title={title}>
            <AssignmentTitle data-cy="testTitle">{title}</AssignmentTitle>
          </Tooltip>
          <TestTypeIcon
            toolTipTitle={t(`common.toolTip.${testType}`)}
            testType={testType}
          />
        </CardTitle>
        <FlexContainer alignItems="center" justifyContent="flex-start">
          <StatusWrapper>
            {type === 'assignment' ? (
              <>
                <StatusButton
                  isPaused={isPaused}
                  isSubmitted={started || resume}
                  assignment={type === 'assignment'}
                >
                  <span data-cy="status">{status}</span>
                </StatusButton>
                {safeBrowser && (
                  <SafeExamIcon
                    src={`${cdnURI}/JS/webresources/images/as/seb.png`}
                    title={t('common.safeExamToolTip')}
                  />
                )}
              </>
            ) : (
              <StatusButton
                isSubmitted={started}
                graded={graded}
                absent={absent}
              >
                <span data-cy="status">
                  {absent
                    ? t('common.absent')
                    : started
                    ? t(`common.${graded}`)
                    : t('common.absent')}
                </span>
              </StatusButton>
            )}
            {pastDueTag && (
              <StatusRow data-cy="pastDueTag">{pastDueTag}</StatusRow>
            )}
          </StatusWrapper>
          {!!((endDate && type !== 'assignment') || dueDate) && (
            <CardDate>
              <IconSchedule />
              <DueDetails data-cy="date">
                {type === 'assignment'
                  ? new Date(startDate) > new Date(serverTimeStamp)
                    ? `${t(
                        'common.opensIn'
                      )} ${formatDateAndTimeForAssignmentCard(
                        startDate
                      )} and ${t(
                        'common.dueOn'
                      )} ${formatDateAndTimeForAssignmentCard(dueDate)}`
                    : `${t(
                        'common.dueOn'
                      )} ${formatDateAndTimeForAssignmentCard(dueDate)}`
                  : `${t(
                      'common.completedOn'
                    )} ${formatDateAndTimeForAssignmentCard(endDate)}`}
              </DueDetails>
            </CardDate>
          )}

          <TimeIndicator type={type}>
            {timedAssignment && (
              <>
                <IconHourGlass data-cy="timerIcon" color={greyThemeDark3} />
                <StyledLabel>{allowedTime / (60 * 1000)} minutes</StyledLabel>
              </>
            )}
          </TimeIndicator>
        </FlexContainer>

        {!!studentResources?.length && (
          <ResourcesContainer>
            <span>Resources</span>
            <FlexContainer
              width="100%"
              flexWrap="wrap"
              justifyContent="flex-start"
            >
              {studentResources.map((data) => (
                <ResourceWrapper
                  key={data.contentId}
                  data-cy={data.contentId}
                  onClick={viewResource(data)}
                  showBorder
                >
                  <ResouceIcon type={data.contentType} isAdded />
                  <Title>{data.contentTitle}</Title>
                </ResourceWrapper>
              ))}
            </FlexContainer>
          </ResourcesContainer>
        )}
      </CardDetails>
    </Wrapper>
  )
}

AssessmentDetails.propTypes = {
  t: PropTypes.func.isRequired,
  dueDate: PropTypes.string.isRequired,
  started: PropTypes.bool.isRequired,
}

export default AssessmentDetails
const getStatusBgColor = (props, type) => {
  if (props.assignment) {
    if (props.isSubmitted) {
      return props.theme.assignment[`cardInProgressLabel${type}Color`]
    }
    return props.theme.assignment[`cardNotStartedLabel${type}Color`]
  }
  if (props.absent) {
    return props.theme.assignment[`cardAbsentLabel${type}Color`]
  }
  if (props.isSubmitted) {
    switch (props.graded) {
      case assignmentStatus.GRADE_HELD:
        return props.theme.assignment[`cardGradeHeldLabel${type}Color`]
      case assignmentStatus.NOT_GRADED:
        return props.theme.assignment[`cardNotGradedLabel${type}Color`]
      case assignmentStatus.GRADED:
        return props.theme.assignment[`cardGradedLabel${type}Color`]
      default:
        return props.theme.assignment[`cardSubmitedLabel${type}Color`]
    }
  } else {
    return props.theme.assignment[`cardAbsentLabel${type}Color`]
  }
}

const Wrapper = React.memo(styled(Col)`
  display: flex;
  flex-direction: row;

  @media screen and (max-width: 767px) {
    flex-direction: column;
    align-items: center;
  }
`)

const ImageWrapper = React.memo(styled.div`
  max-width: 168.5px;
  max-height: 90.5px;
  overflow: hidden;
  border-radius: 10px;
  margin-right: 40px;

  @media (max-width: ${extraDesktopWidth}) {
    margin-right: 20px;
  }

  @media (max-width: ${smallDesktopWidth}) {
    margin-right: 10px;
  }

  @media screen and (max-width: 767px) {
    max-width: 100%;
    margin: 0;
  }
`)

const Thumbnail = React.memo(styled.img`
  width: 168px;
  border-radius: 10px;
  height: 90px;
  object-fit: cover;

  @media (max-width: ${largeDesktopWidth}) {
    width: 130px;
    height: 77px;
  }
  @media (max-width: ${desktopWidth}) {
    width: 100px;
    height: 90px;
    object-fit: contain;
  }

  @media (max-width: ${mobileWidthMax}) {
    width: calc(100% - 14px);
    height: 90.5px;
    display: block;
    margin: 0 auto;
  }
`)

const AssignmentTitle = React.memo(styled.span`
  font-size: ${(props) => props.theme.assignment.cardAssingmnetTitleFontSize};
  max-width: 70vw;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  @media (max-width: ${largeDesktopWidth}) {
    max-width: 55vw;
  }
`)

const CardDetails = React.memo(styled(Col)`
  @media (min-width: ${extraDesktopWidth}) {
    width: 40vw;
  }

  @media (max-width: ${extraDesktopWidth}) {
    width: 35vw;
  }

  @media only screen and (min-width: ${smallDesktopWidth}) and (max-width: ${extraDesktopWidth}) {
    width: 30vw;
  }

  @media only screen and (min-width: ${mobileWidthMax}) and (max-width: ${desktopWidth}) {
    width: 18vw;
  }

  @media (max-width: ${mobileWidthMax}) {
    width: 100%;
  }

  @media screen and (max-width: 767px) {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 10px;
  }
`)

const CardTitle = React.memo(styled.div`
  display: flex;
  overflow: visible;
  font-family: ${(props) => props.theme.assignment.cardTitleFontFamily};
  font-size: ${(props) => props.theme.assignment.cardTitleFontSize};
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.38;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.assignment.cardTitleColor};
  padding-bottom: 8px;
  padding-top: 3px;

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 14px;
  }
  @media (max-width: ${mobileWidthMax}) {
    font-size: 16px;
    text-align: center;
  }
`)

const CardDate = React.memo(styled.div`
  display: flex;
  align-items: center;
  font-family: ${(props) => props.theme.assignment.cardTitleFontFamily};
  font-size: ${(props) => props.theme.assignment.cardTimeTextFontSize};
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.38;
  letter-spacing: normal;
  text-align: left;
  color: ${(props) => props.theme.assignment.cardTimeTextColor};
  padding: 0px 15px 0px 20px;

  svg {
    transform: scale(1.1);
  }

  @media (max-width: ${largeDesktopWidth}) {
    font-size: 10px;
  }

  @media (max-width: ${mobileWidthMax}) {
    font-size: 13px;
    padding-bottom: 13px;
    padding-top: 10px;
  }
`)

const DueDetails = React.memo(styled.span`
  padding-left: 10px;
  font-size: ${({ theme }) => theme.assignment.dueDateFontSize};
  @media (max-width: ${smallDesktopWidth}) {
    padding-left: 5px;
    font-size: ${(props) => props.theme.smallLinkFontSize};
  }
`)

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
`

const StatusButton = React.memo(styled.div`
  min-width: ${(props) => (props.isPaused ? 'auto' : '121px')};
  min-height: 23.5px;
  border-radius: 5px;
  background-color: ${(props) => getStatusBgColor(props, 'Bg')};
  font-size: ${(props) => props.theme.assignment.cardSubmitLabelFontSize};
  font-weight: bold;
  line-height: 1.38;
  letter-spacing: 0.2px;
  text-align: center;
  padding: 6px 24px;
  span {
    position: relative;
    color: ${(props) => getStatusBgColor(props, 'Text')};
  }

  @media (max-width: ${largeDesktopWidth}) {
    width: 94px;
    font-size: 9px;
    padding: 6px 14px;
  }

  @media screen and (max-width: ${mobileWidthMax}) {
    width: 100%;
  }
`)

const SafeExamIcon = React.memo(styled.img`
  width: 25px;
  height: 25px;
  margin-left: 10px;
`)

const StatusRow = styled.div`
  height: 25px;
  overflow: hidden;
  background: ${pastDueTagBackground};
  color: ${pastDueTagColor};
  font-size: 10px;
  text-transform: uppercase;
  font-weight: bold;
  padding: 6px 24px;
  border-radius: 5px;
  margin-left: 6px;
`

const ResourcesContainer = styled.div`
  margin-top: 10px;
  display: flex;
  width: 100%;

  span {
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 600;
    padding: 12px 10px 0 0;
  }

  @media (max-width: ${largeDesktopWidth}) {
    span {
      font-size: 10px;
    }
  }
`

const ResourceWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  margin: 4px 0px;
  width: auto;
  cursor: pointer;
  margin-right: 10px;

  &:last-child {
    margin-right: 0px;
  }

  @media (max-width: ${largeDesktopWidth}) {
    padding: 4px 6px;
  }
`
const TimeIndicator = styled.div`
  display: flex;
  align-items: center;
  width: 125px;
  padding: 0px 5px;
  padding-top: ${(props) => props.type === 'reports' && '25px'};
`
const StyledLabel = styled.label`
  margin-left: 10px;
  text-transform: uppercase;
  font: 11px/15px Open Sans;
  font-weight: 600;
`

const Title = styled.div`
  font-size: 12px;
  color: ${themeColor};
  padding-top: 2px;
  font: 10px/15px Open Sans;
  font-weight: 600;
  text-transform: uppercase;
  user-select: none;

  @media (max-width: ${largeDesktopWidth}) {
    font: 9px;
  }
`
