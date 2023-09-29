import React from 'react'
import {
  mobileWidth,
  mobileWidthMax,
  incorrect,
  yellow1,
  lightGrey9,
  greyLight1,
  brownDark,
} from '@edulastic/colors'
import styled from 'styled-components'

const green = '#5eb500'

const Legends = () => (
  <>
    <LegendItems>
      <LegendItem>
        <LegendIcon color={green} />
        <LegendLabel>CORRECT</LegendLabel>
      </LegendItem>
      <LegendItem>
        <LegendIcon color={incorrect} />
        <LegendLabel>INCORRECT</LegendLabel>
      </LegendItem>
      <LegendItem>
        <LegendIcon color={yellow1} />
        <LegendLabel>PARTIALLY CORRECT</LegendLabel>
      </LegendItem>
      <LegendItem>
        <LegendIcon color={lightGrey9} />
        <LegendLabel>SKIPPED</LegendLabel>
      </LegendItem>
      <LegendItem>
        <LegendIcon color={greyLight1} />
        <LegendLabel>ZERO POINT</LegendLabel>
      </LegendItem>
      <LegendItem>
        <LegendIcon color="rgb(56, 150, 190)" />
        <LegendLabel>MANUALLY GRADED</LegendLabel>
      </LegendItem>
      <LegendItem>
        <LegendIcon color={brownDark} />
        <LegendLabel>ATTEMPTED</LegendLabel>
      </LegendItem>
    </LegendItems>
  </>
)

export const LegendContainer = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: ${mobileWidthMax}) {
    margin-bottom: 10px;
    flex-direction: column;
  }
`

export const LegendItems = styled.div`
  display: flex;

  @media (max-width: ${mobileWidthMax}) {
    order: 2;
  }
  @media (max-width: ${mobileWidth}) {
    flex-wrap: wrap;
    justify-content: center;
  }
`

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 25px;
  &:last-child {
    margin-right: 0px;
  }

  @media (max-width: ${mobileWidth}) {
    margin-top: 10px;
  }
`

export const LegendIcon = styled.div`
  height: 15px;
  width: 15px;
  background-color: ${({ color = '#1FE3A1' }) => color};
  border-radius: 2px;
`

export const LegendLabel = styled.div`
  margin-left: 8px;
  color: #b1b1b1;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 8px;
  white-space: nowrap;
`

export default Legends
