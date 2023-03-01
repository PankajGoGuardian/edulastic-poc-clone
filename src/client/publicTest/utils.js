import React from 'react'
import { maxBy } from 'lodash'
import {
  notification,
  FlexContainer,
  MathFormulaDisplay,
} from '@edulastic/common'
import { test as testConstants, testActivityStatus } from '@edulastic/constants'

import { Select, Modal, Tooltip } from 'antd'
import { themeColor } from '@edulastic/colors'
import { IconSelectCaretDown } from '@edulastic/icons'

const { Option } = Select

const { languageCodes, releaseGradeLabels } = testConstants

const ARCHIVED_TEST_MSG =
  'You can no longer use this as sharing access has been revoked by author'

// this is to format assignment, to included different state like, resume/absent/startDate/endDate etc
export const formatAssignment = (assignment) => {
  let {
    endDate,
    startDate,
    open = false,
    close = false,
    isPaused = false,
    maxAttempts = 1,
  } = assignment
  const { reports = [], class: clazz = [], classId } = assignment
  const currentClassList = clazz.filter((cl) => cl._id === classId)

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
    isPaused = maxCurrentClass.isPaused
  }
  if (!startDate && open) {
    const maxCurrentClass =
      currentClassList && currentClassList.length > 0
        ? maxBy(currentClassList, 'openDate') ||
          currentClassList[currentClassList.length - 1]
        : {}
    startDate = maxCurrentClass.openDate
    isPaused = maxCurrentClass.isPaused
  }
  if (!endDate && close) {
    endDate = (currentClassList && currentClassList.length > 0
      ? maxBy(currentClassList, 'closedDate') ||
        currentClassList[currentClassList.length - 1]
      : {}
    ).closedDate
  }
  const lastAttempt =
    maxBy(reports, (o) => parseInt(o.startDate, 10) || 0) || {}
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
  const attempted = !!(newReports && newReports.length)
  const attemptCount = newReports && newReports.length
  // To handle regrade reduce max attempt settings.
  // eslint-disable-next-line no-restricted-globals
  if (maxAttempts < reports.length && !isNaN(maxAttempts)) {
    maxAttempts = reports.length
  }

  let { releaseScore } = clazz.find((item) => item._id === classId) || {}

  if (!releaseScore) {
    releaseScore = assignment.releaseScore
  }

  return {
    ...assignment,
    startDate,
    endDate,
    open,
    close,
    isPaused,
    absent,
    graded,
    attempted,
    attemptCount,
    maxAttempts,
    lastAttempt,
    resume,
    releaseScore,
  }
}

export const redirectToDashbord = (type = '', history) => {
  let msg
  switch (type) {
    case 'EXPIRED':
      msg = 'The due date for this assignment has passed'
      break
    case 'ARCHIVED':
      msg = ARCHIVED_TEST_MSG
      break
    case 'HOME':
      msg = 'Redirecting to the student dashboard'
      break
    case 'NOT_FOUND':
      msg = 'This assignment is not available'
      break
    default:
      msg = 'This assignment is not available'
  }
  notification({ msg })
  history.push('/home/assignments')
}

export const showTestInfoModal = ({
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
  safeBrowser = false,
  notifyCancel,
  closeTestPreviewModal,
  preview,
}) => {
  let selectedLang = ''
  const handlChange = (value) => {
    setSelectedLanguage(value)
    selectedLang = value
  }

  const timedContent = pauseAllowed ? (
    <p style={{ margin: '10px 0' }}>
      {' '}
      This is a timed assignment which should be finished within the time limit
      set for this assignment. The time limit for this assignment is{' '}
      <span data-cy="test-time" style={{ fontWeight: 700 }}>
        {' '}
        {allowedTime / (60 * 1000)} minutes
      </span>
      . Do you want to continue?
    </p>
  ) : (
    <p style={{ margin: '10px 0' }}>
      {' '}
      This is a timed assignment which should be finished within the time limit
      set for this assignment. The time limit for this assignment is{' '}
      <span data-cy="test-time" style={{ fontWeight: 700 }}>
        {' '}
        {allowedTime / (60 * 1000)} minutes
      </span>{' '}
      and you can’t quit in between. Do you want to continue?
    </p>
  )

  const content = (
    <FlexContainer flexDirection="column">
      {multiLanguageEnabled && (
        <>
          <p>
            This test is offered in multiple languages. Please select your
            preferred language. You can change the preferred language anytime
            during the attempt
          </p>
          <p style={{ marginTop: '10px' }}>PREFERRED LANGUAGE</p>
          <p data-cy="selectLang">
            <Select
              getPopupContainer={(e) => e.parentElement}
              defaultValue={languagePreference || ''}
              style={{ width: 200 }}
              onChange={handlChange}
              suffixIcon={<IconSelectCaretDown color={themeColor} />}
            >
              <Option value="" disabled>
                Select Language
              </Option>
              <Option value={languageCodes.ENGLISH}>English</Option>
              <Option value={languageCodes.SPANISH}>Spanish</Option>
            </Select>
          </p>
        </>
      )}
      {timedAssignment && (
        <div>
          <p style={{ marginTop: '10px' }}>TIME LIMIT</p>
          <p>{timedContent}</p>
        </div>
      )}
      {hasInstruction && instruction && (
        <p>
          <MathFormulaDisplay
            dangerouslySetInnerHTML={{ __html: instruction }}
          />
        </p>
      )}
    </FlexContainer>
  )

  Modal.confirm({
    title: (
      <Tooltip title={title}>
        <div
          style={{
            maxWidth: '80%',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
      </Tooltip>
    ),
    content,
    onOk: () => {
      if (attemptCount < maxAttempts)
        startAssignment({
          testId,
          assignmentId,
          testType,
          classId,
          selectedLang,
          safeBrowser,
        })
      if (!preview) Modal.destroyAll()
      if (preview && multiLanguageEnabled) {
        return !selectedLang
      }
    },
    onCancel: () => {
      setSelectedLanguage('')
      if (notifyCancel) redirectToDashbord('HOME', history)
      else Modal.destroyAll()
      if (preview) {
        closeTestPreviewModal()
      }
    },
    okText: 'YES, CONTINUE',
    cancelText: 'NO, CANCEL',
    className: 'ant-modal-confirm-custom-styled',
    centered: true,
    maskClosable: !preview,
    icon: '',
  })
  return null
}

// case: check to where to navigate
const redirectToAssessmentPlayer = (
  assignment,
  history,
  startAssignment,
  resumeAssignment,
  languagePreference,
  setSelectedLanguage
) => {
  const {
    endDate,
    testId,
    _id: assignmentId,
    testType,
    timedAssignment,
    pauseAllowed,
    allowedTime,
    classId,
    resume,
    attemptCount,
    lastAttempt,
    graded,
    title,
    releaseScore,
    absent,
    multiLanguageEnabled,
    hasInstruction,
    instruction,
  } = assignment
  // if assignment is graded, then redirected to assignment review page
  const activeAssignments = assignment.class.filter(
    (item) => item._id === classId && item.status !== 'ARCHIVED'
  )
  const { maxAttempts = 1 } =
    maxBy(activeAssignments, 'maxAttempts') || assignment
  let isExpired = true
  if (activeAssignments.length) {
    const currentTime = assignment.ts
    isExpired = activeAssignments.every(
      (item) => currentTime > item.endDate || item.closed
    )
  }
  if ((graded || absent) && (isExpired || attemptCount === maxAttempts)) {
    if (releaseScore === releaseGradeLabels.DONT_RELEASE || absent) {
      notification({ msg: 'The due date for this assignment has passed' })
      return history.push({
        pathname: '/home/grades',
        state: { highlightAssignment: assignmentId },
      })
    }
    return history.push({
      pathname: `/home/class/${classId}/test/${testId}/testActivityReport/${lastAttempt._id}`,
      testActivityId: lastAttempt._id,
      title,
    })
  }
  // if end date is crossed, then redirect to student dashboard
  if (endDate < assignment.ts) {
    return redirectToDashbord('EXPIRED', history)
  }

  // show confirmation modal popup
  // case assignment is not started yet and is timed assignment, then modal popup with appropriate content
  // on proceed, redirect to assessment player
  // on cancel redirect to student dashboard
  if (!resume && (timedAssignment || hasInstruction || multiLanguageEnabled)) {
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
      notifyCancel: true,
    })
  }

  // case assigment is resumed, then redirect to assessment player with resumed state
  // case assignment is not resumed, then start assignment from fresh
  if (resume) {
    resumeAssignment({
      testId,
      testType,
      assignmentId,
      testActivityId: lastAttempt._id,
      classId,
    })
  } else if (
    attemptCount < maxAttempts ||
    lastAttempt.status === testActivityStatus.NOT_STARTED
  ) {
    startAssignment({ testId, assignmentId, testType, classId })
  }
}

export const redirectToStudentPage = (
  assignments,
  history,
  startAssignment,
  resumeAssignment,
  test,
  languagePreference,
  setSelectedLanguage
) => {
  const formatedAssignments = assignments.map((assignment) =>
    formatAssignment(assignment)
  )
  // filter assignments open to start/resume
  const filteredAssignments = formatedAssignments.filter(
    (a) => !(new Date(a.startDate) > new Date() || !a.startDate || a.isPaused)
  )

  if (filteredAssignments.length > 0) {
    // filter ungraded assignments
    const ungradedAssignments = filteredAssignments.filter((a) => !a.graded)
    let assignment = maxBy(filteredAssignments, 'createdAt')
    if (ungradedAssignments.length) {
      assignment = maxBy(ungradedAssignments, 'createdAt')
    }
    redirectToAssessmentPlayer(
      assignment,
      history,
      startAssignment,
      resumeAssignment,
      languagePreference,
      setSelectedLanguage
    )
  } else {
    // if test is archieved/ in draft,
    // then check for assignments. if not assignment then redirect to student dashbord else navigate to student attempt page
    const isTestInDraft = test?.status === testConstants.statusConstants.DRAFT
    const isTestArchieved =
      test?.status === testConstants.statusConstants.ARCHIVED
    let msgType = ''
    if (isTestArchieved) {
      msgType = 'ARCHIVED'
    } else if (isTestInDraft) {
      msgType = 'NOT_FOUND'
    }
    redirectToDashbord(msgType, history)
  }
}

export const activeAssignmentClassIdentifiers = (assignmentsObj) => {
  const assignments = assignmentsObj && Object.values(assignmentsObj)
  if (!assignments.length) {
    return {}
  }
  const classIdentifiers = {}
  assignments.forEach((item) => {
    item.class.forEach((c) => {
      classIdentifiers[c.identifier] = true
    })
  })
  return classIdentifiers
}
