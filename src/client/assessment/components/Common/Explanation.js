import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { MathFormulaDisplay } from '@edulastic/common'
import { mainTextColor, backgroundGrey, lightGrey9 } from '@edulastic/colors'
import { getFontSize } from '../../utils/helpers'

const Explanation = (props) => {
  const { question = {}, show, isStudentReport } = props
  const { uiStyle: { fontsize = '' } = {} } = question

  const { sampleAnswer } = question

  return (
    <div
      data-cy="explanation-container"
      style={{ width: isStudentReport ? '63%' : '100%' }}
    >
      {show && (
        <>
          <QuestionLabel isStudentReport={isStudentReport}>
            {isStudentReport && (
              <span style={{ color: '#4aac8b' }}>{question.barLabel}</span>
            )}
            Explanation
          </QuestionLabel>
          <SolutionText isStudentReport={isStudentReport}>
            <MathFormulaDisplay
              fontSize={getFontSize(fontsize)}
              dangerouslySetInnerHTML={{ __html: sampleAnswer }}
            />
          </SolutionText>
        </>
      )}
    </div>
  )
}

Explanation.propTypes = {
  question: PropTypes.object.isRequired,
}

export default Explanation

const QuestionLabel = styled.div`
  color: ${mainTextColor};
  font-weight: 700;
  font-size: 16px;
  padding-top: 1.5rem;
  padding-bottom: 1rem;
  padding-left: ${(props) => (props.isStudentReport ? '0px' : '11px')};
  border-bottom: 0.05rem solid ${backgroundGrey};
`

const SolutionText = styled.div`
  text-align: left;
  margin-top: ${(props) => (props.isStudentReport ? '10px' : '18px')};
  padding-left: ${(props) => (props.isStudentReport ? '0px' : '38px')};
  letter-spacing: 0;
  line-height: 2;
  color: ${lightGrey9};
  opacity: 1;
`
