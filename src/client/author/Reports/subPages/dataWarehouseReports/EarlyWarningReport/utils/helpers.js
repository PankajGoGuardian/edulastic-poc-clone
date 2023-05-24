import { lightRed5, lightGreen12, lightGrey9 } from '@edulastic/colors'
import { reportUtils } from '@edulastic/constants'
import next from 'immer'
import { sumBy, get, groupBy, maxBy } from 'lodash'
import React from 'react'
import moment from 'moment'
import {
  EXTERNAL_TEST_KEY_SEPARATOR,
  RISK_TYPE_KEYS,
} from '@edulastic/constants/reportUtils/common'
import {
  EXTERNAL_TEST_TYPES,
  TEST_TYPE_LABELS,
} from '@edulastic/constants/const/testTypes'
import { EduIf } from '@edulastic/common'
import HorizontalBar from '../../../../common/components/HorizontalBar'
import LinkCell from '../../common/components/LinkCell'
import LargeTag from '../../common/components/LargeTag'
import {
  StyledIconCaretDown,
  StyledIconCaretUp,
  StyledTag,
} from '../../common/components/styledComponents'
import {
  ColoredText,
  CustomStyledCell,
} from '../components/common/styledComponents'
import {
  tableColumnKeys,
  timeframeFilterKeys,
  timeframeFilterValues,
  CHART_LABEL_KEY,
  RISK_KEYS,
} from './constants'
import { compareByKeys } from '../../common/utils'
import {
  DW_EARLY_WARNING_REPORT_URL,
  DW_WLR_REPORT_URL,
} from '../../../../common/constants/dataWarehouseReports'

const {
  percentage,
  DECIMAL_BASE,
  RISK_BAND_LEVELS,
  RISK_BAND_COLOR_INFO,
} = reportUtils.common

export const getWidgetCellFooterInfo = (change) => {
  let color = lightGrey9
  let Icon = null
  if (change > 0) {
    color = lightRed5
    Icon = StyledIconCaretUp
  } else if (change < 0) {
    color = lightGreen12
    Icon = StyledIconCaretDown
  }
  return [Icon, color]
}

export const getTableColumns = ({
  compareBy,
  getTableDrillDownUrl,
  filters,
  tableColumnsData,
  isStudentCompareBy,
  tableData,
}) => {
  const tableColumns = next(tableColumnsData, (_columns) => {
    const dimensionColumn = _columns.find(
      (col) => col.key === tableColumnKeys.DIMENSION
    )
    dimensionColumn.title = compareBy.title
    dimensionColumn.render = (value) => {
      const reportUrl = isStudentCompareBy
        ? DW_WLR_REPORT_URL
        : DW_EARLY_WARNING_REPORT_URL
      const url = [
        compareByKeys.SCHOOL,
        compareByKeys.TEACHER,
        compareByKeys.CLASS,
        compareByKeys.STUDENT,
        compareByKeys.GROUP,
      ].includes(compareBy.key)
        ? getTableDrillDownUrl(value._id, reportUrl)
        : null
      return <LinkCell value={value} url={url} />
    }

    if (isStudentCompareBy) {
      const attendanceColumnIdx = _columns.findIndex(
        ({ key }) => key === tableColumnKeys.AVG_ATTENDANCE
      )
      if (filters.riskType === RISK_TYPE_KEYS.ACADEMIC) {
        _columns.splice(attendanceColumnIdx, 1)
      }
      const riskColumn = _columns.find(
        (col) => col.key === tableColumnKeys.RISK
      )
      riskColumn.render = (value) => (
        <CustomStyledCell color={RISK_BAND_COLOR_INFO[value]}>
          {value}
        </CustomStyledCell>
      )
    } else {
      const highRiskColumn = _columns.find(
        (col) => col.key === tableColumnKeys.HIGH_RISK
      )
      highRiskColumn.title = (
        <CustomStyledCell
          color={RISK_BAND_COLOR_INFO[RISK_BAND_LEVELS.HIGH]}
          showBoxShadow
        >
          HIGH
        </CustomStyledCell>
      )

      highRiskColumn.render = (_, { highRisk, totalStudents }) => (
        <LargeTag
          width="35px"
          textAlign="right"
          leftText={`${percentage(highRisk, totalStudents, true)}%`}
          rightText={`${highRisk} /${totalStudents}`}
        />
      )

      const mediumRiskColumn = _columns.find(
        (col) => col.key === tableColumnKeys.MEDIUM_RISK
      )
      mediumRiskColumn.title = (
        <CustomStyledCell
          color={RISK_BAND_COLOR_INFO[RISK_BAND_LEVELS.MEDIUM]}
          showBoxShadow
        >
          MEDIUM
        </CustomStyledCell>
      )
      mediumRiskColumn.render = (_, { mediumRisk, totalStudents }) => (
        <LargeTag
          width="35px"
          textAlign="right"
          leftText={`${percentage(mediumRisk, totalStudents, true)}%`}
          rightText={`${mediumRisk} /${totalStudents}`}
        />
      )

      const academicRiskColumnIdx = _columns.findIndex(
        (col) => col.key === tableColumnKeys.ACADEMIC_RISK
      )
      _columns[academicRiskColumnIdx].render = (value) => {
        const academicRisk =
          value?.academicRisk?.map((b) => ({
            ...b,
            color: RISK_BAND_COLOR_INFO[b.bandLabel],
          })) || []
        return <HorizontalBar data={academicRisk} />
      }

      const attendanceRiskColumnIdx = _columns.findIndex(
        (col) => col.key === tableColumnKeys.ATTENDANCE_RISK
      )
      _columns[attendanceRiskColumnIdx].render = (value) => {
        const attendanceRisk =
          value?.attendanceRisk?.map((b) => ({
            ...b,
            color: RISK_BAND_COLOR_INFO[b.bandLabel],
          })) || []
        return <HorizontalBar data={attendanceRisk} />
      }

      if (filters.riskType === RISK_TYPE_KEYS.ACADEMIC) {
        _columns.splice(attendanceRiskColumnIdx, 1)
      }
      if (filters.riskType === RISK_TYPE_KEYS.ATTENDANCE) {
        _columns.splice(academicRiskColumnIdx, 1)
      }
    }
  })
  if (
    isStudentCompareBy &&
    [RISK_TYPE_KEYS.ACADEMIC, RISK_TYPE_KEYS.OVERALL].includes(filters.riskType)
  ) {
    const rowWithMaxTestTypes = maxBy(
      tableData,
      (row) => Object.keys(row.academicRisk).length
    )
    const availableTestTypes = Object.keys(
      rowWithMaxTestTypes?.academicRisk || {}
    )
    const academicSubColumns = availableTestTypes.map((testType) => {
      const isExternal =
        EXTERNAL_TEST_TYPES[testType.split(EXTERNAL_TEST_KEY_SEPARATOR)[0]]
      const scoreSuffix = isExternal ? '' : '%'
      const testTypeText = isExternal
        ? testType.replace(EXTERNAL_TEST_KEY_SEPARATOR, ' - ')
        : TEST_TYPE_LABELS[testType]

      return {
        key: testType,
        title: (
          <>
            <EduIf condition={!isExternal}>
              <StyledTag
                border="1.5px solid black"
                font="bold"
                marginBlock="5px"
              >
                {testTypeText}
              </StyledTag>
            </EduIf>
            <EduIf condition={isExternal}>
              <StyledTag color="black" marginBlock="5px">
                {testTypeText}
              </StyledTag>
            </EduIf>
          </>
        ),
        dataIndex: 'academicRisk',
        render: (value) => {
          const scoreValue =
            value[testType]?.score >= 0
              ? `${value[testType].score}${scoreSuffix}`
              : '-'
          const riskBandColor =
            RISK_BAND_COLOR_INFO[value[testType]?.risk] || ''
          return <ColoredText color={riskBandColor}>{scoreValue}</ColoredText>
        },
      }
    })
    const academicColumn = {
      title: 'ACADEMICS',
      align: 'left',
      className: 'nested',
      children: academicSubColumns,
    }
    tableColumns.push(academicColumn)
  }
  return tableColumns
}

const getRiskBandStudentCount = (distribution = [], key) => {
  return distribution.find((d) => d.bandLabel === key)?.studentCount || 0
}

export const getPeriodRiskData = (period) => {
  const highRisk = getRiskBandStudentCount(
    period.distribution,
    RISK_BAND_LEVELS.HIGH
  )

  const mediumRisk = getRiskBandStudentCount(
    period.distribution,
    RISK_BAND_LEVELS.MEDIUM
  )
  return [highRisk, mediumRisk]
}

const getRiskSummaryPieChartData = (distribution = []) => {
  const totalStudentCount = sumBy(distribution, ({ studentCount }) =>
    parseInt(studentCount, DECIMAL_BASE)
  )
  return distribution.map(({ studentCount, bandLabel }) => ({
    name: bandLabel,
    value: percentage(
      parseInt(studentCount, DECIMAL_BASE),
      totalStudentCount,
      true
    ),
    fill: RISK_BAND_COLOR_INFO[bandLabel],
  }))
}

export const transformRiskSummaryData = (prePeriod, postPeriod, showFooter) => {
  if (!postPeriod?.distribution?.length) return {}
  const [postPeriodhighRisk, postPeriodMediumRisk] = getPeriodRiskData(
    postPeriod
  )
  const pieChartData = getRiskSummaryPieChartData(postPeriod.distribution)
  let highRiskChange = 0
  let mediumRiskChange = 0
  if (showFooter) {
    const [prePeriodhighRisk, prePeriodMediumRisk] = getPeriodRiskData(
      prePeriod
    )
    highRiskChange = postPeriodhighRisk - prePeriodhighRisk
    mediumRiskChange = postPeriodMediumRisk - prePeriodMediumRisk
  }
  return {
    postPeriodhighRisk: new Intl.NumberFormat().format(postPeriodhighRisk),
    highRiskChange,
    postPeriodMediumRisk: new Intl.NumberFormat().format(postPeriodMediumRisk),
    mediumRiskChange,
    pieChartData,
  }
}

const sortGroupedTimelineData = (data, timeframe) =>
  data.sort((a, b) => {
    if (a[0].year === b[0].year) {
      return a[0][timeframe] - b[0][timeframe]
    }
    return a[0].year - b[0].year
  })

export const getTimelineChartData = (rawData, filters) => {
  const { timeframe } = filters
  const timelineData = get(rawData, 'data.result', [])
  if (!timelineData.length) {
    return []
  }

  const timelineDataWithDateString = timelineData.map((timelineItem) => {
    let chartTimeLabel = ''
    let momentDate = null
    const { year, month, quarter } = timelineItem
    if (timeframe === timeframeFilterKeys.MONTHLY) {
      const date = new Date(year, month - 1)
      momentDate = moment(date)
      chartTimeLabel = momentDate.format('MMM YYYY')
    } else if (timeframe === timeframeFilterKeys.QUARTERLY) {
      chartTimeLabel = `Q${quarter} ${year}`
      momentDate = moment()
    }
    return {
      ...timelineItem,
      [CHART_LABEL_KEY]: chartTimeLabel,
      momentDate,
    }
  })

  const groupedTimelineData = Object.values(
    groupBy(timelineDataWithDateString, CHART_LABEL_KEY)
  )

  const sortedGroupedTimelineData = sortGroupedTimelineData(
    groupedTimelineData,
    timeframeFilterValues[timeframe]
  )

  const finalData = []
  sortedGroupedTimelineData.forEach((groupedData) => {
    const totalStudents = groupedData.reduce(
      (prev, curr) => prev + curr.studentCount,
      0
    )
    const studentCounts = {}
    groupedData.forEach((entry) => {
      studentCounts[entry.bandLabel.toLocaleLowerCase()] = percentage(
        entry.studentCount,
        totalStudents,
        true
      )
    })
    if (studentCounts[RISK_KEYS.LOW] === 100) {
      studentCounts[RISK_KEYS.MEDIUM] = 0
      studentCounts[RISK_KEYS.HIGH] = 0
    }
    finalData.push({
      ...groupedData[0],
      ...studentCounts,
    })
  })
  return finalData
}

export const transformTableData = (tableMetrics) => {
  const tableData = tableMetrics.map((m) => {
    const { attendanceRisk = {}, academicRisk = {} } = m
    const overallRisk = [attendanceRisk, ...Object.values(academicRisk)]
    const highRiskMeasures =
      overallRisk.filter((r) => r.risk === RISK_BAND_LEVELS.HIGH).length || 0
    const mediumRiskMeasures =
      overallRisk.filter((r) => r.risk === RISK_BAND_LEVELS.MEDIUM).length || 0
    return {
      ...m,
      highRiskMeasures,
      mediumRiskMeasures,
      academicRisk,
    }
  })
  return tableData
}
