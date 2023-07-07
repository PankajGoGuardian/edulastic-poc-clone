import { EduButton, helpers } from '@edulastic/common'
import { InputNumber } from 'antd'
import React, { useEffect } from 'react'
import { arrayMove } from 'react-sortable-hoc'
import uuid from 'uuid/v4'
import { isEmpty } from 'lodash'
import { FormGroup, FormLabel } from '../../common/QuestionForm'
import Options from './Components/Options'
import { getFormattedTimeInMinutesAndSeconds } from '../../../../../../assessment/utils/timeUtils'

const VideoQuizQuestionChoice = ({
  question,
  updateQuestionData,
  aiGeneratedQuestion,
}) => {
  const { options = [], validation = {} } = question
  const {
    validResponse: { score = 1, value: correctAnswers = [] } = {},
  } = validation

  const handleOptionChange = (
    optionId,
    value,
    optionIndex,
    isBlurEvent = false
  ) => {
    const updateData = {
      options: options.map((option) => {
        if (option?.value === optionId) {
          if (isBlurEvent && !value?.length) {
            value = helpers.getNumeration(optionIndex, 'uppercase')
          }
          return {
            value: option.value,
            label: value,
          }
        }
        return option
      }),
    }
    updateQuestionData(updateData)
  }

  const handleOptionsSorting = ({ oldIndex, newIndex }) => {
    const updateData = {
      options: arrayMove(options, oldIndex, newIndex),
    }
    updateQuestionData(updateData)
  }

  const handleDeleteOption = (optionId) => {
    let updatedCorrectAnswers = correctAnswers
    if (correctAnswers.includes(optionId)) {
      updatedCorrectAnswers = updatedCorrectAnswers.filter(
        (correctAnswerId) => correctAnswerId !== optionId
      )
    }

    const updateData = {
      options: options.filter((option) => option.value !== optionId),
      validation: {
        ...validation,
        validResponse: {
          ...validation.validResponse,
          value: updatedCorrectAnswers,
        },
      },
      multipleResponses: updatedCorrectAnswers.length > 1,
    }
    updateQuestionData(updateData)
  }

  const handleChangeScore = (value) => {
    value = typeof value === 'number' && value > 0 ? value : 1
    const updateData = {
      validation: {
        ...validation,
        validResponse: {
          ...validation.validResponse,
          score: value,
        },
      },
    }
    updateQuestionData(updateData)
  }

  const handleChangeCorrectAnswers = (optionId) => {
    let updatedCorrectAnswers = correctAnswers
    if (correctAnswers.includes(optionId)) {
      updatedCorrectAnswers = updatedCorrectAnswers.filter(
        (correctAnswerId) => correctAnswerId !== optionId
      )
    } else {
      updatedCorrectAnswers = [...updatedCorrectAnswers, optionId]
    }

    const updateData = {
      validation: {
        ...validation,
        validResponse: {
          ...validation.validResponse,
          value: updatedCorrectAnswers,
        },
      },
      multipleResponses: updatedCorrectAnswers.length > 1,
    }
    updateQuestionData(updateData)
  }

  const handleAddOption = () => {
    const defaultOptionLabel = helpers.getNumeration(
      options?.length || 0,
      'uppercase'
    )
    const updateData = {
      options: [...options, { value: uuid(), label: defaultOptionLabel }],
    }
    updateQuestionData(updateData)
  }

  const updateQuestionWithAIData = (_aiGeneratedQuestion = {}) => {
    if (isEmpty(_aiGeneratedQuestion)) {
      return
    }

    const {
      name = '',
      options: questionOptions = [],
      correctAnswersIndex = [],
      displayAtSecond,
    } = _aiGeneratedQuestion

    const _options = (questionOptions || []).map((option) => {
      const { name: optionLabel = '' } = option || {}
      return {
        value: uuid(),
        label: optionLabel,
      }
    })

    const questionCorrectAnswers = []
    if (Array.isArray(correctAnswersIndex) && correctAnswersIndex.length) {
      correctAnswersIndex.forEach((index) => {
        const optionIndexUUID = _options[index]?.value || ''
        if (optionIndexUUID?.length) {
          questionCorrectAnswers.push(optionIndexUUID)
        }
      })
    }

    const updateData = {
      stimulus:
        typeof displayAtSecond === 'number'
          ? `[At ${getFormattedTimeInMinutesAndSeconds(
              displayAtSecond * 1000
            )}] ${name}`
          : name,
      options: _options,
      validation: {
        ...validation,
        validResponse: {
          ...validation.validResponse,
          value: questionCorrectAnswers,
        },
      },
      multipleResponses: questionCorrectAnswers.length > 1,
    }
    updateQuestionData(updateData)
  }

  useEffect(() => {
    updateQuestionWithAIData(aiGeneratedQuestion)
  }, [aiGeneratedQuestion])

  return (
    <>
      <FormGroup>
        <FormLabel>Set Correct Answer(s)</FormLabel>
        <Options
          options={options}
          handleOptionChange={handleOptionChange}
          onSortEnd={handleOptionsSorting}
          handleDeleteOption={handleDeleteOption}
          handleChangeCorrectAnswers={handleChangeCorrectAnswers}
          correctAnswers={correctAnswers}
          distance={1}
        />
      </FormGroup>
      <FormGroup>
        <EduButton height="28px" ml="0px" onClick={handleAddOption}>
          ADD NEW CHOICE
        </EduButton>
      </FormGroup>
      <FormGroup>
        <FormLabel>Points</FormLabel>
        <InputNumber min={1} value={score} onChange={handleChangeScore} />
      </FormGroup>
    </>
  )
}

export default VideoQuizQuestionChoice
