import { get, isEmpty, groupBy, keyBy, uniq, sumBy, round } from 'lodash'

import { percentage } from '../../../../common/util'
import {
  getMasteryLevel,
  getScore,
  getOverallRawScore,
} from '../../standardsPerformance/utils/transformers'

const getFormattedName = (name) => {
  const nameArr = (name || '').trim().split(' ')
  const lName = nameArr.splice(nameArr.length - 1)[0]
  return nameArr.length ? `${lName}, ${nameArr.join(' ')}` : lName
}

export const getDenormalizedData = (rawData) => {
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
    .sort((a, b) => testOrderMap(a.reportKey) - testOrderMap(b.reportKey))

  const denormalizedData = studentMetricInfo.flatMap(({ groupIds, ...item }) =>
    groupIds.map((groupId) => ({
      ...item,
      groupId,
      ...(teacherInfoMap[groupId] || {}),
    }))
  )

  const rawMetricInfo = get(rawData, 'data.result.metricInfo', [])
  const metricInfo = rawMetricInfo
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
    .sort((a, b) => testOrderMap(a.reportKey) - testOrderMap(b.reportKey))

  const denormalizedTableData = metricInfo.flatMap(({ groupIds, ...item }) =>
    groupIds.map((groupId) => ({
      ...item,
      groupId,
      ...(teacherInfoMap[groupId] || {}),
    }))
  )

  return [denormalizedData, denormalizedTableData]
}

export const getFilteredDenormalizedData = (
  denormalizedData = [],
  denormalizedTableData = [],
  filters
) => {
  const filteredDenormalizedData = denormalizedData
    .filter((item) => {
      const genderFlag = !!(
        item.gender === filters.gender || filters.gender === 'all'
      )
      const frlStatusFlag = !!(
        item.frlStatus === filters.frlStatus || filters.frlStatus === 'all'
      )
      const ellStatusFlag = !!(
        item.ellStatus === filters.ellStatus || filters.ellStatus === 'all'
      )
      const iepStatusFlag = !!(
        item.iepStatus === filters.iepStatus || filters.iepStatus === 'all'
      )
      const raceFlag = !!(item.race === filters.race || filters.race === 'all')
      return (
        genderFlag &&
        frlStatusFlag &&
        ellStatusFlag &&
        iepStatusFlag &&
        raceFlag
      )
    })
    .sort((a, b) =>
      a.studentName.toLowerCase().localeCompare(b.studentName.toLowerCase())
    )
  const filteredDenormalizedTableData = denormalizedTableData
    .filter((item) => {
      const genderFlag = !!(
        item.gender === filters.gender || filters.gender === 'all'
      )
      const frlStatusFlag = !!(
        item.frlStatus === filters.frlStatus || filters.frlStatus === 'all'
      )
      const ellStatusFlag = !!(
        item.ellStatus === filters.ellStatus || filters.ellStatus === 'all'
      )
      const iepStatusFlag = !!(
        item.iepStatus === filters.iepStatus || filters.iepStatus === 'all'
      )
      const raceFlag = !!(item.race === filters.race || filters.race === 'all')
      return (
        genderFlag &&
        frlStatusFlag &&
        ellStatusFlag &&
        iepStatusFlag &&
        raceFlag
      )
    })
    .sort((a, b) =>
      a.studentName.toLowerCase().localeCompare(b.studentName.toLowerCase())
    )
  return [filteredDenormalizedData, filteredDenormalizedTableData]
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

export const getOverallScore = (metrics = []) =>
  percentage(sumBy(metrics, 'totalScore'), sumBy(metrics, 'maxScore'))

const getMasteryScore = (record) => round(record.fm, 2)

const getOverallMasteryScore = (records) =>
  records.length ? (sumBy(records, 'fm') / records.length).toFixed(2) : 0

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
      return `${getOverallScore(record.records)}%`
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
        : 0
    case 'masteryLevel':
      return test
        ? getMasteryLevel(getMasteryScore(test), masteryScale).masteryLabel
        : 'N/A'
    default:
      return ''
  }
}

export const getMasteryScoreColor = (test, masteryScale) => {
  getMasteryLevel(getMasteryScore(test), masteryScale).color
}

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
      return `${rowInfo.race}`
    case 'gender':
      return `${rowInfo.gender}`
    case 'frlStatus':
      return `${rowInfo.frlStatus}`
    case 'ellStatus':
      return `${rowInfo.ellStatus}`
    case 'iepStatus':
      return `${rowInfo.iepStatus}`
    case 'studentId':
    default:
      return getFormattedName(
        `${rowInfo.firstName || ''} ${rowInfo.lastName || ''}`
      )
  }
}

export const getTableData = (
  rawTableData,
  testInfo,
  masteryScale,
  compareByKey
) => {
  const groupedTableDataByTest = groupBy(rawTableData, 'reportKey')
  const testInfoEnhanced = testInfo.map((test) => {
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

  const compareByDataKey = getCompareByDataKey(compareByKey)
  const groupedTableData = groupBy(rawTableData, compareByDataKey)
  const tableData = Object.keys(groupedTableData).map((itemId) => {
    const tableDataForItem = groupedTableData[itemId]
    const rowInfo = tableDataForItem.find((o) => o[compareByDataKey])
    const rowName = getRowName(compareByDataKey, rowInfo) || ''
    return {
      id: itemId,
      name: rowName,
      records: tableDataForItem,
      rowInfo: tableDataForItem,
    }
  })

  return [tableData, testInfoEnhanced]
}
