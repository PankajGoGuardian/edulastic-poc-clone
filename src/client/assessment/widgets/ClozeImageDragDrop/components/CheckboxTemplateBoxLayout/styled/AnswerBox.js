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
  position: relative;
  min-height: ${({ boxHeight }) => (boxHeight ? `${boxHeight}px` : '')};
  overflow: hidden;
  align-items: flex-start;

  .text {
    padding: 0px 8px;
    padding-right: 20px;
  }
`
