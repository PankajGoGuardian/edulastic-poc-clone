import React from 'react'
import { flatMap, groupBy, isEmpty } from 'lodash'
import { IconTutorMeAssigned } from '@edulastic/icons'
import { black } from '@edulastic/colors'
import {
  EMPTY_ARRAY,
  formatDate,
} from '@edulastic/constants/reportUtils/common'
import { Row, Tooltip } from 'antd'
import { getTestColumn } from '../../multipleAssessmentReport/common/components/trend/TrendTable'
import { StyledText } from '../../dataWarehouseReports/common/components/styledComponents'
import { StyledContainer } from '../../dataWarehouseReports/Dashboard/components/common/styledComponents'

export const MAX_TAG_WIDTH = 133

/**
 * Function to update tags count for filter dynamically based on no. of tests selected.
 * @param {Object} filterRef element ref
 * @param {Array} selected array of selected tests
 * @param {Function} setCount function to update max tags count for filter
 */
export function updateFilterTagsCount(filterRef, selected, setCount) {
  const renderFilters = filterRef.current
  if (renderFilters) {
    const testsFilterTagsContainer = renderFilters.querySelector(
      '.student-standards-progress-tests-filter .ant-select-selection__rendered'
    )
    const tagsContainerBox = testsFilterTagsContainer.getBoundingClientRect()
    let tagsCount = 0
    for (let i = 0; i < selected.length; i++) {
      const tagRight = tagsContainerBox.left + (i + 1) * MAX_TAG_WIDTH
      if (tagRight < tagsContainerBox.right) {
        tagsCount += 1
      } else {
        // setting to one less to account for tag margins
        setCount(tagsCount - 1)
        break
      }
    }
  }
}

export function transformInterventions(interventionData) {
  if (isEmpty(interventionData?.[0])) return {}
  const { interventionCriteria, tutorMeSessions } = interventionData[0]
  const groupedStandardMasteryDetails = groupBy(
    interventionCriteria.standardMasteryDetails,
    'domainId'
  )
  const standardDetails = Object.keys(groupedStandardMasteryDetails).map(
    (key) => {
      const records = groupedStandardMasteryDetails[key]
      const standards = records.map(
        ({ standardIdentifier }) => standardIdentifier
      )
      return { domainDesc: records[0].domainDesc, standards }
    }
  )
  return {
    standardDetails,
    tutorMeSessions,
    totalSessions: tutorMeSessions.length,
  }
}

function getTutorMeSessionBetweenAssessments({
  tutorMeSessions,
  prevAssessmentDate,
  nextAssessmentDate,
}) {
  return tutorMeSessions.filter(({ sessionCompleteTime }) => {
    const checkForPrevDate = prevAssessmentDate
      ? sessionCompleteTime >= prevAssessmentDate
      : sessionCompleteTime < nextAssessmentDate
    !prevAssessmentDate || sessionCompleteTime >= nextAssessmentDate
    const checkForNextDate = nextAssessmentDate
      ? sessionCompleteTime < nextAssessmentDate
      : sessionCompleteTime > prevAssessmentDate
    return checkForPrevDate && checkForNextDate
  })
}

function getTooltipText(tutorMeSessions, standardDetails) {
  if (!tutorMeSessions.length) return null
  return (
    <StyledContainer>
      <div>
        {standardDetails.map(({ domainDesc, standards }) => {
          const standardsText = standards.join(', ')
          const rowText = `${domainDesc}: ${standardsText}`
          return <Row>{rowText}</Row>
        })}
      </div>
      <div style={{ marginTop: '12px' }}>
        {tutorMeSessions.map((session, index) => {
          return (
            <Row>{`Session ${index + 1}: ${formatDate(
              session.sessionCompleteTime
            )}`}</Row>
          )
        })}
      </div>
    </StyledContainer>
  )
}

function TutorMeColumnTitle({ sessionText, tooltipText }) {
  return (
    <Tooltip placement="bottom" title={tooltipText}>
      <div>
        <IconTutorMeAssigned />
        <StyledText fontSize="16px" color={black}>
          {sessionText}
        </StyledText>
        <StyledText fontSize="12px" textTransform="capitalize">
          Sessions
        </StyledText>
      </div>
    </Tooltip>
  )
}

function getTutorMeColumn(tutorMeSessions, totalSessions, standardDetails) {
  const sessionText = `${tutorMeSessions.length}/${totalSessions}`
  const tooltipText = getTooltipText(tutorMeSessions, standardDetails)
  return {
    dataIndex: '',
    width: 80,
    className: 'tutorme-column',
    title: (
      <TutorMeColumnTitle sessionText={sessionText} tooltipText={tooltipText} />
    ),
  }
}

export function getDynamicColumns({
  rawMetric,
  analyseBy,
  compareBy,
  toolTipContent,
  isCellClickable,
  location,
  pageTitle,
  masteryScale,
  interventionData,
}) {
  if (isEmpty(rawMetric)) return []
  const sortedrawMetric = [...rawMetric].sort(
    (a, b) => a.assessmentDate - b.assessmentDate
  )
  const groupedAvailableTests = groupBy(sortedrawMetric, 'testId')
  const availableTestIds = Object.keys(groupedAvailableTests)
  const dynamicColumns = flatMap(availableTestIds, (testId, index) => {
    const { assessmentDate, testName = 'N/A', isIncomplete = false } =
      groupedAvailableTests[testId].reduce((ele, res) =>
        ele.assessmentDate > res.assessmentDate ? ele : res
      ) || {}

    const testColumn = getTestColumn({
      location,
      testId,
      isIncomplete,
      testName,
      assessmentDate,
      analyseBy,
      compareBy,
      masteryScale,
      pageTitle,
      isCellClickable,
      toolTipContent,
    })

    let columns = [testColumn]

    const {
      standardDetails,
      tutorMeSessions = EMPTY_ARRAY,
      totalSessions,
    } = interventionData

    // add tutorMe column before first assignment if sessions are present
    if (index === 0) {
      const tutorMeSessionsBeforeAssessments = getTutorMeSessionBetweenAssessments(
        {
          tutorMeSessions,
          prevAssessmentDate: null,
          nextAssessmentDate: assessmentDate,
        }
      )
      if (!isEmpty(tutorMeSessionsBeforeAssessments)) {
        const tutorMeColumn = getTutorMeColumn(
          tutorMeSessionsBeforeAssessments,
          totalSessions,
          standardDetails
        )
        columns = [tutorMeColumn, testColumn]
      }
    }

    // calculate nextAssessment date if not the last assessment
    let nextAssessmentDate = null
    const isLastAssessment = index === availableTestIds.length - 1
    if (!isLastAssessment) {
      const nextTestId = availableTestIds[index + 1]
      const { assessmentDate: _nextAssessmentDate } =
        groupedAvailableTests[nextTestId].reduce((ele, res) =>
          ele.assessmentDate > res.assessmentDate ? ele : res
        ) || {}
      nextAssessmentDate = _nextAssessmentDate
    }

    // add tutorMe column after current column if sessions are present
    const tutorMeSessionsBetweenAssessments = getTutorMeSessionBetweenAssessments(
      {
        tutorMeSessions,
        prevAssessmentDate: assessmentDate,
        nextAssessmentDate,
      }
    )
    if (!isEmpty(tutorMeSessionsBetweenAssessments)) {
      const tutorMeColumn = getTutorMeColumn(
        tutorMeSessionsBetweenAssessments,
        totalSessions,
        standardDetails
      )
      columns.push(tutorMeColumn)
    }

    return columns
  })
  return dynamicColumns
}
