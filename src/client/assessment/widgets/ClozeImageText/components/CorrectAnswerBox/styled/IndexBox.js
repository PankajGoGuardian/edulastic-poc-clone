import styled from 'styled-components'

export const IndexBox = styled.div`
  width: 40px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  ${({ theme }) => `
    background: ${theme.widgets.clozeImageText.indexBoxBgColor};
    color: ${theme.widgets.clozeImageText.indexBoxColor};
    font-size: ${theme.widgets.clozeImageText.indexBoxFontWeight};
    font-weight: ${theme.widgets.clozeImageText.indexBoxFontWeight};
  `}
`
