import React from 'react'
import PropTypes from 'prop-types'
import InputNumber from "antd/es/input-number";
import { cloneDeep } from 'lodash'
import { ThemeProvider } from 'styled-components'

import { math } from '@edulastic/constants'

import { themes } from '../../../../../../theme'
import MathFormulaAnswerMethod from '../../../../../../assessment/widgets/MathFormula/components/MathFormulaAnswerMethod'
import { EXACT_MATCH } from '../../../../../../assessment/constants/constantsForQuestions'
import {
  QuestionFormWrapper,
  FormGroup,
  Points,
} from '../../common/QuestionForm'

const { methods } = math

const QuestionMath = ({ onUpdate, question }) => {
  const toggleAdditional = (val) => {
    onUpdate({ showAdditional: val })
  }

  const handleAnswerChange = (prop, value) => {
    const { validation } = question
    const nextValidation = cloneDeep(validation)
    if (
      prop === 'method' &&
      nextValidation.validResponse.value[0][prop] !== value
    ) {
      nextValidation.validResponse.value[0] = {
        [prop]: value,
      }
    } else {
      nextValidation.validResponse.value[0][prop] = value
    }

    if (prop === 'value') {
      const isNumeric = (v) => /^\d+$/.test(v)

      if (!isNumeric(value)) {
        delete nextValidation?.validResponse?.value?.[0]?.options
          ?.significantDecimalPlaces
      }
    }

    if (
      [
        methods.IS_SIMPLIFIED,
        methods.IS_FACTORISED,
        methods.IS_EXPANDED,
        methods.IS_TRUE,
        methods.EQUIV_SYNTAX,
      ].includes(nextValidation.validResponse.value[0].method)
    ) {
      delete nextValidation.validResponse.value[0].value
    }

    const data = {
      validation: nextValidation,
    }

    onUpdate(data)
  }

  const handleScoreChange = (_score) => {
    const { validResponse } = question.validation
    // eslint-disable-next-line no-restricted-properties
    const score = window.isNaN(_score) || !_score ? 0 : _score
    const data = {
      validation: {
        scoringType: EXACT_MATCH,
        validResponse: {
          ...validResponse,
          score,
        },
        altResponses: [],
      },
    }

    onUpdate(data)
  }

  const onChangeAllowedOptions = (option, variables) => {
    onUpdate({
      [`${option}`]: variables,
    })
  }

  const onChangeKeypad = (keypad) => {
    const data = {
      symbols: [keypad],
    }
    onUpdate(data)
  }

  const { validResponse } = question.validation
  const { score } = validResponse
  const value = validResponse.value[0]

  return (
    <ThemeProvider theme={themes.default}>
      <QuestionFormWrapper>
        <FormGroup>
          <MathFormulaAnswerMethod
            labelValue="Correct Answer"
            allowedVariables={question.allowedVariables || ''}
            allowNumericOnly={question.allowNumericOnly}
            onChange={handleAnswerChange}
            onChangeAllowedOptions={onChangeAllowedOptions}
            onChangeKeypad={onChangeKeypad}
            item={question}
            index={0}
            toggleAdditional={toggleAdditional}
            style={{ width: '250px' }}
            isDocbasedSection
            {...value}
          />
        </FormGroup>
        <FormGroup>
          <InputNumber min={0} value={score} onChange={handleScoreChange} />
          <Points>Points</Points>
        </FormGroup>
      </QuestionFormWrapper>
    </ThemeProvider>
  )
}

export default QuestionMath

QuestionMath.propTypes = {
  question: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
}
