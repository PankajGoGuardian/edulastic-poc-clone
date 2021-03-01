import React from 'react'
import styled from 'styled-components'
import { convertToMathTemplate } from '@edulastic/common/src/utils/mathUtils'
import { MathFormulaDisplay } from '@edulastic/common'
import { white } from '@edulastic/colors'
import { IconWrapper } from './styled/IconWrapper'

const AnswerBox = ({
  userAnswer,
  indexStr,
  inPopover,
  showIndex,
  lessMinWidth,
  fillColor,
  indexBgColor,
  mark,
  ...rest
}) => (
  <Container data-cy="answer-box" {...rest} fillColor={fillColor}>
    {showIndex && (
      <IndexBox data-cy="index" bgColor={indexBgColor}>
        {indexStr}
      </IndexBox>
    )}
    <AnswerContent
      inPopover={inPopover}
      dangerouslySetInnerHTML={{
        __html: convertToMathTemplate(userAnswer) || '',
      }}
    />
    {mark && (
      <IconWrapper data-cy="icon-wrapper" rightPosition={lessMinWidth ? 1 : 8}>
        {mark}
      </IconWrapper>
    )}
  </Container>
)
export default AnswerBox

const Container = styled.div`
  display: inline-flex;
  position: relative;
  vertical-align: middle;
  cursor: pointer;
  border-radius: 4px;
  color: ${({ theme }) => theme.checkbox.textColor};
  background: ${({ fillColor, isPrintPreview }) => {
    if (isPrintPreview) return white
    return fillColor
  }};
`

const AnswerContent = styled(MathFormulaDisplay)`
  overflow: hidden;
  padding: 8px 10px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  display: inline-block;
  vertical-align: middle;
  line-height: 1.2;
  ${({ showIndex, inPopover }) => `
    max-width: ${showIndex ? 560 : 600}px;
    width: ${showIndex ? 'calc(100% - 60px)' : '100%'};
    padding-right: ${showIndex ? 5 : 20}px;
    text-overflow: ${inPopover ? '' : 'ellipsis'};
    white-space: ${inPopover ? '' : 'nowrap'};
  `}
`

const IndexBox = styled.div`
  width: 32px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  ${({ theme, bgColor }) => `
    background: ${bgColor};
    color: ${theme.widgets.clozeDropDown.indexBoxColor};
    font-size: ${theme.widgets.clozeDropDown.indexBoxFontSize};
    font-weight: ${theme.widgets.clozeDropDown.indexBoxFontWeight};
  `}
`
