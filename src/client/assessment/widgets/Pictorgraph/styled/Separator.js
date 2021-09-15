import styled from 'styled-components'

export const Separator = styled.div`
  width: 0px;
  margin: 8px 0px;
  border-left: 1px solid;
  border-left-color: ${({ theme }) =>
    theme.widgets.classification.separatorBorderColor};
`
