import styled from 'styled-components'
import { white } from '@edulastic/colors'

export const AnswerBox = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  cursor: pointer;
  border-radius: 2px;
  width: 100%;
  max-height: ${({ maxHeight }) => maxHeight || ''};
  background: ${({ fillColor, isPrintPreview }) => {
    if (isPrintPreview) return white
    return fillColor
  }};
`
