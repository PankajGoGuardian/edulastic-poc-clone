import styled, { css } from 'styled-components'
import { white } from '@edulastic/colors'

const boxBgColor = css`
  background: ${({ fillColor, isPrintPreview }) => {
    if (isPrintPreview) return white
    return fillColor
  }};
`

export const AnswerBox = styled.div`
  display: flex;
  cursor: pointer;
  border-radius: 4px;
  height: 100%;
  ${boxBgColor};

  .text {
    padding-left: 8px;
  }
`
