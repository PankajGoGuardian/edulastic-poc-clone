import styled from 'styled-components'

export const FlexItem = styled.div`
  flex-grow: ${({ flexGrow }) => flexGrow || 0};
  padding: ${({ padding }) => padding};
  max-width: ${({ maxWidth }) => maxWidth};
`
