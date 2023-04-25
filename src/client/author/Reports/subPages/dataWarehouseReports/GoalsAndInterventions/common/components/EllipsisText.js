import React from 'react'
import styled from 'styled-components'

const EllipsisText = ({ children, lines = 2 }) => {
  return (
    <StyledSpan title={children} $lines={lines.toString()}>
      {children}
    </StyledSpan>
  )
}

const StyledSpan = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  @supports (-webkit-line-clamp: ${(props) => props.$lines}) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: initial;
    display: -webkit-box;
    -webkit-line-clamp: ${(props) => props.$lines};
    -webkit-box-orient: vertical;
  }
`

export default EllipsisText
