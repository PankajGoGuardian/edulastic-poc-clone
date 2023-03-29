import React from 'react'
import styled from 'styled-components'

const chartWrapWidth = 300

export const HorizontalStackedBarChart = ({ data = [] }) => {
  return (
    <CellWrap>
      <ChartWrap>
        {data.map((item) => (
          <ChartBar bgColor={item.color} width={item.value}>
            {item.value}%
          </ChartBar>
        ))}
      </ChartWrap>
    </CellWrap>
  )
}

export const StudentBand = ({ data = {} }) => {
  return (
    <Band color={data.color}>
      {data.name} {data.value ? `${data.value}%` : ''}
    </Band>
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
  height: 35px;
  text-align: center;
  padding: 10px 0px;
  @media print {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
`

const Band = styled.div`
  background: ${(props) => props.color};
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media print {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
`
