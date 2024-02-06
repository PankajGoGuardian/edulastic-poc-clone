const {
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
  isEmpty,
} = require('lodash')

const {
  roundedPercentage,
  getOverallScore,
  getCsvDataFromTableBE,
  formatName,
} = require('../common')

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| COMMON TRANSFORMERS |-----|-----|-----|----- //

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

const getLeastMasteryLevel = (scaleInfo = []) =>
  orderBy(scaleInfo, 'score', ['desc'])[scaleInfo.length - 1] || {
    masteryLabel: '',
  }

const getOverallMasteryScore = (records) =>
  records.length
    ? round(
        sumBy(
          records,
          (domain) =>
            parseInt(domain.fmSum, 10) / (parseInt(domain.fmCount, 10) || 1)
        ) / records.length,
        2
      )
    : 0

const getMasteryLevel = (score, scaleInfo = []) => {
  for (const obj of scaleInfo) {
    if (round(score) === obj.score) {
      return obj || getLeastMasteryLevel(scaleInfo)
    }
  }
  return getLeastMasteryLevel(scaleInfo)
}

const getRecordMasteryLevel = (records, scaleInfo) => {
  const score = getOverallMasteryScore(records)
  return getMasteryLevel(score, scaleInfo)
}

const getMaxMasteryScore = (scaleInfo = []) => {
  const maxMasteryScore = get(maxBy(scaleInfo, 'score'), 'score', 0)
  return maxMasteryScore
}

const getMasteryLevelOptions = (scaleInfo = []) => {
  const options = [
    { key: 'all', title: 'All' },
    ...map(scaleInfo, (masteryLevel) => ({
      key: masteryLevel.masteryLabel,
      title: masteryLevel.masteryName,
    })),
  ]
  return options
}

const groupedByDomain = (
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
      const rawScore = `${(sumBy(domainData, 'totalScore') || 0).toFixed(
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
        domainName:
          (domainMetaInformation && domainMetaInformation.domain) || '',
        domainDesc:
          (domainMetaInformation && domainMetaInformation.domainName) || '',
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
      return formatName(rowInfo)
  }
}

const getCompareByData = (
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

const getTableData = (
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

const getParsedData = (
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

// -----|-----|-----|-----| COMMON TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| CHART TRANSFORMERS |-----|-----|-----|----- //

const getTicks = (maxScore) => {
  const ticks = []
  for (let i = 0; i <= maxScore; i++) {
    ticks.push(i)
  }
  return ticks
}

// -----|-----|-----|-----| CHART TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| TABLE TRANSFORMERS |-----|-----|-----|----- //

const getOptionFromKey = (options, key) =>
  find(options, (option) => option.key === key) || options[0]

const getScore = (record) =>
  roundedPercentage(record.totalScore, record.maxScore)

const getOverallRawScore = (records) => {
  const maxScoreSum = sumBy(records, 'maxScore')
  const totalScoreSum = sumBy(records, 'totalScore') || 0
  return maxScoreSum ? `${totalScoreSum.toFixed(2)} / ${maxScoreSum}` : 0
}

const getMasteryScore = (record) =>
  round(record.fmSum / parseInt(record.fmCount, 10), 2)

const getMasteryScoreColor = (domain, scaleInfo) =>
  getMasteryLevel(getMasteryScore(domain), scaleInfo).color

const getAnalyseByTitle = (key) => analyseKeys[key] || ''

const getOverallValue = (record = {}, analyseByKey, scaleInfo) => {
  const records = Object.values(record.domainData || {})
  switch (analyseByKey) {
    case 'masteryScore':
      return getOverallMasteryScore(records)
    case 'score':
      return `${round(getOverallScore(records))}%`
    case 'rawScore':
      return getOverallRawScore(records)
    case 'masteryLevel':
      return getRecordMasteryLevel(records, scaleInfo).masteryLabel
    default:
      return analyseByKey
  }
}

const getColValue = (record = {}, domainId, analyseByKey, scaleInfo) => {
  const domain = record.domainData[domainId]
  let colValue = ''
  if (!domain) {
    colValue = 'N/A'
  } else if (analyseByKey === 'masteryScore') {
    colValue = getMasteryScore(domain)
  } else if (analyseByKey === 'score') {
    colValue = `${getScore(domain)}%`
  } else if (analyseByKey === 'rawScore') {
    colValue = `${(domain.totalScore || 0).toFixed(2)} / ${domain.maxScore}`
  } else if (analyseByKey === 'masteryLevel') {
    colValue = getMasteryLevel(getMasteryScore(domain), scaleInfo).masteryLabel
  }
  return colValue
}

// -----|-----|-----|-----| TABLE TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

// -----|-----|-----|-----| BACKEND SPECIFIC TRANSFORMERS |-----|-----|-----|----- //

const getColumnsBE = (compareBy, analyseByKey, domains, scaleInfo) => {
  const domainCols = domains.map((domain) => ({
    title: `${domain.domainName} - ${domain[analyseByKey]}${
      analyseByKey == 'score' ? '%' : ''
    }`,
    dataIndex: domain.domainName,
    key: domain.domainName,
    render: (_, record) =>
      getColValue(record, domain.domainId, analyseByKey, scaleInfo),
  }))

  const cols = [
    {
      title: compareBy.title,
      dataIndex: 'name',
      key: 'name',
      render: (data) =>
        compareBy.title === 'Student'
          ? data || 'Anonymous'
          : compareBy.key === 'school' &&
            (isEmpty(data) || data === 'undefined')
          ? '-'
          : data,
    },
    {
      title: 'Avg. Domain Performance',
      dataIndex: 'overall',
      key: 'overall',
      render: (_, record) => getOverallValue(record, analyseByKey, scaleInfo),
    },
    ...domainCols,
    {
      title: 'SIS ID',
      dataIndex: 'sisId',
      key: 'sisId',
      visibleOn: ['csv'],
      render: (_, record) => record.rowInfo.sisId || '',
    },
  ]

  return cols
}

const populateBackendCSV = ({ result, tableFilters }) => {
  const selectedScale = get(result, 'scaleInfo.scale', {})
  const maxMasteryScore = getMaxMasteryScore(selectedScale)
  const selectedDomains = []

  const { domainsData, tableData } = getParsedData(
    result.metricInfo,
    result.studInfo,
    maxMasteryScore,
    tableFilters,
    selectedDomains,
    result.skillInfo,
    result.groupInfo,
    selectedScale
  )

  const tableColumns = getColumnsBE(
    tableFilters.compareBy,
    tableFilters.analyseBy.key,
    domainsData,
    selectedScale
  )

  return getCsvDataFromTableBE(tableData, tableColumns)
}

// -----|-----|-----|-----| BACKEND SPECIFIC TRANSFORMERS |-----|-----|-----|----- //

// =====|=====|=====|=====| =============== |=====|=====|=====|===== //

module.exports = {
  // common transformers
  getMasteryLevel,
  getMasteryLevelOptions,
  getMaxMasteryScore,
  getOverallMasteryScore,
  getParsedData,
  getScore,
  getOverallRawScore,
  // chart transformers
  getTicks,
  // table transformers
  getOptionFromKey,
  getMasteryScoreColor,
  getAnalyseByTitle,
  getOverallValue,
  getRecordMasteryLevel,
  getColValue,
  // backend transformers
  populateBackendCSV,
}
