import styled from "styled-components";

export const SymbolsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 400px;
  max-height: 200px;
  overflow-y: auto;
`;

export const Symbol = styled.div`
  width: calc(100% / 3);
  height: 50px;
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
