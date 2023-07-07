import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { InputNumber } from 'antd'
import { cloneDeep, isEmpty } from 'lodash'
import { ThemeProvider } from 'styled-components'
import { EduIf } from '@edulastic/common'

import { math } from '@edulastic/constants'

import { themes } from '../../../../../../theme'
import MathFormulaAnswerMethod from '../../../../../../assessment/widgets/MathFormula/components/MathFormulaAnswerMethod'
import { EXACT_MATCH } from '../../../../../../assessment/constants/constantsForQuestions'
import {
  QuestionFormWrapper,
  FormGroup,
  Points,
} from '../../common/QuestionForm'
import VideoQuizStimulus from '../common/VideoQuizStimulus'
import { getFormattedTimeInMinutesAndSeconds } from '../../../../../../assessment/utils/timeUtils'

const { methods, simplifiedOptions } = math

const QuestionMath = ({
  onUpdate,
  question,
  aiGeneratedQuestion = {},
  isSnapQuizVideo,
  generateViaAI,
  isGeneratingAIQuestion,
  type,
}) => {
  const toggleAdditional = (val) => {
    onUpdate({ showAdditional: val })
  }

  const handleAnswerChange = (prop, value) => {
    const { validation, extraOpts = {} } = question

    const newExtraOpts = { ...extraOpts }
    const nextValidation = cloneDeep(validation)
    if (prop === 'options') {
      value.isSimplified = false
      simplifiedOptions.forEach((key) => {
        if (value[key]) {
          value.isSimplified = true
          newExtraOpts[key] = value[key]
          delete value[key]
        } else if (newExtraOpts[key]) {
          delete newExtraOpts[key]
        }
      })
      if (!value.isSimplified) {
        delete value.isSimplified
      }
    }

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
      extraOpts: newExtraOpts,
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

  const updateQuestionWithAIData = () => {
    const { correctAnswer, name = '', displayAtSecond } = aiGeneratedQuestion
    // TODO: correct answer not loading in math input
    if (correctAnswer) {
      handleAnswerChange('value', `${correctAnswer}`)
    } else {
      handleAnswerChange('value', '')
    }

    const updateData = {
      stimulus:
        typeof displayAtSecond === 'number'
          ? `[At ${getFormattedTimeInMinutesAndSeconds(
              displayAtSecond * 1000
            )}] ${name}`
          : name,
    }
    onUpdate(updateData)
  }

  useEffect(() => {
    if (isEmpty(aiGeneratedQuestion) || !isSnapQuizVideo) {
      return
    }
    updateQuestionWithAIData()
  }, [aiGeneratedQuestion])

  const { stimulus = '' } = question
  const { validResponse } = question.validation
  const { score } = validResponse
  const value = validResponse.value[0]

  return (
    <ThemeProvider theme={themes.default}>
      <QuestionFormWrapper key={question.id}>
        <EduIf condition={isSnapQuizVideo}>
          <FormGroup>
            <VideoQuizStimulus
              stimulus={stimulus}
              generateViaAI={generateViaAI}
              loading={isGeneratingAIQuestion}
              onUpdate={onUpdate}
              type={type}
            />
          </FormGroup>
        </EduIf>
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
            extraOptions={question.extraOpts}
          />
        </FormGroup>
        <FormGroup>
          <InputNumber
            min={0}
            value={score}
            onChange={handleScoreChange}
            data-cy="points"
          />
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
