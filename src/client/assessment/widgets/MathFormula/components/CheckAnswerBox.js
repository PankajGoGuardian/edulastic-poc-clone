import React from 'react'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { greyThemeLight } from '@edulastic/colors'
import { MathFormulaDisplay } from '@edulastic/common'
import MathInputWrapper from '../styled/MathInputWrapper'
import MathSpanWrapper from '../../../components/MathSpanWrapper'
import { getEvalautionColor } from '../../../utils/evaluation'

const CheckAnswerBox = ({
  isStatic,
  answer,
  minWidth,
  minHeight,
  evaluation,
  answerScore,
}) => {
  const attempt = !isEmpty(answer)
  const correct = !isEmpty(evaluation) && evaluation?.some((ie) => ie)

  const { fillColor, mark } = getEvalautionColor(
    answerScore,
    correct,
    attempt,
    correct
  )

  if (isStatic) {
    return (
      <MathInputWrapper
        minWidth={minWidth}
        bg={fillColor}
        data-cy="answer-display"
      >
        <MathInputSpan minHeight={minHeight}>
          <MathFormulaDisplay
            dangerouslySetInnerHTML={{
              __html: answer,
            }}
          />
        </MathInputSpan>
        {mark && <IconWrapper>{mark}</IconWrapper>}
      </MathInputWrapper>
    )
  }

  return (
    <MathInputWrapper
      minWidth={minWidth}
      bg={fillColor}
      data-cy="answer-display"
    >
      <MathInputSpan minHeight={minHeight}>
        <MathSpanWrapper latex={answer} />
      </MathInputSpan>
      {mark && <IconWrapper>{mark}</IconWrapper>}
    </MathInputWrapper>
  )
}

export default CheckAnswerBox

const MathInputSpan = styled.div`
  align-items: center;
  min-width: ${({ width }) => (width ? 'unset' : '80px')};
  min-height: ${({ minHeight }) => minHeight || '40px'};
  display: inline-flex;
  width: ${({ width }) => width || '100%'};
  position: relative;
  border-radius: 5px;
  border: 1px solid ${greyThemeLight};
  padding: 5px 25px 5px 10px;
`

const IconWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 6px;
  bottom: 0;
  z-index: 100;
  display: flex;
  pointer-events: none;
  align-items: center;
`
