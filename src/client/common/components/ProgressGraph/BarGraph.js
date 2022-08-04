import React, { useMemo, useState } from 'react'
import { ticks } from 'd3-array'
import { Legends } from '@edulastic/common'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'
import {
  white,
  dropZoneTitleColor,
  secondaryTextColor,
  themeColor,
  greyThemeLight,
} from '@edulastic/colors'
import CustomBar from './CustomBar'
import { BarGraphWrapper, BarLegendContainer, ChartNavButton } from './styled'
import { NUMBER_OF_BARS, bars, convertData } from './helpers'

const BarGraph = ({
  questionActivities,
  testItems,
  onClickBar,
  isGreyBar,
  testActivityStatus,
}) => {
  const [page, setPage] = useState(0)
  const [maxAttemps, maxTimeSpent, data] = useMemo(
    () => convertData(questionActivities, testItems, testActivityStatus),
    [questionActivities, testItems, testActivityStatus]
  )
  const renderData = data.slice(
    page * NUMBER_OF_BARS,
    page * NUMBER_OF_BARS + NUMBER_OF_BARS
  )

  const handleClick = ({ itemId, index, qid }) => {
    let nextItemIndex = testItems.findIndex((item) => item._id === itemId)
    if (nextItemIndex === -1) {
      nextItemIndex = index
    }
    onClickBar(nextItemIndex, itemId, qid)
  }

  const prevBars = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }

  const nextBars = () => {
    if (page * NUMBER_OF_BARS + NUMBER_OF_BARS < data.length) {
      setPage(page + 1)
    }
  }

  const optionalBarColor = useMemo(
    () => (isGreyBar ? { fill: greyThemeLight } : {}),
    [isGreyBar]
  )

  return (
    <BarGraphWrapper>
      <ChartNavButton
        type="primary"
        shape="circle"
        icon="caret-left"
        size="large"
        className="navigator navigator-left"
        onClick={prevBars}
        show={page > 0}
      />
      <ChartNavButton
        data-cy="lcbnextButton"
        type="primary"
        shape="circle"
        icon="caret-right"
        size="large"
        className="navigator navigator-right"
        show={data.length > page * NUMBER_OF_BARS + NUMBER_OF_BARS}
        onClick={nextBars}
      />

      <BarLegendContainer>
        <Legends />
      </BarLegendContainer>

      <ResponsiveContainer width="99%" height={240}>
        <ComposedChart barGap={1} barSize={36} data={renderData}>
          <XAxis
            dataKey="name"
            tickSize={0}
            dy={8}
            tick={{
              fontSize: '10px',
              strokeWidth: 2,
              fill: secondaryTextColor,
            }}
            padding={{ left: 20, right: 20 }}
            cursor="pointer"
            onClick={handleClick}
          />
          <YAxis
            domain={[0, maxAttemps + Math.ceil((10 / 100) * maxAttemps)]}
            yAxisId="left"
            allowDecimals={false}
            label={{
              value: 'ATTEMPTS',
              dx: -10,
              angle: -90,
              fill: dropZoneTitleColor,
              fontSize: '10px',
            }}
          />
          <YAxis
            yAxisId="right"
            domain={[0, maxTimeSpent + Math.ceil((10 / 100) * maxTimeSpent)]}
            allowDecimals={false}
            label={{
              value: 'AVG TIME (SECONDS)',
              angle: -90,
              dx: 20,
              fill: dropZoneTitleColor,
              fontSize: '10px',
            }}
            orientation="right"
            ticks={ticks(0, maxTimeSpent + 10000, 10)}
            tickFormatter={(val) => Math.round(val / 1000)}
          />

          {Object.keys(bars).map((key) => (
            <Bar
              {...bars[key]}
              {...optionalBarColor}
              key={bars[key].dataKey}
              shape={<CustomBar dataKey={bars[key].dataKey} />}
              onClick={handleClick}
            />
          ))}

          {!isGreyBar && (
            <Line
              yAxisId="right"
              dataKey="timeSpent"
              stroke={themeColor}
              strokeWidth="3"
              type="monotone"
              dot={{ stroke: themeColor, strokeWidth: 6, fill: white }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </BarGraphWrapper>
  )
}

export default BarGraph
