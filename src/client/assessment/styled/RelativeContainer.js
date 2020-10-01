import styled from 'styled-components'

export const RelativeContainer = styled.div`
  margin: 0 auto;
  position: relative;
  width: ${({ containerWidth }) =>
    containerWidth ? `${containerWidth}px` : '100%'};
`
