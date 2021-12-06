import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { white } from '@edulastic/colors'
import MathSpanWrapper from '../../../components/MathSpanWrapper'

const AnswerBoxText = ({ children, fontSize, fontWeight }) => (
  <Text data-cy="correct-answer-box">
    <MathSpanWrapper
      latex={children}
      fontSize={fontSize}
      fontWeight={fontWeight}
    />
  </Text>
)

AnswerBoxText.propTypes = {
  children: PropTypes.string.isRequired,
}

export default AnswerBoxText

const Text = styled.div`
  padding: 8px 20px;
  display: flex;
  align-items: center;
  justify-content: start;
  background: ${white};
  min-width: 80px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ fontWeight }) => fontWeight};
  flex: 1;
`
