import React from 'react'
import styled from 'styled-components'
import { sortDistributionBand } from '../common/utils'

const chartWrapWidth = 300

export const HorizontalStackedBarChart = ({ data = [] }) => {
  const sortedCellData = sortDistributionBand(data)
  return (
    <CellWrap>
      <ChartWrap>
        {sortedCellData.map((item) => (
          <ChartBar
            bgColor={item.color}
            width={item.value}
            key={item.name}
            opacity={0.75}
          >
            <span>{Math.round(item.value)}%</span>
          </ChartBar>
        ))}
      </ChartWrap>
    </CellWrap>
  )
}

export const StudentBand = ({ data = {} }) => {
  return (
    <CellWrap>
      <ChartWrap>
        <ChartBar bgColor={data.color} width={chartWrapWidth} opacity={0.75}>
          {data.name} {data.value ? `${data.value}%` : ''}
        </ChartBar>
      </ChartWrap>
    </CellWrap>
  )
}

const CellWrap = styled.div`
  display: flex;
  justify-content: center;
`
const ChartWrap = styled.div`
  display: flex;
  width: ${chartWrapWidth}px;
`

const ChartBar = styled.div`
  width: ${(props) => (chartWrapWidth / 100) * props.width + 35}px;
  background-color: ${(props) => props.bgColor};
  opacity: ${(props) => props.opacity};
  height: 35px;
  text-align: center;
  padding: 10px 0px;
  @media print {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
`
