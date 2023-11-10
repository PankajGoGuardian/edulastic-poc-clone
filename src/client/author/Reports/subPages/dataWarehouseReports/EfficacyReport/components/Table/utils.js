import React from 'react'
import next from 'immer'
import { get, groupBy, map, maxBy, sumBy } from 'lodash'
import { reportUtils } from '@edulastic/constants'
import {
  getScoreLabel,
  getScoreLabelNoSuffix,
} from '@edulastic/constants/const/dataWarehouse'
import { downloadCSV } from '../../../../../common/util'
import {
  analyseBykeys,
  compareByStudentColumns,
  dataKeys,
  genericColumnsForTable,
  getAvgValue,
  getDataKeys,
  sortKeys,
} from '../../utils'
import AvgPerformance from './columns/AvgPerformance'
import PerformanceChange from './columns/PerformanceChange'
import TestNamesCell from './columns/TestNamesCell'
import HorizontalBar from '../../../../../common/components/HorizontalBar'
import {
  compareByFieldKeys,
  compareByKeys,
  compareByOptionsInfo,
} from '../../../common/utils'
import LinkCell from '../../../common/components/LinkCell'

const {
  DECIMAL_BASE,
  getFormattedName,
  getProficiencyBand,
  percentage,
  ROUND_OFF_TO_INTEGER,
} = reportUtils.common

export const onCsvConvert = (data) => downloadCSV(`Efficacy Report.csv`, data)

export const getTableColumns = (
  testInfo,
  tableFilters,
  getTableDrillDownUrl,
  isSharedReport
) => {
  const { compareBy, analyseBy, sortKey, sortOrder } = tableFilters
  const { key: compareByKey } = compareBy
  const { key: analyseByKey } = analyseBy

  const isStudentCompareBy = compareByKey === compareByKeys.STUDENT

  const tableColumnsData = isStudentCompareBy
    ? compareByStudentColumns
    : genericColumnsForTable

  const { preTestInfo, postTestInfo } = testInfo

  const tableColumns = next(tableColumnsData, (_columns) => {
    // compareBy column
    const compareByColumnIdx = _columns.findIndex(
      (col) => col.key === sortKeys.COMPARE_BY
    )
    _columns[compareByColumnIdx].title = compareBy.title
    _columns[compareByColumnIdx].render = (value) => {
      const url = isSharedReport ? null : getTableDrillDownUrl(value._id)
      return (
        <LinkCell value={value} url={url} openNewTab={isStudentCompareBy} />
      )
    }
    // Test names column
    const testColumnIdx = _columns.findIndex((col) => col.key === 'test')
    _columns[testColumnIdx].render = () => (
      <TestNamesCell
        preTestName={preTestInfo.name}
        postTestName={postTestInfo.name}
      />
    )

    // Avg Peformance column
    const avgPerformanceColumnIdx = _columns.findIndex(
      (col) => col.key === 'avgPerformance'
    )
    _columns[avgPerformanceColumnIdx].render = (value) => (
      <AvgPerformance
        data={value}
        analyseBy={analyseByKey}
        testInfo={testInfo}
      />
    )

    // Performance change column
    const changeColumnIdx = _columns.findIndex((col) => col.key === 'change')
    _columns[changeColumnIdx].render = (value) => (
      <PerformanceChange data={value} testInfo={testInfo} />
    )

    // Performance band column
    if (compareByKey !== compareByKeys.STUDENT) {
      const performanceBandColumnIdx = _columns.findIndex(
        (col) => col.key === 'performanceBand'
      )
      _columns[performanceBandColumnIdx].render = (value) => {
        const { preTestData, postTestData } = value
        return (
          <>
            <div>
              <HorizontalBar data={preTestData.bandDistribution} />
            </div>
            <div style={{ marginTop: '20px' }}>
              <HorizontalBar data={postTestData.bandDistribution} />
            </div>
          </>
        )
      }
    }

    // download csv columns
    const preAvgScoreColumn = _columns.find((c) => c.key === 'AvgPre')
    preAvgScoreColumn.render = ({ preTestData }) =>
      analyseBy === analyseBykeys.RAW_SCORE
        ? getScoreLabelNoSuffix(preTestData.avgScore, preTestData)
        : getScoreLabel(preTestData.normScore, preTestInfo)

    const postAvgScoreColumn = _columns.find((c) => c.key === 'AvgPost')
    postAvgScoreColumn.render = ({ postTestData }) =>
      analyseBy === analyseBykeys.RAW_SCORE
        ? getScoreLabelNoSuffix(postTestData.avgScore, postTestData)
        : getScoreLabel(postTestData.normScore, postTestInfo)

    _columns.forEach((item) => {
      if (item.key === sortKey) {
        item.sortOrder = sortOrder
      }
    })
  })

  return tableColumns
}

const groupTableMetricInfo = (
  metricInfo,
  tableFilters,
  preDataKey,
  postDataKey
) => {
  const {
    preBandScore,
    postBandScore,
    compareBy: { key: compareByKey },
  } = tableFilters

  let groupedByCompareByKey
  // if matrix cell is clicked - filter metricInfo by preBandScore and postBandScore
  if (preBandScore && postBandScore) {
    const filteredMetricInfo = metricInfo.filter(
      (m) =>
        parseInt(m[preDataKey], DECIMAL_BASE) ===
          parseInt(preBandScore, DECIMAL_BASE) &&
        parseInt(m[postDataKey], DECIMAL_BASE) ===
          parseInt(postBandScore, DECIMAL_BASE)
    )
    groupedByCompareByKey = groupBy(
      filteredMetricInfo,
      compareByFieldKeys[compareByKey]
    )
  } else {
    groupedByCompareByKey = groupBy(
      metricInfo,
      compareByFieldKeys[compareByKey]
    )
  }
  return groupedByCompareByKey
}

const getTestsData = (
  data,
  studentsCount,
  prefix,
  performanceBand,
  testInfo
) => {
  const result = {}
  const avgScore = getAvgValue(data, `${prefix}TestScore`, studentsCount)
  result.avgScore = avgScore
  if (testInfo.isExternal) {
    const avgAchievementLevel = getAvgValue(
      data,
      `${prefix}${dataKeys.EXTERNAL}`,
      studentsCount
    )
    const band = performanceBand.find((b) => b.rank === avgAchievementLevel)
    const bandDistribution = performanceBand.map(({ rank, color, name }) => {
      const bandData = data.filter(
        (d) =>
          parseInt(d[`${prefix}${dataKeys.EXTERNAL}`], DECIMAL_BASE) === rank
      )
      return {
        value: percentage(
          sumBy(bandData, (d) => parseInt(d.totalStudentCount, DECIMAL_BASE)),
          studentsCount,
          ROUND_OFF_TO_INTEGER
        ),
        name,
        color,
      }
    })
    Object.assign(result, { band, bandDistribution, normScore: avgScore })
  } else {
    const maxScore = get(
      maxBy(data, `${prefix}TestMaxScore`),
      `${prefix}TestMaxScore`
    )
    const avgScorePercentage = percentage(
      avgScore,
      maxScore,
      ROUND_OFF_TO_INTEGER
    )
    const band = getProficiencyBand(avgScorePercentage, performanceBand)
    const bandDistribution = performanceBand.map(
      ({ threshold, color, name }) => {
        const bandData = data.filter(
          (d) =>
            parseInt(d[`${prefix}${dataKeys.INTERNAL}`], DECIMAL_BASE) ===
            threshold
        )
        return {
          value: percentage(
            sumBy(bandData, (d) => parseInt(d.totalStudentCount, DECIMAL_BASE)),
            studentsCount,
            ROUND_OFF_TO_INTEGER
          ),
          name,
          color,
        }
      }
    )
    Object.assign(result, {
      maxScore,
      avgScorePercentage,
      band,
      bandDistribution,
      normScore: avgScorePercentage,
    })
  }
  return result
}

export const getTableData = (
  metricInfo,
  prePerformanceBand = [],
  postPerformanceBand = [],
  tableFilters,
  testInfo = {}
) => {
  const [preDataKey, postDataKey] = getDataKeys(testInfo)
  const groupedByCompareByKey = groupTableMetricInfo(
    metricInfo,
    tableFilters,
    preDataKey,
    postDataKey
  )
  const { preTestInfo = {}, postTestInfo = {} } = testInfo

  const tableData = map(Object.keys(groupedByCompareByKey), (key) => {
    const data = groupedByCompareByKey[key]
    const studentsCount = sumBy(data, (d) =>
      parseInt(d.totalStudentCount, DECIMAL_BASE)
    )

    const preTestData = getTestsData(
      data,
      studentsCount,
      'pre',
      prePerformanceBand,
      preTestInfo
    )
    const postTestData = getTestsData(
      data,
      studentsCount,
      'post',
      postPerformanceBand,
      postTestInfo
    )

    const dimension = {}
    const extraStudentColumns = {}
    const compareByKey = tableFilters.compareBy?.key
    const isStudentCompareBy = compareByKey === compareByKeys.STUDENT
    if (isStudentCompareBy) {
      const {
        firstName,
        lastName,
        schoolName,
        teacherName,
        groupName,
        studentId,
      } = data[0]
      const name = getFormattedName(`${firstName || ''} ${lastName || ''}`)
      Object.assign(dimension, { _id: studentId, name, firstName, lastName })
      Object.assign(extraStudentColumns, {
        schoolName,
        teacherName,
        groupName,
      })
    } else {
      Object.assign(dimension, {
        _id: data[0][compareByOptionsInfo[compareByKey].key],
        name: data[0][compareByOptionsInfo[compareByKey].name],
      })
    }
    return {
      dimension,
      extraStudentColumns,
      studentsCount,
      data: {
        preTestData,
        postTestData,
      },
    }
  })
  return tableData
}
