import styled from 'styled-components'

export const CheckboxContainer = styled.span`
  p {
    margin-bottom: 0px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: block;
    max-width: ${({ width, showAnswer }) =>
      width
        ? showAnswer
          ? `${parseInt(width, 10) - 60}px`
          : `${parseInt(width, 10) - 30}px`
        : 'auto'};
  }
`
