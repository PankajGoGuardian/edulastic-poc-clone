import React from 'react'
import styled from 'styled-components'
import SummaryTile from './SummaryTile'

const StatusBox = ({ items }) => {
  return (
    <Container>
      {items.map((ele) => (
        <SummaryTile {...ele} />
      ))}
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  border: 1px solid #d8d8d8;
  border-radius: 7px;
  padding: 12px;
`

export default StatusBox
