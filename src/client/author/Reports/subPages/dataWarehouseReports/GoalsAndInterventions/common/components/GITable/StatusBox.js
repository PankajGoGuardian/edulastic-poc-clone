import React from 'react'
import styled from 'styled-components'
import SummaryTile from './SummaryTile'

const StatusBox = ({ items }) => {
  return (
    <Container className="status-box">
      {items.map((ele, index) => (
        <SummaryTile key={index} {...ele} />
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
