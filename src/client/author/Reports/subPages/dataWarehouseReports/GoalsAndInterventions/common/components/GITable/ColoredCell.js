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
  width: fit-content;
  padding: 0 10px;
  height: 34px;
  margin: 0 auto;
`

export default ColoredCell
