import styled from 'styled-components'
import { backgrounds, inputBorder, secondaryTextColor } from '@edulastic/colors'

export const Input = styled.input`
  width: ${(props) => props.width}px;
  margin-left: ${(props) => props.marginLeft}px;
  height: 30px;
  padding: 0 0 0 10px;
  outline: 0;
  border-radius: 2px;
  border: 1px solid ${inputBorder};
  color: ${secondaryTextColor};
  font-size: 12px;
  font-weight: 400;
  line-height: 1.38;
  background: ${backgrounds.primary};
`
