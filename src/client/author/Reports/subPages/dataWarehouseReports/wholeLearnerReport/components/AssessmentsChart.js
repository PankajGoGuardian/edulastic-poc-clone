import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { reportUtils } from '@edulastic/constants'
import { round, get, isArray } from 'lodash'
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

const getXTickTagText = (payload, _data) => {
  return _data[payload.index]?.externalTestType || ''
}

const interventionsData = [
  {
    _id: '6442caecfd8f7451449779e5',
    interventionCriteria: {
      applicableTo: {
        testTypes: ['homework'],
        subjects: ['Computer Science'],
      },
      target: {
        measureType: 'averageScore',
        metric: '10',
      },
    },
    studentGroupIds: ['6440f9b3f469bb458ffe6f98'],
    relatedGoalIds: ['6442bc6dfd8f7451449779e4'],
    termId: '6380b568070dd1000810a161',
    name: 'Test 111',
    type: 'academic',
    owner: 'Test 111',
    description: 'Test 111',
    startDate: 1682035200000,
    endDate: 1682640000000,
    comment: 'Test 111',
    createdBy: '6380b641c7c5680008011311',
    districtId: '6380b567070dd1000810a15b',
    userRole: 'district-admin',
    status: 'IN_PROGRESS',
    createdAt: 1682098924540,
    updatedAt: 1682098924540,
    __v: 0,
    active: 1,
  },
  {
    _id: '6442ad14fd8f7451449779e2',
    interventionCriteria: {
      applicableTo: {
        testTypes: ['common assessment'],
        subjects: ['Mathematics'],
      },
      target: {
        measureType: 'averageScore',
        metric: '10',
      },
    },
    studentGroupIds: ['6440f9b3f469bb458ffe6f98'],
    relatedGoalIds: ['644264549c2136c892a98089'],
    termId: '6380b568070dd1000810a161',
    name: 'Test 098890',
    type: 'academic',
    startDate: 1682035200000,
    endDate: 1682726400000,
    createdBy: '6380b641c7c5680008011311',
    districtId: '6380b567070dd1000810a15b',
    userRole: 'district-admin',
    status: 'FULLY_EXECUTED',
    createdAt: 1682091284342,
    updatedAt: 1682866523619,
    __v: 0,
    baseline: '65.2996326203987',
    current: {
      value: '65.2996326203987',
    },
    active: 1,
  },
  {
    _id: '64429eeb7f602623c5b25a8c',
    interventionCriteria: {
      applicableTo: {
        testTypes: ['quiz'],
        subjects: ['Social Studies'],
      },
      target: {
        measureType: 'averageScore',
        metric: '90',
      },
    },
    studentGroupIds: ['6440f9b3f469bb458ffe6f98'],
    relatedGoalIds: ['64425d13f853353e6423a7d0'],
    termId: '6380b568070dd1000810a161',
    name: 'Test',
    type: 'academic',
    startDate: 1680307200000,
    endDate: 1682035200000,
    createdBy: '6380b641c7c5680008011311',
    districtId: '6380b567070dd1000810a15b',
    userRole: 'district-admin',
    status: 'IN_PROGRESS',
    createdAt: 1682087659851,
    updatedAt: 1682087659851,
    __v: 0,
    active: 1,
  },
  {
    _id: '644292582c5686e429c61857',
    interventionCriteria: {
      applicableTo: {
        testTypes: ['common assessment'],
        subjects: ['Other Subjects'],
      },
      target: {
        measureType: 'minimumScore',
        metric: '89',
      },
    },
    studentGroupIds: ['6440f9b3f469bb458ffe6f98'],
    relatedGoalIds: ['644288ccd69bc6d31cec52e1'],
    termId: '6380b568070dd1000810a161',
    name: 'asdad',
    type: 'academic',
    owner: 'asdasd',
    startDate: 1680912000000,
    endDate: 1682035200000,
    comment: 'asdasd',
    createdBy: '6380b641c7c5680008011311',
    districtId: '6380b567070dd1000810a15b',
    userRole: 'district-admin',
    status: 'IN_PROGRESS',
    createdAt: 1682084440247,
    updatedAt: 1682084440247,
    __v: 0,
    active: 1,
  },
  {
    _id: '64428e862c5686e429c61856',
    interventionCriteria: {
      applicableTo: {
        testTypes: ['common assessment'],
        subjects: ['Mathematics'],
      },
      target: {
        measureType: 'averageScore',
        metric: '90',
      },
    },
    studentGroupIds: ['6440f9b3f469bb458ffe6f98'],
    relatedGoalIds: ['644288ccd69bc6d31cec52e1'],
    termId: '6380b568070dd1000810a161',
    name: '9876 Inte',
    type: 'academic',
    startDate: 1677801600000,
    endDate: 1685491200000,
    comment: '9876 Inte',
    createdBy: '6380b641c7c5680008011311',
    districtId: '6380b567070dd1000810a15b',
    userRole: 'district-admin',
    status: 'IN_PROGRESS',
    createdAt: 1682083462785,
    updatedAt: 1685000367282,
    __v: 0,
    baseline: '65.2996326203987',
    current: {
      value: '65.4603606516773',
    },
    active: 1,
  },
  {
    _id: '644263c87ce4662a5b081bf3',
    interventionCriteria: {
      applicableTo: {
        testTypes: ['common assessment'],
        subjects: ['Mathematics'],
      },
      target: {
        measureType: 'minimumScore',
        metric: '35',
      },
    },
    studentGroupIds: ['6440f9b3f469bb458ffe6f98'],
    relatedGoalIds: ['64425e647ce4662a5b081bf2'],
    termId: '6380b568070dd1000810a161',
    name: 'Sub Intervention for Dev testing goals',
    type: 'academic',
    owner: 'Dhyan',
    description: 'Dev Testing',
    startDate: 1680307200000,
    endDate: 1682294400000,
    comment: 'Attached to goals',
    createdBy: '6380b641c7c5680008011311',
    districtId: '6380b567070dd1000810a15b',
    userRole: 'district-admin',
    status: 'FULLY_EXECUTED',
    createdAt: 1682072520794,
    updatedAt: 1682605152923,
    __v: 0,
    baseline: '37.9746835443038',
    current: {
      value: '37.9746835443038',
    },
    active: 1,
  },
  {
    _id: '6442571d4ba3006f876b41f5',
    interventionCriteria: {
      applicableTo: {
        testTypes: ['assessment'],
        subjects: ['Mathematics'],
      },
      target: {
        measureType: 'minimumScore',
        metric: '8',
      },
    },
    studentGroupIds: ['6440f9b3f469bb458ffe6f98'],
    relatedGoalIds: ['644255c84ba3006f876b41f4'],
    termId: '6380b568070dd1000810a161',
    name: 'new intervention ',
    type: 'academic',
    startDate: 1682035200000,
    endDate: 1682726400000,
    createdBy: '6380b641c7c5680008011311',
    districtId: '6380b567070dd1000810a15b',
    userRole: 'district-admin',
    status: 'FULLY_EXECUTED',
    createdAt: 1682069277611,
    updatedAt: 1682866523903,
    __v: 0,
    baseline: '50',
    current: {
      value: '50',
    },
    active: 1,
  },
]

const getInterventionsGroup = (
  currentAssessmentDate,
  aheadAssessmentDate,
  interventions
) => {
  if (
    isArray(interventions) &&
    interventions.length &&
    currentAssessmentDate &&
    aheadAssessmentDate
  ) {
    return interventions.filter(({ endDate }) => {
      return endDate < +currentAssessmentDate && endDate > +aheadAssessmentDate
    })
  }
  return []
}
const withHasInterventions = (data) => {
  return data.map((item, index) => {
    const { assignmentDate: currentAssessmentDate } = get(data, [index], {})
    const { assignmentDate: aheadAssessmentDate } = get(data, [index + 1], {})
    return {
      ...item,
      interventionsGroup: getInterventionsGroup(
        currentAssessmentDate,
        aheadAssessmentDate,
        interventionsData
      ),
    }
  })
}

const AssessmentsChart = ({
  chartData,
  selectedPerformanceBand,
  onBarClickCB,
  onResetClickCB,
  preLabelContent,
  showInterventions,
}) => {
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
    return [_barsDataForExternal, withHasInterventions(_chartData)]
  }, [chartData, barsDataForInternal])

  return (
    <div>
      <SectionLabel $margin="32px 0 -20px 0" style={{ fontSize: '18px' }}>
        Performance Summary across Assessments
      </SectionLabel>
      <SignedStackedBarChart
        data={data}
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
        showInterventions={showInterventions}
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
