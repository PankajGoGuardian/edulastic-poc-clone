import { lightRed5, lightGreen12, lightGrey9 } from '@edulastic/colors'
import { reportUtils } from '@edulastic/constants'
import next from 'immer'
import { sumBy, sortBy, groupBy, omit, round } from 'lodash'
import React from 'react'
import moment from 'moment'
import {
  EXTERNAL_TEST_KEY_SEPARATOR,
  RISK_TYPE_KEYS,
} from '@edulastic/constants/reportUtils/common'
import { TEST_TYPE_LABELS } from '@edulastic/constants/const/testTypes'
import { EduIf } from '@edulastic/common'
import { getScoreLabel } from '@edulastic/constants/const/dataWarehouse'
import HorizontalBar from '../../../../common/components/HorizontalBar'
import LinkCell from '../../common/components/LinkCell'
import LargeTag from '../../common/components/LargeTag'
import {
  ColoredText,
  StyledIconCaretDown,
  StyledIconCaretUp,
  StyledTag,
} from '../../common/components/styledComponents'
import { CustomStyledCell } from '../components/common/styledComponents'
import {
  tableColumnKeys,
  timeframeFilterKeys,
  timeframeFilterValues,
  CHART_LABEL_KEY,
} from './constants'
import { sortTestTypes } from '../../common/utils'

const {
  percentage,
  DECIMAL_BASE,
  RISK_BAND_LABELS,
  RISK_BAND,
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
  feedTypes,
}) => {
  const tableColumns = next(tableColumnsData, (_columns) => {
    const dimensionColumn = _columns.find(
      (col) => col.key === tableColumnKeys.DIMENSION
    )
    dimensionColumn.title = compareBy.title
    dimensionColumn.render = (value) => {
      const url = getTableDrillDownUrl(value._id)
      return (
        <LinkCell value={value} url={url} openNewTab={isStudentCompareBy} />
      )
    }

    if (isStudentCompareBy) {
      const schoolColumn = _columns.find(
        (col) => col.key === tableColumnKeys.SCHOOL
      )
      schoolColumn.render = (name) => <LinkCell value={{ name }} />

      if (filters.riskType === RISK_TYPE_KEYS.ACADEMIC) {
        const attendanceColumnIdx = _columns.findIndex(
          ({ key }) => key === tableColumnKeys.AVG_ATTENDANCE
        )
        _columns.splice(attendanceColumnIdx, 1)
      }
      const riskColumn = _columns.find(
        (col) => col.key === tableColumnKeys.RISK
      )
      riskColumn.render = (value, { riskScore }) => (
        <CustomStyledCell width="100px" color={RISK_BAND[value]?.color}>
          {RISK_BAND[value]?.label} ({round(riskScore, 1).toFixed(1)})
        </CustomStyledCell>
      )
    } else {
      const highRiskColumn = _columns.find(
        (col) => col.key === tableColumnKeys.HIGH_RISK
      )
      highRiskColumn.title = (
        <CustomStyledCell
          color={RISK_BAND[RISK_BAND_LABELS.HIGH].color}
          showBoxShadow
        >
          {RISK_BAND[RISK_BAND_LABELS.HIGH].label}
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
          color={RISK_BAND[RISK_BAND_LABELS.MEDIUM].color}
          showBoxShadow
        >
          {RISK_BAND[RISK_BAND_LABELS.MEDIUM].label}
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
            color: RISK_BAND[b.bandLabel].color,
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
            color: RISK_BAND[b.bandLabel].color,
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
    const availableTestTypes = new Set()
    tableData.forEach((row) =>
      Object.keys(row.academicRisk).forEach((testType) =>
        availableTestTypes.add(testType)
      )
    )
    const sortedAvailableTestTypes = sortTestTypes([...availableTestTypes])
    const academicSubColumns = sortedAvailableTestTypes.map((testType) => {
      const externalTestDefinition = (feedTypes || []).find(
        ({ key }) => key === testType.split(EXTERNAL_TEST_KEY_SEPARATOR)[0]
      )
      const testTypeText = externalTestDefinition
        ? testType.replace(EXTERNAL_TEST_KEY_SEPARATOR, ' - ')
        : TEST_TYPE_LABELS[testType]

      return {
        key: testType,
        title: (
          <>
            <EduIf condition={!externalTestDefinition}>
              <StyledTag
                border="1.5px solid black"
                font="bold"
                marginBlock="5px"
              >
                {testTypeText}
              </StyledTag>
            </EduIf>
            <EduIf condition={externalTestDefinition}>
              <StyledTag color="black" marginBlock="5px">
                {testTypeText}
              </StyledTag>
            </EduIf>
          </>
        ),
        dataIndex: 'academicRisk',
        render: (value) => {
          const scoreLabel =
            value[testType]?.score >= 0
              ? getScoreLabel(value[testType].score, {
                  externalTestType: externalTestDefinition?.key,
                })
              : '-'
          return <ColoredText>{scoreLabel}</ColoredText>
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
    RISK_BAND_LABELS.HIGH
  )

  const mediumRisk = getRiskBandStudentCount(
    period.distribution,
    RISK_BAND_LABELS.MEDIUM
  )
  return [highRisk, mediumRisk]
}

const getRiskSummaryPieChartData = (distribution = []) => {
  const totalStudentCount = sumBy(distribution, ({ studentCount }) =>
    parseInt(studentCount, DECIMAL_BASE)
  )
  const pieChartData = distribution
    .map(({ studentCount, bandLabel }) => ({
      name: RISK_BAND[bandLabel].label,
      value: percentage(
        parseInt(studentCount, DECIMAL_BASE),
        totalStudentCount,
        true
      ),
      fill: RISK_BAND[bandLabel].color,
    }))
    .sort((a, b) => b.bandLevel - a.bandLevel)
  return pieChartData
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

const generateTimeframeLabel = ({ year, month, quarter }, timeframe) => {
  let momentDate = null
  let chartTimeLabel = ''
  if (timeframe === timeframeFilterKeys.MONTHLY) {
    const date = new Date(year, month - 1)
    momentDate = moment(date)
    chartTimeLabel = momentDate.format('MMM YYYY')
  }
  if (timeframe === timeframeFilterKeys.QUARTERLY) {
    chartTimeLabel = `Q${quarter} ${year}`
  }
  return { momentDate, chartTimeLabel }
}

const getTimelineDataWithDateString = (data, timeframe) => {
  return data.map((timelineItem) => {
    const { momentDate, chartTimeLabel } = generateTimeframeLabel(
      timelineItem,
      timeframe
    )
    return {
      ...timelineItem,
      [CHART_LABEL_KEY]: chartTimeLabel,
      momentDate,
    }
  })
}

const getTimelineChartLabels = (startItem, endItem, timeframe) => {
  const timelineChartLabels = []
  // check if valid month data is available and timeframe is monthly
  if (startItem.month && timeframe === timeframeFilterKeys.MONTHLY) {
    const { momentDate: startMomentDate } = startItem
    const { momentDate: endMomentDate } = endItem
    const monthsDiff = endMomentDate.diff(startMomentDate, 'months')
    for (let i = 0; i <= monthsDiff; i++) {
      const date = moment(startMomentDate).add(i, 'month')
      timelineChartLabels.push(date.format('MMM YYYY'))
    }
  }
  // check if valid month data is available and timeframe is monthly
  if (startItem.quarter && timeframe === timeframeFilterKeys.QUARTERLY) {
    let { quarter, year } = startItem
    const { quarter: endQuarter, year: endYear } = endItem
    while (year < endYear) {
      timelineChartLabels.push(`Q${quarter} ${year}`)
      if (quarter === 4) {
        quarter = 1
        year += 1
      } else {
        quarter += 1
      }
    }
    while (quarter <= endQuarter) {
      timelineChartLabels.push(`Q${quarter} ${year}`)
      quarter += 1
    }
  }
  return timelineChartLabels
}

export const getTimelineChartData = (rawData, filters) => {
  const { timeframe } = filters
  const timelineData = rawData?.data?.result || []
  if (!timelineData.length) {
    return []
  }
  const sortedTimelineData = sortBy(timelineData, [
    'year',
    timeframeFilterValues[timeframe],
  ])
  const timelineDataWithDateString = getTimelineDataWithDateString(
    sortedTimelineData,
    timeframe
  )
  const timelineChartLabels = getTimelineChartLabels(
    timelineDataWithDateString[0],
    timelineDataWithDateString.slice(-1)[0],
    timeframe
  )
  const groupedTimelineData = groupBy(
    timelineDataWithDateString,
    CHART_LABEL_KEY
  )
  const timelineChartData = timelineChartLabels.map((chartTimeLabel) => {
    const groupedData = groupedTimelineData[chartTimeLabel]
    if (!groupedData) {
      return {
        [CHART_LABEL_KEY]: chartTimeLabel,
      }
    }
    const totalStudents = groupedData.reduce(
      (prev, curr) => prev + curr.studentCount,
      0
    )
    const studentCounts = {}
    Object.values(RISK_BAND_LABELS).forEach((k) => {
      const data = groupedData.find((d) => k === d.bandLabel)
      studentCounts[k] = data
        ? percentage(data.studentCount, totalStudents, true)
        : 0
    })
    return {
      ...omit(groupedData[0], ['bandLabel']),
      ...studentCounts,
    }
  })
  return timelineChartData
}

export const transformTableData = (tableMetrics) => {
  const tableData = tableMetrics.map((m) => {
    const { attendanceRisk = {}, academicRisk = {} } = m
    const overallRisk = [attendanceRisk, ...Object.values(academicRisk)]
    const highRiskMeasures =
      overallRisk.filter((r) => r.risk === RISK_BAND_LABELS.HIGH).length || 0
    const mediumRiskMeasures =
      overallRisk.filter((r) => r.risk === RISK_BAND_LABELS.MEDIUM).length || 0
    return {
      ...m,
      highRiskMeasures,
      mediumRiskMeasures,
      academicRisk,
    }
  })
  return tableData
}
