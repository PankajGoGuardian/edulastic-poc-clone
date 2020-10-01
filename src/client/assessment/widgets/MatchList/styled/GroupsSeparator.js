import styled from 'styled-components'

export const GroupsSeparator = styled.div`
  width: ${({ horizontallyAligned }) => (horizontallyAligned ? '100%' : 0)};
  margin: ${({ horizontallyAligned }) =>
    horizontallyAligned ? '35px 0 0 0' : '0 35px'};
  border-left: ${({ theme, horizontallyAligned }) =>
    horizontallyAligned
      ? 'none'
      : `1px solid ${theme.widgets.matchList.groupSeparatorBorderColor}`};
  border-top: ${({ theme, horizontallyAligned }) =>
    horizontallyAligned
      ? `1px solid ${theme.widgets.matchList.groupSeparatorBorderColor}`
      : 'none'};
`
