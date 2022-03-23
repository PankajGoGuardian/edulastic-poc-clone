import React, { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { withNamespaces } from '@edulastic/localization'
import { FieldLabel } from '@edulastic/common'
import AnswerBoxText from './AnswerBoxText'
import EnabledSettings from '../../../components/EvaluationSettings/EnabledSettings'

const AnswerBox = ({ singleResponseBox, answer, t, uiStyles }) => {
  const [showOpts, setShowOpts] = useState(false)

  return (
    <Container>
      <Answer>
        {!singleResponseBox && (
          <Label
            fontSize={uiStyles?.fontSize}
            fontWeight={uiStyles?.fontWeight}
          >
            {answer.index + 1}
          </Label>
        )}
        <AnswerBoxText
          fontSize={uiStyles?.fontSize}
          fontWeight={uiStyles?.fontWeight}
        >
          {answer.value}
        </AnswerBoxText>
      </Answer>
      {answer.isMath && (
        <OptionsContainer>
          <FieldLabel onClick={() => setShowOpts(!showOpts)}>
            {showOpts
              ? t('component.math.hideEvaluationSettings')
              : t('component.math.showEvaluationSettings')}
          </FieldLabel>
          {showOpts && (
            <EnabledSettings
              options={answer.options}
              method={answer.method}
              allowNumericOnly={answer.allowNumericOnly}
              allowedVariables={answer.allowedVariables}
            />
          )}
        </OptionsContainer>
      )}
    </Container>
  )
}
AnswerBox.propTypes = {
  singleResponseBox: PropTypes.bool.isRequired,
  answer: PropTypes.object.isRequired,
}

export default withNamespaces('assessment')(AnswerBox)

const Container = styled.div`
  display: inline-flex;
  margin-right: 15px;
  min-height: 32px;
  margin-bottom: 10px;
  flex-direction: column;
`
const Answer = styled.div`
  display: inline-flex;
  border: ${({
    theme: {
      answerBox: { borderWidth, borderStyle, borderColor },
    },
  }) => `${borderWidth} ${borderStyle} ${borderColor}`};
  border-radius: ${({
    theme: {
      answerBox: { borderRadius },
    },
  }) => borderRadius};
`

const Label = styled.div`
  width: 32px;
  color: ${({ theme }) => theme.answerBox.indexBoxColor};
  background: ${({ theme }) => theme.answerBox.indexBoxBgColor};
  border-top-left-radius: ${({ theme }) => theme.answerBox.borderRadius};
  border-bottom-left-radius: ${({ theme }) => theme.answerBox.borderRadius};
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ fontWeight }) => fontWeight};
`

const OptionsContainer = styled.div`
  margin-top: 8px;
`
