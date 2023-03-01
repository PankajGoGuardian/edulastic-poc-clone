import React, { useState, memo, useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { notification, EduButton } from '@edulastic/common'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import {
  mobileWidthMax,
  smallDesktopWidth,
  lightGreySecondary,
  largeDesktopWidth,
  desktopWidth,
  tabletWidth,
  mediumDesktopExactWidth,
} from '@edulastic/colors'
import { test as testConstants } from '@edulastic/constants'

import PropTypes from 'prop-types'
import styled, { withTheme } from 'styled-components'
import { first, maxBy, isNaN } from 'lodash'
import { Row, Col } from 'antd'
import { maxDueDateFromClassess, getServerTs } from '../utils'

//  components
import AssessmentDetails from './AssessmentDetail'
import StartButton from '../Assignments/components/StartButton'
import ReviewButton from '../Reports/components/ReviewButton'
import SafeStartAssignButton from '../styled/AssignmentCardButton'
import Attempt from './Attempt'
import { ConfirmationModal } from '../../author/src/components/common/ConfirmationModal'

// actions
import {
  startAssignmentAction,
  resumeAssignmentAction,
} from '../Assignments/ducks'
import { proxyRole } from '../Login/ducks'
import { showTestInfoModal } from '../../publicTest/utils'
import { isRestrictedTimeWindowForAssignment } from '../../author/Assignments/utils'

const isSEB = () => window.navigator.userAgent.includes('SEB')

const SafeBrowserButton = ({ t, attempted, resume, startTest }) => {
  const startButtonText = resume
    ? t('common.resume')
    : attempted
    ? t('common.retake')
    : t('common.startAssignment')

  return (
    <SafeStartAssignButton onClick={startTest} assessment>
      {startButtonText}
    </SafeStartAssignButton>
  )
}

const AssignmentCard = memo(
  ({
    startAssignment,
    resumeAssignment,
    data,
    theme,
    t,
    type,
    classId,
    user: { role: userRole, _id: userId },
    proxyUserRole,
    highlightMode,
    index,
    uta = {},
    setSelectedLanguage,
    languagePreference,
    history,
    setEmbeddedVideoPreviewModal,
  }) => {
    const [showAttempts, setShowAttempts] = useState(false)
    const toggleAttemptsView = () => setShowAttempts((prev) => !prev)
    const { releaseGradeLabels } = testConstants
    const [retakeConfirmation, setRetakeConfirmation] = useState(false)
    const [showRetakeModal, setShowRetakeModal] = useState(false)
    const assignmentCardRef = useRef()

    // case: when highlightMode is true i.e if want to highlight and assignment
    // scoll to specific assignment view
    useEffect(() => {
      if (highlightMode) {
        if (assignmentCardRef.current) {
          window.scrollTo({
            top: assignmentCardRef.current.parentNode.offsetTop,
            behavior: 'smooth',
          })
        }
      }
    }, [highlightMode])

    const {
      test = {},
      reports = [],
      testId,
      _id: assignmentId,
      safeBrowser,
      testType,
      class: clazz = [],
      title,
      thumbnail,
      timedAssignment,
      pauseAllowed,
      allowedTime,
      assignedBy,
      hasInstruction = false,
      instruction = '',
      multiLanguageEnabled = false,
      studentResources = [],
    } = data

    const serverTimeStamp = getServerTs(data)

    let {
      endDate,
      startDate,
      open = false,
      close = false,
      isPaused = false,
      maxAttempts = 1,
      dueDate,
    } = data
    const currentClassList = clazz.filter(
      (cl) =>
        (cl._id === classId && !cl.students?.length) ||
        (cl.students?.length && cl.students?.includes(userId))
    )

    if (!startDate || !endDate) {
      const maxCurrentClass =
        currentClassList && currentClassList.length > 0
          ? maxBy(currentClassList, 'endDate') ||
            currentClassList[currentClassList.length - 1]
          : {}
      open = maxCurrentClass.open
      close = maxCurrentClass.close
      startDate = maxCurrentClass.startDate
      endDate = maxCurrentClass.endDate
      isPaused = currentClassList.some((_class) => _class.isPaused)
    }
    if (!startDate && open) {
      const maxCurrentClass =
        currentClassList && currentClassList.length > 0
          ? maxBy(currentClassList, 'openDate') ||
            currentClassList[currentClassList.length - 1]
          : {}
      startDate = maxCurrentClass.openDate
      isPaused = currentClassList.some((_class) => _class.isPaused)
    }
    if (!endDate && close) {
      endDate = (currentClassList && currentClassList.length > 0
        ? maxBy(currentClassList, 'closedDate') ||
          currentClassList[currentClassList.length - 1]
        : {}
      ).closedDate
    }

    // if duedate is not passed get max due date from classAssessments
    if (!dueDate) {
      // to find all classes have specific student and get max dueDate
      dueDate = maxDueDateFromClassess(currentClassList, userId)
    }

    const lastAttempt = maxBy(reports, (o) => parseInt(o.startDate, 10)) || {}
    // if last test attempt was not *submitted*, user should be able to resume it.
    const resume = lastAttempt.status == 0
    const absent = lastAttempt.status == 2
    const graded =
      lastAttempt.graded && lastAttempt.graded.toLowerCase() === 'in grading'
        ? 'submitted'
        : lastAttempt.graded
    let newReports = resume
      ? reports.slice(0, reports.length - 1)
      : reports.slice(0)
    newReports = newReports || []
    const { maxScore = 0, score = 0 } = first(newReports) || {}
    const attempted = !!(newReports && newReports.length)
    const attemptCount = newReports && newReports.length
    let scorePercentage = (score / maxScore) * 100 || 0
    if (!Number.isFinite(scorePercentage)) {
      scorePercentage = 0
    }

    const arrow = showAttempts ? '\u2191' : '\u2193'
    // To handle regrade reduce max attempt settings.
    if (maxAttempts < reports.length && !isNaN(maxAttempts)) {
      maxAttempts = reports.length
    }
    if (!isPaused) {
      isPaused = Object.keys(uta).length
        ? !!uta?.isPaused
        : !!lastAttempt.isPaused
    }
    useEffect(() => {
      if (index <= 2 && reports.length > 0 && maxAttempts > 1) {
        setShowAttempts(true)
      }
    }, [index])
    const startTest = () => {
      // On start check if assignment is expired or not
      if (endDate && serverTimeStamp > endDate) {
        notification({ messageKey: 'testIsExpired' })
        return
      }

      if (
        !resume &&
        (timedAssignment || hasInstruction || multiLanguageEnabled)
      ) {
        return showTestInfoModal({
          pauseAllowed,
          allowedTime,
          multiLanguageEnabled,
          setSelectedLanguage,
          languagePreference,
          timedAssignment,
          hasInstruction,
          instruction,
          attemptCount,
          maxAttempts,
          startAssignment,
          testId,
          assignmentId,
          testType,
          classId,
          history,
          title,
          notifyCancel: false,
        })
      }

      if (resume) {
        resumeAssignment({
          testId,
          testType,
          assignmentId,
          testActivityId: lastAttempt._id,
          classId,
        })
      } else if (attemptCount < maxAttempts) {
        startAssignment({
          testId,
          assignmentId,
          testType,
          classId,
          languagePreference,
          safeBrowser,
        })
      }
    }

    const startSEBTest = () => {
      // On start check if assignment is expired or not
      if (endDate && serverTimeStamp > endDate) {
        notification({ messageKey: 'testIsExpired' })
        return
      }
      if (resume) {
        startAssignment({
          testId,
          assignmentId,
          testType,
          classId,
          languagePreference,
          safeBrowser,
          lastAttemptId: lastAttempt._id,
        })
      } else if (attemptCount < maxAttempts) {
        startAssignment({
          testId,
          assignmentId,
          testType,
          classId,
          languagePreference,
          safeBrowser,
        })
      }
    }

    const checkRetakeOrStart = () => {
      if (!resume && attempted && !retakeConfirmation) {
        setShowRetakeModal(true)
      } else {
        startTest()
      }
    }

    const checkRetakeOrStartSEBTest = () => {
      if (!resume && attempted && !retakeConfirmation) {
        setShowRetakeModal(true)
      } else {
        startSEBTest()
      }
    }

    const { activityReview = true } = data
    let { releaseScore } = data.class.find((item) => item._id === classId) || {}

    if (!releaseScore) {
      releaseScore = data.releaseScore
    }
    const isParentRoleProxy = proxyUserRole === 'parent'
    const isRestrictedTimeWindow = isRestrictedTimeWindowForAssignment(
      startDate,
      serverTimeStamp,
      isPaused,
      data?.attemptWindow?.isRestrictedTimeWindow
    )
    let restrictedButtonTooltip
    let restrictedButtonText
    if (isRestrictedTimeWindow) {
      const {
        startTime = '',
        endTime = '',
        attemptWindowDay,
      } = data?.attemptWindow
      restrictedButtonTooltip = `It can be attempted between ${startTime} to ${endTime} on ${attemptWindowDay} only.`
      restrictedButtonText = ` (UNTIL ${startTime})`
    }

    const StartButtonContainer =
      type === 'assignment' ? (
        !(userRole === 'parent' || isParentRoleProxy) &&
        (safeBrowser &&
        !(new Date(startDate) > new Date(serverTimeStamp) || !startDate) &&
        !isSEB() &&
        !isRestrictedTimeWindow ? (
          <SafeBrowserButton
            data-cy="start"
            btnName={t('common.startAssignment')}
            t={t}
            startTest={checkRetakeOrStartSEBTest}
            attempted={attempted}
            resume={resume}
          />
        ) : (
          <StartButton
            assessment
            data-cy="start"
            safeBrowser={safeBrowser}
            startDate={startDate}
            t={t}
            isPaused={isPaused}
            startTest={checkRetakeOrStart}
            attempted={attempted}
            resume={resume}
            classId={classId}
            serverTimeStamp={serverTimeStamp}
            isTimeWindowRestricted={isRestrictedTimeWindow}
            restrictedButtonText={restrictedButtonText}
            restrictedButtonTooltip={restrictedButtonTooltip}
          />
        ))
      ) : !absent ? (
        <ReviewButton
          data-cy="review"
          testId={testId}
          isPaused={isPaused}
          testActivityId={lastAttempt._id}
          title={test.title}
          activityReview={activityReview}
          t={t}
          attempted={attempted}
          classId={classId}
        />
      ) : null

    const isValidAttempt = attempted

    const onRetakeModalConfirm = () => {
      setShowRetakeModal(false)
      setRetakeConfirmation(true)
      startTest()
    }

    let btnWrapperSize = 24
    if (type !== 'assignment') {
      btnWrapperSize = releaseScore === releaseGradeLabels.DONT_RELEASE ? 18 : 6
    } else if (isValidAttempt) {
      btnWrapperSize = 18
    }

    const ScoreDetail = (
      <>
        <AnswerAndScore xs={6}>
          {releaseScore === releaseGradeLabels.WITH_ANSWERS && (
            <>
              <span data-cy="score">
                {Math.round(score * 100) / 100}/
                {Math.round(maxScore * 100) / 100}
              </span>
              <Title>{t('common.correctAnswer')}</Title>
            </>
          )}
        </AnswerAndScore>
        <AnswerAndScore xs={6}>
          <span data-cy="percent">{Math.round(scorePercentage)}%</span>
          <Title>{t('common.score')}</Title>
        </AnswerAndScore>
      </>
    )

    return (
      <CardWrapper
        data-cy={`test-${data.testId}`}
        highlightMode={highlightMode}
        id={`assignment_${data._id}`}
      >
        <div ref={assignmentCardRef} style={{ display: 'flex', width: '100%' }}>
          {showRetakeModal && (
            <ConfirmationModal
              title="Retake Assignment"
              visible={showRetakeModal}
              destroyOnClose
              onCancel={() => setShowRetakeModal(false)}
              footer={[
                <EduButton isGhost onClick={() => setShowRetakeModal(false)}>
                  Cancel
                </EduButton>,
                <EduButton
                  data-cy="launch-retake"
                  onClick={onRetakeModalConfirm}
                >
                  Launch
                </EduButton>,
              ]}
            >
              <p>
                You are going to attempt the assignment again. Are you sure you
                want to Start?
              </p>
            </ConfirmationModal>
          )}
          <AssessmentDetails
            data-cy={`test-${data.testId}`}
            title={title}
            thumbnail={thumbnail}
            theme={theme}
            testType={testType}
            t={t}
            type={type}
            started={attempted}
            resume={resume}
            dueDate={dueDate || endDate}
            startDate={startDate}
            safeBrowser={safeBrowser}
            graded={graded}
            absent={absent}
            isPaused={isPaused}
            lastAttempt={lastAttempt}
            isDueDate={!!dueDate}
            serverTimeStamp={serverTimeStamp}
            timedAssignment={timedAssignment}
            allowedTime={allowedTime}
            timedTestIconType={theme.assignment.cardTimeIconType}
            setEmbeddedVideoPreviewModal={setEmbeddedVideoPreviewModal}
            studentResources={studentResources}
          />

          <ButtonAndDetail>
            <DetailContainer type={type}>
              <AttemptDetails isValidAttempt={isValidAttempt}>
                {isValidAttempt && (
                  <>
                    <Attempts
                      xs={6}
                      onClick={() => {
                        if (maxAttempts > 1) {
                          toggleAttemptsView()
                        }
                      }}
                    >
                      {maxAttempts > 1 && (
                        <>
                          <span data-cy="attemptsCount">
                            {attemptCount}/{maxAttempts}
                          </span>
                          <AttemptsTitle data-cy="attemptClick">
                            {arrow} &nbsp; &nbsp; {t('common.attemps')}
                          </AttemptsTitle>
                        </>
                      )}
                    </Attempts>
                    {type !== 'assignment' &&
                      releaseScore !== releaseGradeLabels.DONT_RELEASE &&
                      ScoreDetail}
                  </>
                )}
                {StartButtonContainer && (
                  <StyledActionButton
                    isValidAttempt={isValidAttempt}
                    sm={btnWrapperSize}
                  >
                    {StartButtonContainer}
                  </StyledActionButton>
                )}
              </AttemptDetails>
            </DetailContainer>
            {showAttempts &&
              newReports.map((attempt) => (
                <Attempt
                  key={attempt._id}
                  data={attempt}
                  activityReview={activityReview}
                  type={type}
                  releaseScore={releaseScore}
                  releaseGradeLabels={releaseGradeLabels}
                  classId={attempt.groupId}
                  testTitle={title}
                  assignedBy={assignedBy}
                />
              ))}
          </ButtonAndDetail>
        </div>
      </CardWrapper>
    )
  }
)

const enhance = compose(
  withTheme,
  withRouter,
  withNamespaces('assignmentCard'),
  connect(
    (state) => ({
      user: state?.user?.user,
      proxyUserRole: proxyRole(state),
    }),
    {
      startAssignment: startAssignmentAction,
      resumeAssignment: resumeAssignmentAction,
    },
    undefined, // (a, b, c) => ({ ...a, ...b, ...c }), // mergeProps
    { pure: false }
  )
)

export default enhance(AssignmentCard)

AssignmentCard.propTypes = {
  data: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  startAssignment: PropTypes.func.isRequired,
  resumeAssignment: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  highlightMode: PropTypes.bool.isRequired,
}

const CardWrapper = styled(Row)`
  display: flex;
  padding: 24px 0;
  border-bottom: 1px solid #f2f2f2;
  ${({ highlightMode }) => highlightMode && `animation: inHighlight 5s;`};
  &:last-child {
    border-bottom: 0px;
  }
  @keyframes inHighlight {
    0% {
      background-color: white;
    }
    50% {
      background-color: #c9edda;
    }
    100% {
      background-color: white;
    }
  }

  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
    border: 1px solid
      ${(props) =>
        (props.theme.assignment &&
          props.theme.assignment.attemptsReviewRowBgColor) ||
        lightGreySecondary};
    border-radius: 10px;
    margin-top: 20px;
  }
`

const ButtonAndDetail = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 53%;

  @media screen and (min-width: 1025px) {
    margin-left: auto;
  }
  @media (max-width: ${largeDesktopWidth}) {
    width: 55%;
  }
  @media (max-width: ${desktopWidth}) {
    width: 64%;
  }
  @media screen and (max-width: ${tabletWidth}) {
    flex-direction: column;
    width: 100%;
  }
`

const AttemptDetails = styled(Row)`
  width: 62%;
  display: flex;

  ${({ isValidAttempt }) =>
    !isValidAttempt &&
    `
    justify-content: flex-end
  `}

  @media screen and (max-width: ${mobileWidthMax}) {
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }
  @media only screen and (min-width: ${largeDesktopWidth}) {
    flex: 1;
  }
  @media (max-width: ${largeDesktopWidth}) {
    width: 100%;
  }
  @media (max-width: ${mediumDesktopExactWidth}) {
    margin-right: 15px;
  }
`

const AnswerAndScore = styled(Col)`
  display: flex;
  align-items: center;
  flex-direction: column;
  & > span {
    font-size: ${(props) => props.theme.assignment.cardAnswerAndScoreTextSize};
    font-weight: bold;
    color: ${(props) => props.theme.assignment.cardAnswerAndScoreTextColor};
    @media (max-width: ${smallDesktopWidth}) {
      font-size: ${(props) => props.theme.subtitleFontSize};
    }
  }
  @media (max-width: ${mobileWidthMax}) {
    flex: 1;
  }
`

const StyledActionButton = styled(AnswerAndScore)`
  @media screen and (max-width: ${mobileWidthMax}) {
    align-items: center;
  }

  align-items: ${({ isValidAttempt }) =>
    !isValidAttempt ? 'flex-end' : 'center'};
  justify-content: center;
`

const Attempts = AnswerAndScore

const DetailContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: ${(props) => props.type === 'reports' && '25px'};

  @media screen and (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
`

const AttemptsTitle = styled.div`
  font-size: ${(props) => props.theme.assignment.cardAttemptLinkFontSize};
  font-weight: 600;
  color: ${(props) => props.theme.assignment.cardAttemptLinkTextColor};
  cursor: pointer;
  @media (max-width: ${smallDesktopWidth}) {
    font-size: ${(props) => props.theme.smallLinkFontSize};
  }
`

const Title = styled.div`
  font-size: ${(props) => props.theme.assignment.cardResponseBoxLabelsFontSize};
  font-weight: 600;
  color: ${(props) => props.theme.assignment.cardResponseBoxLabelsColor};
  text-align: center;
  @media (max-width: ${smallDesktopWidth}) {
    font-size: ${(props) => props.theme.smallLinkFontSize};
  }
`
