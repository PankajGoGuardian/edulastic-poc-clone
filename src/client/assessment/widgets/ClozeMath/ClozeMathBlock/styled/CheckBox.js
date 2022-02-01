import styled from 'styled-components'
import { response as responseConstant } from '@edulastic/constants'
import { white } from '@edulastic/colors'

export const CheckBox = styled.div`
  display: inline-flex;
  position: relative;
  width: ${(props) => props.width || 'auto'};
  height: ${(props) => props.height || 'auto'};
  min-height: ${(props) => props.height || '32px'};
  min-width: ${(props) => props.width || '140px'};
  max-height: ${responseConstant.mathInputMaxHeight};
  margin: 0px 2px 0px 2px;
  align-items: center;
  border-radius: 2px;
  padding-right: 24px;
  vertical-align: middle;
  background: ${({ theme, fillColor, isPrintPreview }) =>
    isPrintPreview ? white : fillColor || theme.checkbox.noAnswerBgColor};
  color: ${({ theme }) => theme.checkbox.textColor};
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ fontWeight }) => fontWeight};
  text-indent: 0;
  .index {
    background: ${({ indexBgColor }) => indexBgColor};
  }

  .mq-math-mode {
    border: 0px;
  }

  .index {
    min-width: 30px;
    color: ${white};
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    border-bottom-left-radius: 2px;
    border-top-left-radius: 2px;
    font-size: ${({ fontSize }) => fontSize || '14px'};
    font-weight: ${({ fontWeight }) => fontWeight};
  }

  .value {
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`
