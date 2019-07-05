import styled from "styled-components";

export const SymbolsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: ${({ cols, isAll }) => `${isAll ? cols * 65 + 20 : cols * 65}px`}; /* 20 is scrollbar width */
  height: ${`${65 * 4}px`};
  flex-direction: ${({ isAll }) => (isAll ? "row" : "column")};
  overflow-y: auto;
`;

export const Symbol = styled.div`
  width: 65px;
  height: 65px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid ${props => props.theme.keyboard.buttonBorderColor};
  border-bottom: 1px solid ${props => props.theme.keyboard.buttonBorderColor};
  color: ${props => props.theme.keyboard.buttonColor};
  font-weight: ${props => props.theme.keyboard.buttonFontWeight};
  background: ${props => props.theme.keyboard.buttonBgColor};
  cursor: pointer;
  user-select: none;

  :hover {
    background: ${props => props.theme.keyboard.buttonBgHoverColor};
  }

  :active {
    background: ${props => props.theme.keyboard.buttonBgActiveColor};
  }
`;
