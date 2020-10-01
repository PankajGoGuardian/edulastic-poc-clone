import styled from 'styled-components'
import { math } from '@edulastic/constants'

const {
  KeyboardSize: { width, height },
} = math

export const SymbolsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: ${({ cols, isAll }) =>
    `${
      isAll ? cols * width + 20 : cols * width
    }px`}; /* 20 is scrollbar width */
  height: ${`${width * 4}px`};
  flex-direction: ${({ isAll }) => (isAll ? 'row' : 'column')};
  overflow-y: auto;
`

export const Symbol = styled.div`
  width: ${width}px;
  height: ${height}px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid ${(props) => props.theme.keyboard.buttonBorderColor};
  border-bottom: 1px solid ${(props) => props.theme.keyboard.buttonBorderColor};
  color: ${(props) => props.theme.keyboard.buttonColor};
  font-weight: ${(props) => props.theme.keyboard.buttonFontWeight};
  background: ${(props) => props.theme.keyboard.buttonBgColor};
  cursor: pointer;
  user-select: none;

  :hover {
    background: ${(props) => props.theme.keyboard.buttonBgHoverColor};
  }

  :active {
    background: ${(props) => props.theme.keyboard.buttonBgActiveColor};
  }
`
