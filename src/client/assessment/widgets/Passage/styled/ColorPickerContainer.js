import { Icon } from 'antd'
import styled from 'styled-components'
import { white, black, red, blue } from '@edulastic/colors'

export const ColorPickerContainer = styled.div`
  z-index: 900;
  padding: 8px 16px;
  background: ${white};
  box-shadow: 0 2px 8px #00000090;
  border-radius: 4px;
  user-select: none;
  transition: opacity 0.3s;

  &::after {
    position: absolute;
    content: '';
    border: 10px solid;
    border-top-color: white;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
  }
`

export const Overlay = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 2;
`

export const BackSlashIcon = styled(Icon)`
  font-size: 30px;
  transform: translate(-10%, -10%) rotate(-45deg);
  color: ${red};
`

export const ColorButton = styled.div`
  height: 25px;
  width: 25px;
  margin-right: 5px;
  border-radius: 4px;
  border: 1px solid;
  cursor: pointer;

  &:hover {
    border-color: ${blue};
  }

  ${({ color, active }) => `
    background: ${color || white};
    border-color: ${active ? blue : color || black};
  `}
`
