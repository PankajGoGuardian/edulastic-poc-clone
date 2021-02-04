import {
  groupBy,
  sumBy,
  round,
  get,
  maxBy,
  find,
  map,
  orderBy,
  includes,
  filter,
} from 'lodash'
import { roundedPercentage } from '../../../../common/util'

const analyseKeys = {
  masteryScore: 'Mastery Score',
  score: 'Avg.Score(%)',
  rawScore: 'Avg.Score',
  masteryLevel: 'Mastery Level',
}

const getCompareByKey = (compareBy) => {
  switch (compareBy.toLowerCase()) {
    case 'school':
      return 'schoolId'
    case 'teacher':
      return 'teacherId'
    case 'class':
      return 'groupId'
    case 'group':
      return 'groupId'
    case 'student':
      return 'studentId'
    default:
      return ''
  }
}

export const getTicks = (maxScore) => {
  const ticks = []

  for (let i = 0; i <= maxScore; i++) {
    ticks.push(i)
  }

  return ticks
}

export const getLeastMasteryLevel = (scaleInfo = []) =>
  orderBy(scaleInfo, 'score', ['desc'])[scaleInfo.length - 1] || {
    masteryLabel: '',
  }

export const getOverallMasteryScore = (records) =>
  records.length
    ? (
        sumBy(records, 'fmSum') /
        sumBy(records, (domain) => parseInt(domain.fmCount, 10))
      ).toFixed(2)
    : 0

export const getMasteryLevel = (score, scaleInfo = []) => {
  for (const obj of scaleInfo) {
    if (round(score) === obj.score) {
      return obj || getLeastMasteryLevel(scaleInfo)
    }
  }

  return getLeastMasteryLevel(scaleInfo)
}

export const getRecordMasteryLevel = (records, scaleInfo) => {
  const score = getOverallMasteryScore(records)
  return getMasteryLevel(score, scaleInfo)
}

export const getOptionFromKey = (options, key) =>
  find(options, (option) => option.key === key) || options[0]

export const getMaxMasteryScore = (scaleInfo = []) => {
  const maxMasteryScore = get(maxBy(scaleInfo, 'score'), 'score', 0)
  return maxMasteryScore
}

export const getMasteryLevelOptions = (scaleInfo = []) => {
  const options = [
    { key: 'all', title: 'All' },
    ...map(scaleInfo, (masteryLevel) => ({
      key: masteryLevel.masteryLabel,
      title: masteryLevel.masteryName,
    })),
  ]
  return options
}

export const groupedByDomain = (
  metricInfo = [],
  maxScore,
  scaleInfo = [],
  selectedDomains,
  skillInfo = []
) => {
  const domains = groupBy(metricInfo, 'domainId')
  return Object.keys(domains)
    .map((domainId) => {
      const domainData = domains[domainId]

      const masteryScore = getOverallMasteryScore(domainData)
      const score = round(
        (sumBy(domainData, 'totalScore') / sumBy(domainData, 'maxScore')) * 100
      )
      const rawScore = `${sumBy(domainData, 'totalScore')?.toFixed(
        2
      )} / ${sumBy(domainData, 'maxScore')}`
      const masteryLevel = getRecordMasteryLevel(domainData, scaleInfo)
        .masteryLabel
      const domainMetaInformation = find(
        skillInfo,
        (standard) => `${standard.domainId}` === `${domainId}`
      )

      return {
        domainId,
        domainName: domainMetaInformation?.domain || '',
        masteryScore,
        diffMasteryScore: maxScore - round(masteryScore, 2),
        score,
        rawScore,
        masteryLevel,
        records: domainData,
        fill:
          includes(selectedDomains, domainId) || !selectedDomains.length
            ? getMasteryLevel(masteryScore, scaleInfo).color
            : '#cccccc',
      }
    })
    .sort((a, b) => a.domainName.localeCompare(b.domainName))
}

// Table data utils
const getFormattedName = (name) => {
  const nameArr = (name || '').trim().split(' ')
  const lName = nameArr.splice(nameArr.length - 1)[0]
  return nameArr.length ? `${lName}, ${nameArr.join(' ')}` : lName
}

const getRowInfo = (groupInfo, studInfo, compareByKey, value) => {
  switch (compareByKey) {
    case 'teacherId':
    case 'schoolId':
      return find(groupInfo, (org) => org[compareByKey] === value)
    case 'classId':
    case 'groupId':
      return find(groupInfo, (org) => org[compareByKey] === value)
    case 'studentId':
    default:
      return find(studInfo, (student) => student.studentId === value)
  }
}

const getRowName = (compareByKey, rowInfo = {}) => {
  switch (compareByKey) {
    case 'teacherId':
      return `${rowInfo.teacherName}`
    case 'schoolId':
      return `${rowInfo.schoolName}`
    case 'classId':
    case 'groupId':
      return `${rowInfo.className}`
    case 'studentId':
    default:
      return getFormattedName(
        `${rowInfo.firstName || ''} ${rowInfo.lastName || ''}`
      )
  }
}

export const getCompareByData = (
  metricInfo = [],
  studInfo = [],
  groupInfo = [],
  compareBy
) => {
  const compareByKey = getCompareByKey(compareBy)

  if (!compareByKey) {
    return []
  }

  const compareByData = groupBy(metricInfo, compareByKey)

  return Object.keys(compareByData).map((itemId) => {
    const records = compareByData[itemId]
    const domainData = {}
    records.forEach((domain) => {
      domainData[domain.domainId] = domain
    })
    const rowInfo = getRowInfo(groupInfo, studInfo, compareByKey, itemId) || {}
    return {
      id: itemId,
      name: getRowName(compareByKey, rowInfo) || '',
      domainData,
      records,
      rowInfo,
    }
  })
}

export const getTableData = (
  metricInfo = [],
  studInfo = [],
  groupInfo,
  scaleInfo = [],
  appliedFilters
) => {
  const compareByData = getCompareByData(
    metricInfo,
    studInfo,
    groupInfo,
    appliedFilters.compareBy.key
  )
  let filteredData = compareByData

  if (
    appliedFilters.masteryLevel.key &&
    appliedFilters.masteryLevel.key !== 'all'
  ) {
    filteredData = filter(
      compareByData,
      (item) =>
        getRecordMasteryLevel(item.records, scaleInfo).masteryLabel ===
        appliedFilters.masteryLevel.key
    )
  }

  return filteredData.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  )
}

// Table column related utils
export const getScore = (record) =>
  roundedPercentage(record.totalScore, record.maxScore)
export const getOverallScore = (records) =>
  roundedPercentage(sumBy(records, 'totalScore'), sumBy(records, 'maxScore'))
export const getOverallRawScore = (records) => {
  const maxScoreSum = sumBy(records, 'maxScore')
  const totalScoreSum = sumBy(records, 'totalScore') || 0
  return maxScoreSum ? `${totalScoreSum.toFixed(2)} / ${maxScoreSum}` : 0
}
export const getMasteryScore = (record) =>
  round(record.fmSum / parseInt(record.fmCount, 10), 2)
export const getMasteryScoreColor = (domain, scaleInfo) =>
  getMasteryLevel(getMasteryScore(domain), scaleInfo).color
export const getAnalyseByTitle = (key) => analyseKeys[key] || ''

export const getOverallValue = (record = {}, analyseByKey, scaleInfo) => {
  switch (analyseByKey) {
    case 'masteryScore':
      return getOverallMasteryScore(record.records)
    case 'score':
      return `${getOverallScore(record.records)}%`
    case 'rawScore':
      return getOverallRawScore(record.records)
    case 'masteryLevel':
      return getRecordMasteryLevel(record.records, scaleInfo).masteryLabel
    default:
      return analyseByKey
  }
}

export const getParsedData = (
  metricInfo,
  studInfo,
  maxMasteryScore,
  tableFilters,
  selectedDomains,
  skillInfo,
  groupInfo = [],
  scaleInfo = []
) => {
  return {
    domainsData: groupedByDomain(
      metricInfo,
      maxMasteryScore,
      scaleInfo,
      selectedDomains,
      skillInfo
    ),
    tableData: getTableData(
      metricInfo,
      studInfo,
      groupInfo,
      scaleInfo,
      tableFilters
    ),
  }
}
