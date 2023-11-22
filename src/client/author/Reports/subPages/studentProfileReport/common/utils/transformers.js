import {
  groupBy,
  map,
  reduce,
  values,
  round,
  sumBy,
  orderBy,
  filter,
  keys,
  uniqBy,
  isEmpty,
} from 'lodash'
import { formatName } from '@edulastic/constants/reportUtils/common'
import { getAllTestTypesMap } from '../../../../../../common/utils/testTypeUtils'
import { percentage, getProficiencyBand } from '../../../../common/util'

export const getFullName = (s) => formatName(s, { lastNameFirst: false })

export const getStudentName = (selectedStudent, studInfo) => {
  if (selectedStudent.title) {
    return selectedStudent.title
  }
  return getFullName(studInfo)
}

export const getTermOptions = (terms = []) =>
  map(terms, (term) => ({
    title: term.name,
    key: term._id,
  }))

export const augementAssessmentChartData = (
  metricInfo = [],
  bandInfo = [],
  studentClassData = []
) => {
  if (!metricInfo.length) {
    return []
  }

  const groupedByTest = groupBy(metricInfo, 'testId')

  const groupedTestsByType = reduce(
    groupedByTest,
    (data, value) => {
      const groupedByType = groupBy(value, 'testType')
      return data.concat(values(groupedByType))
    },
    []
  )

  const parsedData = map(groupedTestsByType, (assignments) => {
    const assignment = assignments[0] || {}
    const { testType, testId } = assignment
    const scoreAvg = round(
      percentage(
        sumBy(assignments, 'score') || 0,
        sumBy(assignments, 'maxScore') || 0
      )
    )
    const band = getProficiencyBand(scoreAvg, bandInfo)
    const { standardSet, subject } =
      studentClassData.find((s) => s.studentId === assignment.studentId) || {}
    const testTypes = getAllTestTypesMap()

    return {
      ...assignment,
      score: scoreAvg,
      uniqId: testId + testType,
      testType: testTypes[testType.toLowerCase()],
      diffScore: 100 - scoreAvg,
      band,
      assignments,
      standardSet,
      subject,
    }
  })

  return parsedData
}

export const getMaxScale = (scaleInfo = []) =>
  orderBy(scaleInfo, 'thresold', ['desc'])[0] || {}

export const getScaleForMasteryCalculation = (scaleInfo = []) => {
  let scales = scaleInfo.filter((scale) => scale.domainMastery)
  if (isEmpty(scales)) {
    scales = orderBy(scaleInfo, 'thresold', ['desc']).splice(0, 2)
  }
  return scales
}

export const getOverallDomainMasteryPercentage = (records, scales) => {
  const masteryNames = scales.map(({ masteryName }) => masteryName)
  const masteredStandards = filter(records, (record) =>
    masteryNames.includes(record.scale.masteryName)
  )
  return percentage(masteredStandards.length, records.length)
}

export const getMasterySummary = (masteryScore, scaleInfo) => {
  let flag = true
  const masterySummary = {
    masteryScore,
    masteryName: '',
    color: '',
  }
  scaleInfo.forEach((scale) => {
    if (flag && masteryScore >= scale.threshold) {
      flag = false
      masterySummary.masteryName = scale.masteryName
      masterySummary.color = scale.color
    }
  })
  return masterySummary
}

export const getOverallMasteryCount = (records, maxScale) => {
  const masteredStandards = filter(
    records,
    (record) => record.scale.masteryName === maxScale.masteryName
  )
  return masteredStandards.length
}

export const getStudentPerformancePieData = (metricInfo = []) => {
  const groupedByMastery = groupBy(
    metricInfo,
    (metric) => metric.scale.masteryLabel
  )
  const pieData = map(groupedByMastery, (records, masteryLabel) => {
    const { masteryName = '', color = '' } = records[0].scale
    return {
      percentage: round(percentage(records.length, metricInfo.length)),
      count: records.length,
      totalCount: metricInfo.length,
      masteryLabel,
      masteryName,
      color,
    }
  })
  return pieData
}

export const augmentStandardMetaInfo = (
  standards = [],
  skillInfo = [],
  scaleInfo
) => {
  const groupedSkillsByStandard = groupBy(skillInfo, 'standardId')

  const standardsWithInfo = map(standards, (standard) => {
    const currentStandardRecords =
      groupedSkillsByStandard[standard.standardId] || []
    if (currentStandardRecords[0]) {
      const rawScore = standard.totalScore || 0
      const percentScore = percentage(rawScore, standard.maxScore)
      const scale = getProficiencyBand(percentScore, scaleInfo)

      return {
        ...standard,
        ...currentStandardRecords[0],
        masteryName: scale.masteryName,
        totalScore: round(rawScore, 2),
        score: round(percentScore),
        scoreFormatted: `${round(percentScore)}%`,
        assessmentCount: 0,
        totalQuestions: 0,
        scale,
        key: standard.standardId,
      }
    }
    return null
  }).filter((standard) => standard)

  // returning data in the ascending order of domain and standard.
  return orderBy(standardsWithInfo, ['domain', 'standard'], ['asc', 'asc'])
}

export const getDomains = (
  metricInfo = [],
  scaleInfo = [],
  studentClassInfo = {},
  asessmentMetricInfo = []
) => {
  if (!metricInfo.length) {
    return []
  }

  const groupedByDomain = groupBy(metricInfo, 'domainId')
  const scales = getScaleForMasteryCalculation(scaleInfo)
  const domains = map(keys(groupedByDomain), (domainId) => {
    const standards = groupedByDomain[domainId]
    const {
      domainName = '',
      domain = '',
      grades = [],
      subject,
      curriculumName,
      curriculumId,
    } = standards[0] || {}
    const masteryScore = getOverallDomainMasteryPercentage(standards, scales)
    const masterySummary = getMasterySummary(masteryScore, scaleInfo)

    return {
      domainId,
      standards,
      grades,
      masteryScore,
      masterySummary,
      name: domain,
      description: domainName,
      subject,
      standardSet: studentClassInfo?.standardSet,
      assessmentCount: asessmentMetricInfo?.length || 0,
      curriculumName,
      curriculumId,
      key: domainId,
    }
  })

  return domains
}

export const getDomainOptions = (skillInfo = [], curriculumId = 'All') => [
  ...uniqBy(
    skillInfo.filter(
      (x) => `${x.curriculumId}` === `${curriculumId}` || curriculumId === 'All'
    ),
    'domainId'
  ).map((x) => ({
    key: `${x.domainId}`,
    title: x.domain,
  })),
]

export const getStandardOptions = (
  skillInfo = [],
  domainId = 'All',
  curriculumId = 'All'
) => {
  const selectedDomains = domainId.split(',')
  return [
    ...uniqBy(
      skillInfo.filter(
        (x) =>
          (selectedDomains.includes(`${x.domainId}`) ||
            domainId === 'All' ||
            domainId === '') &&
          (`${x.curriculumId}` === `${curriculumId}` || curriculumId === 'All')
      ),
      'standardId'
    ).map((x) => ({
      key: `${x.standardId}`,
      title: x.standard,
    })),
  ]
}

export const getDomainOptionsByGradeSubject = (
  domains,
  grade,
  subject,
  curriculumId
) => {
  return [
    { key: 'All', title: 'All' },
    ...domains
      .filter(
        (domain) =>
          (grade === 'All' || domain.grades.includes(grade)) &&
          (subject === 'All' || domain.subject === subject) &&
          (curriculumId === 'All' || `${domain.curriculumId}` === curriculumId)
      )
      .map((domain) => ({
        key: domain.domainId,
        title: domain.name,
      })),
  ]
}

export const getCurriculumsList = (interestedCurriculums, includeAllOption) => {
  const curriculums = includeAllOption
    ? [{ key: 'All', title: 'All Standard Sets' }]
    : []
  if (interestedCurriculums?.length) {
    interestedCurriculums.forEach((item) => {
      curriculums.push({
        key: `${item._id}`,
        title: item.name,
      })
    })
  }
  return curriculums
}
