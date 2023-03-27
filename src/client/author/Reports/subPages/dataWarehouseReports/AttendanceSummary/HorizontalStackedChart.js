import React from 'react'
import styled from 'styled-components'

const HorizontalStackedBarChart = ({ data }) => {
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

export default HorizontalStackedBarChart

const CellWrap = styled.div`
  display: flex;
  justify-content: center;
`
const ChartWrap = styled.div`
  display: flex;
  width: 260px;
`

const ChartBar = styled.div`
  width: ${(props) => 2.6 * props.width + 35}px;
  background-color: ${(props) => props.bgColor};
  height: 35px;
  text-align: center;
  padding: 10px 0px;
`
