import React from 'react'
import styled from 'styled-components'
import { backgroundGrey, black } from '@edulastic/colors'

const SectionDescription = ({ content }) => {
  return (
    <StlyedDescriptionContainer>
      <p>{content}</p>
    </StlyedDescriptionContainer>
  )
}

const StlyedDescriptionContainer = styled.div`
  width: 100%;
  background-color: ${backgroundGrey};
  border-radius: 5px;
  padding-left: 10px;
  margin-bottom: 15px;
  p {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 33px;
    color: ${black};
  }
`

export default SectionDescription
