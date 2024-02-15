import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { reportUtils } from '@edulastic/constants'
import { round } from 'lodash'
import { EduIf } from '@edulastic/common'
import { SignedStackedBarChart } from '../../../../common/components/charts/customSignedStackedBarChart'
import {
  TooltipRow,
  TooltipRowTitle,
  TooltipRowValue,
  DashedHr,
  ColorCircle,
  ColorBandRow,
} from '../../../../common/styled'
import SectionLabel from '../../../../common/components/SectionLabel'
import {
  getLegendPayload,
  getBarsDataForInternal,
  getBarsDataForExternal,
  getAssessmentChartData,
} from '../utils'
import { useResetAnimation } from '../../../../common/hooks/useResetAnimation'
import { Spacer } from '../../../../../../common/styled'
import { getXTickTagText, getXTickTooltipText } from '../../common/utils'

const { formatDate } = reportUtils.common

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
    let colorBandComponent = null
    if (barData.externalTestType) {
      const achievementLevels = [...barData.achievementLevelBands].reverse()
      colorBandComponent = (
        <>
          <TooltipRowItem title={`${achievementLevels.length} color band`} />
          {achievementLevels.map((band) => (
            <ColorBandItem
              highlight={band.active}
              color={band.color}
              name={band.name}
            />
          ))}
        </>
      )
    } else {
      colorBandComponent = (
        <ColorBandItem color={barData.band.color} name={barData.band.name} />
      )
    }
    return (
      <div>
        <TooltipRowItem
          title="Date:"
          value={formatDate(barData.assignmentDate)}
        />
        <TooltipRowItem
          title="Score:"
          value={
            barData.externalTestType
              ? barData.totalScore
              : `${round(barData.averageScore, 2)}%`
          }
        />
        <EduIf condition={barData.termName}>
          <TooltipRowItem title="School Year:" value={barData.termName} />
        </EduIf>
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
  return _data[payload.index]?.testName || '-'
}

// print width for chart for A4 size & in landscape mode
const PRINT_WIDTH = 1500

const AssessmentsChart = ({
  isPrinting,
  chartData,
  settings,
  selectedPerformanceBand,
  onBarClickCB,
  onResetClickCB,
  preLabelContent,
  showInterventions,
  interventionsData,
  sectionLabelFilters,
}) => {
  // NOTE workaround to fix labels not rendering due to interrupted animation
  // ref: https://github.com/recharts/react-smooth/issues/44
  const [animate, onAnimationStart, setAnimate] = useResetAnimation()

  useEffect(() => setAnimate(true), [chartData])

  const [legendPayload, barsDataForInternal] = useMemo(
    () => [
      getLegendPayload(selectedPerformanceBand),
      getBarsDataForInternal(selectedPerformanceBand),
    ],
    [selectedPerformanceBand]
  )

  const [barsDataForExternal, data] = useMemo(() => {
    const _barsDataForExternal = getBarsDataForExternal(chartData)
    const _chartData = getAssessmentChartData(
      chartData,
      _barsDataForExternal,
      barsDataForInternal
    )
    return [_barsDataForExternal, _chartData]
  }, [chartData, barsDataForInternal])

  return (
    <div>
      <SectionLabel
        $margin="32px 0 0 0"
        style={{ fontSize: '18px' }}
        sectionLabelFilters={sectionLabelFilters}
        wrapperStyle={{ alignItems: 'flex-end' }}
        separator={<Spacer />}
      >
        Performance Summary across Assessments
      </SectionLabel>
      <SignedStackedBarChart
        width={isPrinting ? PRINT_WIDTH : '100%'}
        data={data}
        settings={settings}
        barsData={
          barsDataForExternal.length >= 1
            ? barsDataForExternal
            : barsDataForInternal
        }
        xAxisDataKey="pScore"
        getTooltipJSX={getTooltipJSX}
        barsLabelFormatter={barsLabelFormatter}
        yTickFormatter={() => ''}
        yAxisLabel="Assessment Performance"
        getXTickText={getXTickText}
        getXTickTooltipText={getXTickTooltipText}
        getXTickTagText={getXTickTagText}
        filter={{}}
        onBarClickCB={onBarClickCB}
        onResetClickCB={onResetClickCB}
        margin={{ top: 0, right: 20, left: 20, bottom: 40 }}
        legendProps={{
          iconType: 'circle',
          height: 50,
          payload: legendPayload,
        }}
        yDomain={[0, 100]}
        ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
        pageSize={10}
        hasRoundedBars={false}
        isSignedChart={false}
        hideYAxis={false}
        hideCartesianGrid
        hasBarInsideLabels
        hasBarTopLabels
        preLabelContent={preLabelContent}
        interventionsData={interventionsData}
        showInterventions={showInterventions}
        animate={animate}
        onAnimationStart={onAnimationStart}
        setAnimate={setAnimate}
      />
    </div>
  )
}

AssessmentsChart.propTypes = {
  chartData: PropTypes.array.isRequired,
  selectedPerformanceBand: PropTypes.array.isRequired,
  onBarClickCB: PropTypes.func,
  onResetClickCB: PropTypes.func,
}

AssessmentsChart.defaultProps = {
  onResetClickCB: () => {},
  onBarClickCB: () => {},
}

export default AssessmentsChart
