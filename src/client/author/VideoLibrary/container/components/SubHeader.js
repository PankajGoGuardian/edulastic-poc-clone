import { FlexContainer } from '@edulastic/common'
import React from 'react'
import styled from 'styled-components'

const VideoLibrarySubHeader = () => {
  return (
    <FlexContainer padding="16px 0 16px 90px" justifyContent="flex-start">
      <StyledSubHeader>Browse Video Quiz Libraries</StyledSubHeader>
    </FlexContainer>
  )
}

export default VideoLibrarySubHeader

const StyledSubHeader = styled.p`
  color: #434b5d;
  font-family: 'Open Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 150% */
  letter-spacing: -0.16px;
`
