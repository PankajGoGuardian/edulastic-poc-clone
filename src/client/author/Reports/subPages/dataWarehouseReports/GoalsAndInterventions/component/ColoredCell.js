import React from 'react'
import styled from 'styled-components'

const ColoredCell = ({ value, bgColor }) => {
  console.log(value)
  return <Container style={{ background: bgColor }}>{value}</Container>
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 34px;
`

export default ColoredCell
