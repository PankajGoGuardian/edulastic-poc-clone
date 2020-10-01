import styled from 'styled-components'

export const FullWidthContainer = styled.div`
  width: ${({ isVertical }) => (isVertical ? null : '100%')};
  margin-right: 0;
`
