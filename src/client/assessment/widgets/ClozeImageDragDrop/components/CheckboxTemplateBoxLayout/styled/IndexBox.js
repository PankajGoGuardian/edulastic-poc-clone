import styled from 'styled-components'

export const IndexBox = styled.div`
  width: 32px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  flex-shrink: 0;
  ${({ theme, bgColor }) => `
    background: ${bgColor};
    color: ${theme.widgets.clozeText.indexBoxColor};
    font-size: ${theme.widgets.clozeText.indexBoxFontSize};
    font-weight: ${theme.widgets.clozeText.indexBoxFontWeight};
  `}
`
