import { EduButton, EduIf, helpers, notification } from '@edulastic/common'
import { Col, Icon, Input, InputNumber, Row, Spin } from 'antd'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { arrayMove } from 'react-sortable-hoc'
import { compose } from 'redux'
import uuid from 'uuid/v4'
import { isEmpty } from 'lodash'
import {
  fetchAIGeneratedQuestionAction,
  setAIGeneratedQuestionStateAction,
} from '../../../../../src/actions/aiGenerateQuestion'
import { FormGroup, FormLabel } from '../../common/QuestionForm'
import Options from './Components/Options'
import { RightAlignedCol } from './styled-components'

const { TextArea } = Input

const VideoQuizQuestionChoice = ({
  question,
  updateQuestionData,
  videoUrl,
  fetchAIGeneratedQuestion,
  aiGenerateQuestionState,
  setAIGeneratedQuestionState,
}) => {
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

  const updateQuestionWithAIData = (aiGeneratedQuestion = {}) => {
    if (isEmpty(aiGeneratedQuestion)) {
      return notification({
        type: 'error',
        msg: 'Error generating question via AI',
      })
    }
    const {
      name = '',
      options: questionOptions = [],
      correctAnswerIndex = null,
    } = aiGeneratedQuestion

    const _options = (questionOptions || []).map((option) => {
      const { name: optionLabel = '' } = option || {}
      return {
        value: uuid(),
        label: optionLabel,
      }
    })

    const questionCorrectAnswers = []
    if (typeof correctAnswerIndex === 'number') {
      const optionIndexUUID = _options[correctAnswerIndex]?.value || ''
      if (optionIndexUUID?.length) {
        questionCorrectAnswers.push(optionIndexUUID)
      }
    } else if (Array.isArray(correctAnswerIndex) && correctAnswerIndex.length) {
      correctAnswerIndex.forEach((index) => {
        const optionIndexUUID = _options[index]?.value || ''
        if (optionIndexUUID?.length) {
          questionCorrectAnswers.push(optionIndexUUID)
        }
      })
    }

    const updateData = {
      stimulus: name,
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

  const generateViaAI = () => {
    fetchAIGeneratedQuestion({
      videoUrl,
      studentGrade: 5,
      questionCount: 1,
    })
  }

  const { apiStatus, result } = aiGenerateQuestionState || {}

  const loading = apiStatus === 'INITIATED'

  useEffect(() => {
    if (apiStatus && !loading) {
      setAIGeneratedQuestionState({
        apiStatus: false,
        result,
      })
    }
  }, [apiStatus])

  useEffect(() => {
    if (apiStatus) {
      setAIGeneratedQuestionState({
        apiStatus: false,
        result,
      })
    }
  }, [])

  useEffect(() => {
    if (result?.length) {
      updateQuestionWithAIData(result[0])
    }
  }, [result])

  return (
    <>
      <FormGroup>
        <Row gutter={16}>
          <Col span={12}>
            <FormLabel>Stimulus</FormLabel>
          </Col>
          <RightAlignedCol span={12}>
            <a onClick={() => generateViaAI()}>Generate via AI</a>
            <EduIf condition={loading}>
              <Spin size="small" indicator={<Icon type="loading" />} />
            </EduIf>
          </RightAlignedCol>
        </Row>
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

const enhance = compose(
  connect(
    (state) => ({
      videoUrl: state.tests.entity.videoUrl,
      aiGenerateQuestionState: state.aiGenerateQuestionState,
    }),
    {
      setAIGeneratedQuestionState: setAIGeneratedQuestionStateAction,
      fetchAIGeneratedQuestion: fetchAIGeneratedQuestionAction,
    }
  )
)

export default enhance(VideoQuizQuestionChoice)
