import styled from 'styled-components'
import { white } from '@edulastic/colors'

export const AnswerBox = styled.div`
  display: inline-flex;
  vertical-align: middle;
  cursor: pointer;
  margin: 0px 4px;
  border-radius: 4px;
  background: ${({ fillColor, isPrintPreview }) => {
    if (isPrintPreview) return white
    return fillColor
  }};
`
