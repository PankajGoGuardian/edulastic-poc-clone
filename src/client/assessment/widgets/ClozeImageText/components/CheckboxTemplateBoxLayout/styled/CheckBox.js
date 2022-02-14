import styled, { css } from 'styled-components'
import { white } from '@edulastic/colors'

const boxBgColor = css`
  background: ${({ fillColor, isPrintPreview }) => {
    if (isPrintPreview) return white
    return fillColor
  }};
`

const indexBoxBgColor = css`
  background: ${({ indexBgColor, isPrintPreview }) => {
    if (isPrintPreview) return white
    return indexBgColor
  }};
`

export const CheckBox = styled.div`
  display: flex;
  border-radius: 4px;
  ${boxBgColor};

  .index {
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    flex-shrink: 0;
    color: ${white};
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    font-weight: ${({ theme }) => theme.semiBold};
    font-size: ${({ theme }) => theme.titleSectionFontSize};
    ${indexBoxBgColor};
  }

  .text {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 16px;
    overflow: hidden;
  }
`
