import React from 'react'
import styled from 'styled-components'
import { filterIconColor } from '@edulastic/colors'

const ColoredCell = ({ value, bgColor, color }) => {
  return (
    <Container
      style={{
        background: bgColor || 'transparent',
        color: color || filterIconColor,
      }}
    >
      {value}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 34px;
`

export default ColoredCell
