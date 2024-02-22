import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, isNumber, round } from 'lodash'

import { greyThemeDark1 } from '@edulastic/colors'
import { reportUtils } from '@edulastic/constants'
import { EduIf, EduThen, FlexContainer } from '@edulastic/common'
import { getScoreLabel } from '@edulastic/constants/const/dataWarehouse'
import { IconCarets } from '@edulastic/icons'
import { SignedStackedBarWithLineChart } from '../../../../common/components/charts/customSignedStackedBarWithLineChart'
import {
  TooltipRow,
  TooltipRowTitle,
  TooltipRowValue,
  DashedHr,
  ColorCircle,
  ColorBandRow,
  StyledText,
} from '../../../../common/styled'
import { toggleItem } from '../../../../common/util'
import { getTestName } from '../utils'
import {
  getTestUniqId,
  getXTickTagText,
  getXTickTooltipText,
} from '../../common/utils'
import { ChartPreLabelWrapper } from '../../../../common/components/charts/styled-components'

const { formatDate } = reportUtils.common

const chartLineProps = {
  strokeDasharray: '5 3',
  stroke: greyThemeDark1,
  strokeWidth: 2,
  strokeWidthActive: 20,
}

const chartMargin = { top: 0, right: 40, left: 40, bottom: 40 }

const TooltipRowItem = ({ title = '', value = '' }) => (
  <TooltipRow>
    <TooltipRowTitle>{`${title}`}</TooltipRowTitle>
    <TooltipRowValue>{value}</TooltipRowValue>
  </TooltipRow>
)

const ColorBandItem = ({ name, color, highlight }) => {
  let style = {}
  if (highlight) {
    style = { fontSize: '15px', fontWeight: 'bold' }
  }
  return (
    <ColorBandRow>
      <ColorCircle color={color} />
      <TooltipRowValue style={style}>{name}</TooltipRowValue>
    </ColorBandRow>
  )
}

// payload: [{ color, dataKey, fill, formatter, name, type, unit, value, payload }, ...]
// payload[0].payload: contains data for that bar
const getTooltipJSX = (payload, barIndex) => {
  if (payload && payload.length && barIndex !== null) {
    const barData = payload[0].payload
    const {
      externalTestType,
      bands,
      color,
      bandName,
      assessmentDate,
      totalGraded,
      averageScore,
      averageScaledScore,
      averageLexileScore,
      averageQuantileScore,
      termName,
    } = barData

    let colorBandComponent = null
    if (externalTestType) {
      const achievementLevels = [...bands].reverse()
      colorBandComponent = (
        <>
          <TooltipRowItem title={`${achievementLevels.length} color band`} />
          {achievementLevels.map((band) => (
            <ColorBandItem
              highlight={false}
              color={band.color}
              name={band.name}
            />
          ))}
        </>
      )
    } else {
      colorBandComponent = <ColorBandItem color={color} name={bandName} />
    }
    let score = externalTestType
      ? round(averageScaledScore)
      : round(averageScore)
    score = getScoreLabel(score, barData)
    return (
      <div>
        <TooltipRowItem title="Date:" value={formatDate(assessmentDate)} />
        <TooltipRowItem title="Students:" value={totalGraded} />
        <TooltipRowItem title="Score:" value={score} />
        <TooltipRowItem title="School Year:" value={termName} />
        <EduIf condition={averageLexileScore}>
          <EduThen>
            <TooltipRowItem title="Lexile Score:" value={averageLexileScore} />
          </EduThen>
        </EduIf>
        <EduIf condition={externalTestType && averageQuantileScore}>
          <EduThen>
            <TooltipRowItem
              title="Quantile Score:"
              value={averageQuantileScore}
            />
          </EduThen>
        </EduIf>
        <DashedHr />
        {colorBandComponent}
      </div>
    )
  }
  return null
}

const getRightTooltipJSX = (payload, barIndex) => {
  if (payload && payload.length && barIndex !== null) {
    const barKey = `bar${barIndex + 1}`
    const barData = payload[0].payload
    const recordColor = barData.additionalData[barKey]
    // TODO: find a better way to handle right tooltip state updates
    if (isEmpty(barData) || isEmpty(recordColor)) return null
    const records = barData.records
    const bar = records.filter((e) => {
      return e.color === recordColor.fill
    })
    if (isEmpty(bar)) return null
    let name = bar[0].bandName
    if (barData.externalTestType) {
      const achievementLevels = [...barData.bands]
      name = achievementLevels.filter((e) => e.color === recordColor.fill)[0]
        .name
    }
    const colorBandComponent = (
      <ColorBandItem color={bar[0].color} name={name} />
    )
    return (
      <div>
        <TooltipRowItem
          title="Students:"
          value={`${bar[0].totalGraded}/${barData.totalGraded}`}
        />
        <TooltipRowItem title="Student(%):" value={`${barData[barKey]}%`} />
        <DashedHr />
        {colorBandComponent}
      </div>
    )
  }
  return null
}

// value: contains the value to be displayed as bar label
const barsLabelFormatter = (value) => {
  return value || ''
}

// payload: { coordinate, value, index, offset }
// _data: contains the current slice of data displayed in the chart
const getXTickText = (payload, _data) => {
  const _testName = getTestName(_data[payload.index])
  return _testName
}

const Chart = ({
  chartData,
  selectedPerformanceBand,
  selectedTests,
  setSelectedTests,
  showInterventions,
  interventionsData,
  isMultiSchoolYear,
}) => {
  const achievementLevels = chartData.flatMap((cdItem) =>
    cdItem.externalTestType ? cdItem.bands : []
  )

  const legendPayload = selectedPerformanceBand
    .sort((a, b) => a.threshold - b.threshold)
    .map((pb, index) => ({
      id: `pb${index + 1}`,
      color: pb.color,
      value: pb.name,
      type: 'circle',
    }))

  const selectedTestsFilter = selectedTests.reduce(
    (res, ele) => ({
      ...res,
      [ele]: true,
    }),
    {}
  )

  const chartLegendProps = {
    iconType: 'circle',
    height: 100,
    payload: legendPayload,
  }

  const barsDataForInternal = selectedPerformanceBand.map((pb, index) => ({
    ...pb,
    key: `bar${index + 1}`,
    insideLabelKey: `inside-label-bar${index + 1}`,
    topLabelKey: `top-label-bar${index + 1}`,
    name: pb.name,
    fill: pb.color,
    stackId: 'a',
    [`bar${index + 1}`]: 1,
  }))

  // use constant EXTERNAL_TEST_TYPES to identify between different external tests
  const barsDataForExternal = achievementLevels.map((al, index) => ({
    ...al,
    key: `bar${index + 1}`,
    insideLabelKey: `inside-label-bar${index + 1}`,
    topLabelKey: `top-label-bar${index + 1}`,
    name: al.name,
    fill: al.color,
    stackId: 'a',
    [`bar${index + 1}`]: Math.floor(100 / achievementLevels.length),
  }))

  const data = chartData.map((d) => {
    if (d.externalTestType) {
      // for external assessments
      const filteredBarsDataForExternal = barsDataForExternal.filter((b) =>
        isMultiSchoolYear
          ? getTestUniqId(b) === d.testId // here d.testId refer testUniqId in case of multiSchoolYear
          : b.testId === d.testId
      )
      const barsCellDataForExternal = filteredBarsDataForExternal.reduce(
        (res, ele) => {
          const barData = d.records.find((r) => r.id == ele.id)
          return {
            ...res,
            [ele.key]: barData.totalGradedPercentage,
            [ele.insideLabelKey]:
              barData.totalGradedPercentage >= 10
                ? `${round(barData.totalGradedPercentage, 0) || 0}%`
                : '',
          }
        },
        {}
      )
      const barsCellAdditionalDataForExternal = barsDataForExternal.reduce(
        (res, ele) => ({
          ...res,
          [ele.key]: {
            fill: ele.fill,
          },
        }),
        {}
      )
      const _topLabelKey = `top-label-bar${barsDataForExternal.length}`
      const score = isNumber(d.averageScore)
        ? round(d.averageScore || 0)
        : d.averageScore
      const topLabelValue = getScoreLabel(score, d)
      return {
        ...d,
        ...barsCellDataForExternal,
        [_topLabelKey]: topLabelValue,
        additionalData: barsCellAdditionalDataForExternal,
      }
    }
    // for internal assessments
    const barsCellDataForInternal = barsDataForInternal.reduce((res, ele) => {
      const barData = d.records.find((r) => r.threshold == ele.threshold)
      return {
        ...res,
        [ele.key]: barData.totalGradedPercentage,
        [ele.insideLabelKey]:
          barData.totalGradedPercentage >= 10
            ? `${round(barData.totalGradedPercentage, 0) || 0}%`
            : '',
      }
    }, {})
    const barsCellAdditionalDataForInternal = barsDataForInternal.reduce(
      (res, ele) => ({
        ...res,
        [ele.key]: {
          fill: ele.fill,
        },
      }),
      {}
    )
    const _topLabelKey = `top-label-bar${barsDataForInternal.length}`
    return {
      ...d,
      ...barsCellDataForInternal,
      [_topLabelKey]: `${round(d.averageScore, 0)}%`,
      additionalData: barsCellAdditionalDataForInternal,
    }
  })

  const handleToggleSelectedBars = (item) => {
    const _selectedTests = toggleItem(selectedTests, item)
    setSelectedTests(_selectedTests)
  }

  const _onResetClickCB = () => {
    setSelectedTests([])
  }

  return (
    <SignedStackedBarWithLineChart
      data={data}
      barsData={
        barsDataForExternal.length > barsDataForInternal.length
          ? barsDataForExternal
          : barsDataForInternal
      }
      xAxisDataKey="testId"
      lineDataKey="lineScore"
      lineProps={chartLineProps}
      getTooltipJSX={getTooltipJSX}
      getRightTooltipJSX={getRightTooltipJSX}
      barsLabelFormatter={barsLabelFormatter}
      yTickFormatter={() => ''}
      yAxisLabel="Distribution of Students (%)"
      getXTickText={getXTickText}
      getXTickTooltipText={getXTickTooltipText}
      getXTickTagText={getXTickTagText}
      filter={selectedTestsFilter}
      onBarClickCB={handleToggleSelectedBars}
      onResetClickCB={_onResetClickCB}
      margin={chartMargin}
      legendProps={chartLegendProps}
      // Set y domain to more than 100 to provide space for bar top labels if legend space is not available.
      yDomain={isEmpty(legendPayload) ? [0, 115] : [0, 100]}
      ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
      pageSize={10}
      hasRoundedBars={false}
      isSignedChart={false}
      hideYAxis={false}
      hideCartesianGrid
      hasBarInsideLabels
      hasBarTopLabels
      showInterventions={showInterventions}
      interventionsData={interventionsData}
      preLabelContent={
        <ChartPreLabelWrapper
          $translate={`20px ${isEmpty(legendPayload) ? '-8px' : '50px'}`}
        >
          <FlexContainer height="0" justifyContent="left">
            <StyledText $fontWeight={600}>
              <div>AVERAGE</div>
              <div>SCORE</div>
            </StyledText>
            <IconCarets.IconCaretRight style={{ fontSize: '35px' }} />
          </FlexContainer>
        </ChartPreLabelWrapper>
      }
    />
  )
}

Chart.propTypes = {
  chartData: PropTypes.array.isRequired,
  selectedPerformanceBand: PropTypes.array.isRequired,
  selectedTests: PropTypes.array,
  setSelectedTests: PropTypes.func,
}

Chart.defaultProps = {
  selectedTests: [],
  setSelectedTests: () => {},
}

export default Chart
