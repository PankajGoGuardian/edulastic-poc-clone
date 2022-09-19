import {
  get,
  isEmpty,
  groupBy,
  keyBy,
  uniq,
  sumBy,
  round,
  orderBy,
} from 'lodash'

import { reportUtils } from '@edulastic/constants'

const {
  getOverallScore,
  DemographicCompareByOptions,
  getFormattedName,
} = reportUtils.common

const {
  getMasteryLevel,
  getScore,
  getOverallRawScore,
} = reportUtils.standardsPerformanceSummary

const getCompareByDataKey = (compareByKey) => {
  switch (compareByKey) {
    case 'school':
      return 'schoolId'
    case 'teacher':
      return 'teacherId'
    case 'student':
      return 'studentId'
    case 'class':
    case 'group':
      return 'groupId'
    case 'race':
      return 'race'
    case 'gender':
      return 'gender'
    case 'frlStatus':
      return 'frlStatus'
    case 'ellStatus':
      return 'ellStatus'
    case 'iepStatus':
      return 'iepStatus'
    case 'hispanicEthnicity':
      return 'hispanicEthnicity'
    default:
      return ''
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
    case 'race':
      return rowInfo.race
    case 'gender':
      return rowInfo.gender
    case 'frlStatus':
      return rowInfo.frlStatus
    case 'ellStatus':
      return rowInfo.ellStatus
    case 'iepStatus':
      return rowInfo.iepStatus
    case 'hispanicEthnicity':
      return rowInfo.hispanicEthnicity
    case 'studentId':
    default:
      return getFormattedName(
        `${rowInfo.firstName || ''} ${rowInfo.lastName || ''}`
      )
  }
}

export const getDenormalizedData = (rawData, compareByKey) => {
  if (isEmpty(rawData)) {
    return []
  }
  const rawTestInfo = get(rawData, 'data.result.testInfo', [])
  const testInfoMap = keyBy(rawTestInfo, 'reportKey')
  // store the order of tests to sort metric data
  const testOrderMap = {}
  rawTestInfo.forEach((t, index) => {
    testOrderMap[t.reportKey] = testOrderMap[t.reportKey] || index + 1
  })
  const rawStudInfo = get(rawData, 'data.result.studInfo', [])
  const studInfoMap = keyBy(rawStudInfo, 'studentId')
  const rawTeacherInfo = get(rawData, 'data.result.teacherInfo', [])
  const teacherInfoMap = keyBy(rawTeacherInfo, 'groupId')

  const rawStudentMetricInfo = get(rawData, 'data.result.studentMetricInfo', [])
  const studentMetricInfo = rawStudentMetricInfo
    .map((item) => {
      if (studInfoMap[item.studentId]) {
        return {
          ...item,
          ...studInfoMap[item.studentId],
          ...testInfoMap[item.reportKey],
          studentName: getFormattedName(
            `${studInfoMap[item.studentId].firstName || ''} ${
              studInfoMap[item.studentId].lastName || ''
            }`
          ),
          groupIds: uniq(studInfoMap[item.studentId].groupIds.split(',')),
        }
      }
      return item
    })
    .filter((item) => !isEmpty(item.groupIds))
    .sort((a, b) =>
      a.studentName.toLowerCase().localeCompare(b.studentName.toLowerCase())
    )
    .sort((a, b) => testOrderMap[b.reportKey] - testOrderMap[a.reportKey])

  const denormalizedData = studentMetricInfo.flatMap(({ groupIds, ...item }) =>
    groupIds.map((groupId) => ({
      ...item,
      groupId,
      ...(teacherInfoMap[groupId] || {}),
    }))
  )

  const compareByDataKey = getCompareByDataKey(compareByKey)
  const rawMetricInfo = get(rawData, 'data.result.metricInfo', [])
  const metricInfo = rawMetricInfo
    .map((item) => {
      let itemInfo = {}
      if (compareByDataKey === 'studentId' && studInfoMap[item.studentId]) {
        itemInfo = {
          ...studInfoMap[item.studentId],
          ...testInfoMap[item.reportKey],
          studentName: getFormattedName(
            `${studInfoMap[item.studentId].firstName || ''} ${
              studInfoMap[item.studentId].lastName || ''
            }`
          ),
        }
      }
      if (compareByDataKey === 'groupId' && teacherInfoMap[item.groupId]) {
        itemInfo = { ...(teacherInfoMap[item.groupId] || {}) }
      }
      if (compareByDataKey === 'schoolId' || compareByDataKey === 'teacherId') {
        const teacherInfo = rawTeacherInfo.find(
          (t) => t[compareByDataKey] === item[compareByDataKey]
        )
        itemInfo = isEmpty(teacherInfo) ? {} : { ...teacherInfo }
      }
      return { ...item, ...itemInfo }
    })
    .sort((a, b) => testOrderMap[b.reportKey] - testOrderMap[a.reportKey])

  return [denormalizedData, metricInfo]
}

export const getChartData = (rawChartData, masteryScale) => {
  if (isEmpty(rawChartData) || isEmpty(masteryScale)) {
    return []
  }

  const groupedByReportKey = groupBy(rawChartData, 'reportKey')
  const reportKeysArr = Object.keys(groupedByReportKey)
  const masteryMap = keyBy(masteryScale, 'score')
  const masteryCountHelper = {}

  for (const item of masteryScale) {
    masteryCountHelper[item.score] = 0
  }

  const chartData = reportKeysArr.map((item) => {
    const totalStudents = groupedByReportKey[item].length
    const tempMasteryCountHelper = { ...masteryCountHelper }

    for (const _item of groupedByReportKey[item]) {
      if (tempMasteryCountHelper[round(_item.fm)]) {
        tempMasteryCountHelper[round(_item.fm)]++
      } else {
        tempMasteryCountHelper[round(_item.fm)] = 1
      }
    }

    const obj = {
      totalStudents,
      reportKey: item,
      testName: groupedByReportKey[item][0].testName,
    }
    const masteryLabelInfo = {}

    Object.keys(tempMasteryCountHelper).forEach((_item) => {
      if (masteryMap[_item]) {
        const masteryPercentage = round(
          (tempMasteryCountHelper[_item] / totalStudents) * 100
        )
        masteryLabelInfo[masteryMap[_item].masteryLabel] =
          masteryMap[_item].masteryName
        if (_item == 1) {
          obj[masteryMap[_item].masteryLabel] = -masteryPercentage
        } else {
          obj[masteryMap[_item].masteryLabel] = masteryPercentage
        }
      }
    })
    obj.masteryLabelInfo = masteryLabelInfo

    return obj
  })

  return chartData
}

const getMasteryScore = (record = {}) =>
  round(record.fmSum / record.fmCount, 2) || 0

const getOverallMasteryScore = (records = []) =>
  records.length
    ? (sumBy(records, 'fmSum') / sumBy(records, 'fmCount')).toFixed(2)
    : 0

const getRecordMasteryLevel = (records, masteryScale) => {
  const score = getOverallMasteryScore(records)
  return getMasteryLevel(score, masteryScale)
}

export const getOverallColSorter = (analyseByKey, masteryScale) => {
  switch (analyseByKey) {
    case 'score':
      return (a, b) => getOverallScore(a.records) - getOverallScore(b.records)
    case 'rawScore':
      return (a, b) =>
        sumBy(a.records, 'totalScore') - sumBy(b.records, 'totalScore')
    case 'masteryScore':
      return (a, b) =>
        getOverallMasteryScore(a.records) - getOverallMasteryScore(b.records)
    case 'masteryLevel':
      return (a, b) =>
        getRecordMasteryLevel(a.records, masteryScale).score -
        getRecordMasteryLevel(b.records, masteryScale).score
    default:
      break
  }
}

export const getOverallValue = (record = {}, analyseByKey, masteryScale) => {
  switch (analyseByKey) {
    case 'masteryScore':
      return getOverallMasteryScore(record.records)
    case 'score':
      return `${round(getOverallScore(record.records))}%`
    case 'rawScore':
      return getOverallRawScore(record.records)
    case 'masteryLevel':
      return getRecordMasteryLevel(record.records, masteryScale).masteryLabel
    default:
      return analyseByKey
  }
}

export const getColValue = (test, analyseByKey, masteryScale) => {
  switch (analyseByKey) {
    case 'masteryScore':
      return test ? getMasteryScore(test) : 'N/A'
    case 'score':
      return test ? `${getScore(test)}%` : 'N/A'
    case 'rawScore':
      return test
        ? `${(test.totalScore || 0).toFixed(2)} / ${test.maxScore}`
        : 'N/A'
    case 'masteryLevel':
      return test
        ? getMasteryLevel(getMasteryScore(test), masteryScale).masteryLabel
        : 'N/A'
    default:
      return ''
  }
}

export const getMasteryScoreColor = (test, masteryScale) =>
  getMasteryLevel(getMasteryScore(test), masteryScale).color

export const getTableData = (
  rawTableData,
  testInfo,
  masteryScale,
  compareByKey
) => {
  const groupedTableDataByTest = groupBy(rawTableData, 'reportKey')
  const testInfoEnhanced = testInfo
    .map((test) => {
      const tableDataForTest = groupedTableDataByTest[test.reportKey]
      const masteryScore = getOverallMasteryScore(tableDataForTest)
      const score = round(
        (sumBy(tableDataForTest, 'totalScore') /
          sumBy(tableDataForTest, 'maxScore')) *
          100
      )
      const rawScore = `${sumBy(tableDataForTest, 'totalScore')?.toFixed(
        2
      )} / ${sumBy(tableDataForTest, 'maxScore')}`
      const masteryLevel = getRecordMasteryLevel(tableDataForTest, masteryScale)
        .masteryLabel
      return {
        ...test,
        masteryScore,
        score,
        rawScore,
        masteryLevel,
        fill: getMasteryLevel(masteryScore, masteryScale).color || '#cccccc',
      }
    })
    .reverse()

  const compareByDataKey = getCompareByDataKey(compareByKey)
  const groupedTableData = groupBy(
    rawTableData.filter((el) => !!el[compareByDataKey]),
    compareByDataKey
  )
  let tableData = Object.keys(groupedTableData)
    .map((itemId) => {
      const tableDataForItem = groupedTableData[itemId]
      const rowInfo = tableDataForItem.find((o) => o[compareByDataKey])
      const rowName = getRowName(compareByDataKey, rowInfo)
      return {
        id: itemId,
        name: rowName,
        records: tableDataForItem,
        rowInfo: tableDataForItem,
      }
    })
    .filter((o) => o.name)
  if (DemographicCompareByOptions.includes(compareByKey)) {
    tableData = orderBy(tableData, 'name', ['asc'])
  }
  return [tableData, testInfoEnhanced]
}
