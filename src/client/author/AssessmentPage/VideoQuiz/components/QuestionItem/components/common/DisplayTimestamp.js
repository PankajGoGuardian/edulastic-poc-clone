import React from 'react'
import { StyledTimeStampContainer } from '../../../../styled-components/QuestionItem'

const DisplayTimestamp = ({ timestamp }) => {
  return (
    <StyledTimeStampContainer>
      <span>Display question at: </span>
      {timestamp}
    </StyledTimeStampContainer>
  )
}

export default DisplayTimestamp
