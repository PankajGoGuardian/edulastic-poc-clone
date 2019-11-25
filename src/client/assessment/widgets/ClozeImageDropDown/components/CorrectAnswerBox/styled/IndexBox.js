import styled from "styled-components";

export const IndexBox = styled.div`
  width: 40px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  ${({ theme }) => `
    background: ${theme.widgets.clozeImageDropDown.indexBoxBgColor};
    color: ${theme.widgets.clozeImageDropDown.indexBoxColor};
    font-size: ${theme.widgets.clozeImageDropDown.indexBoxFontWeight};
    font-weight: ${theme.widgets.clozeImageDropDown.indexBoxFontWeight};
  `}
`;
