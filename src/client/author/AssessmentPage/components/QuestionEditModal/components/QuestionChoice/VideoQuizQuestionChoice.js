import React from 'react'
import { Input, InputNumber } from 'antd'
import { arrayMove } from 'react-sortable-hoc'
import uuid from 'uuid/v4'
import { EduButton, helpers } from '@edulastic/common'
import { FormGroup, FormLabel } from '../../common/QuestionForm'
import Options from './Components/Options'

const { TextArea } = Input

const VideoQuizQuestionChoice = ({ question, updateQuestionData }) => {
  const { options = [], validation = {}, stimulus = '' } = question
  const {
    validResponse: { score = 1, value: correctAnswers = [] } = {},
  } = validation

  const handleStimulusChange = (value) => {
    const updateData = {
      stimulus: value,
    }
    updateQuestionData(updateData)
  }

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

  return (
    <>
      <FormGroup>
        <FormLabel>Stimulus</FormLabel>
        <TextArea
          style={{ height: 120, resize: 'none' }}
          onChange={(e) => handleStimulusChange(e?.target?.value || '')}
          placeholder="Enter your question"
          value={stimulus}
        />
      </FormGroup>
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
