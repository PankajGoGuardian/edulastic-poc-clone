import styled from "styled-components";
import { math } from "@edulastic/constants";

const {
  KeyboardSize: { width, height }
} = math;

export const Item = styled.div`
  width: ${width}px;
  height: ${height}px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid ${props => props.theme.numberPad.itemBorderColor};
  border-bottom: 1px solid ${props => props.theme.numberPad.itemBorderColor};
  color: ${props => props.theme.numberPad.itemColor};
  font-weight: ${props => props.theme.numberPad.itemFontWeight};
  background: ${props => props.theme.numberPad.itemBgColor};
  cursor: pointer;
  user-select: none;

  :hover {
    background: ${props => props.theme.numberPad.itemBgHoverColor};
  }

  :active {
    background: ${props => props.theme.numberPad.itemBgActiveColor};
  }
`;
