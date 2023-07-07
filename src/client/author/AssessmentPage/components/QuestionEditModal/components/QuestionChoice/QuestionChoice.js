import React from 'react'
import PropTypes from 'prop-types'
import { Input, InputNumber, Radio } from 'antd'
import { throttle, isArray, isEmpty, isEqual } from 'lodash'
import { TRUE_OR_FALSE } from '@edulastic/constants/const/questionType'

import { inputBgGrey, inputBorder } from '@edulastic/colors'
import { EduIf, EduElse, EduThen } from '@edulastic/common'
import { EXACT_MATCH } from '../../../../../../assessment/constants/constantsForQuestions'
import {
  QuestionFormWrapper,
  FormGroup,
  FormLabel,
  Points,
  CheckboxGroupStyled,
} from '../../common/QuestionForm'
import VideoQuizQuestionChoice from './VideoQuizQuestionChoice'
import VideoQuizStimulus from '../common/VideoQuizStimulus'
import { TimeStampContainer } from './styled-components'
import { getFormattedTimeInMinutesAndSeconds } from '../../../../../../assessment/utils/timeUtils'

const { Group: RadioGroup } = Radio

const defaultState = {
  optionsValue: '',
  correctAnswers: [],
  score: 1,
}

export default class QuestionChoice extends React.Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
  }

  state = defaultState

  componentDidMount() {
    const { question } = this.props
    this.setDefaultState(question)
  }

  componentDidUpdate(prevProps) {
    const {
      aiGeneratedQuestion = {},
      isSnapQuizVideo = false,
      question,
    } = this.props
    if (!isEqual(aiGeneratedQuestion, prevProps.aiGeneratedQuestion)) {
      const { title } = question
      const trueOrFalse = title === 'True or false'
      if (isEmpty(aiGeneratedQuestion) || !trueOrFalse || !isSnapQuizVideo) {
        return
      }
      this.updateQuestionWithAIData()
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { question: prevQuestion } = this.props
    const { question: nextQuestion } = nextProps

    if (prevQuestion.id !== nextQuestion.id) {
      this.setDefaultState(nextQuestion)
    }
  }

  setDefaultState = (question) => {
    const { options, validation } = question
    const { validResponse } = validation

    this.setState({
      optionsValue: options.map((o) => o.label).join(''),
      score: validResponse.score,
      correctAnswers: validResponse.value,
    })
  }

  handleSetOptions = ({ target: { value } }) => {
    this.setState({ optionsValue: value })

    const { onUpdate } = this.props

    const options = value.trim().replace(/\s/g, '').split('')

    const data = {
      options: options.map((option, index) => ({
        label: option,
        value: index + 1,
      })),
    }

    onUpdate(data)
  }

  handleSetCorrectAnswers = (checked) => {
    const { score } = this.state
    const { onUpdate } = this.props

    this.setState(
      {
        correctAnswers: isArray(checked) ? checked : [checked.target.value],
      },
      () => {
        const data = {
          validation: {
            scoringType: EXACT_MATCH,
            validResponse: {
              value: isArray(checked) ? checked : [checked.target.value],
              score,
            },
            altResponses: [],
          },
          multipleResponses: isArray(checked) ? checked.length > 1 : false,
        }

        onUpdate(data)
      }
    )
  }

  handleSetScore = (_score) => {
    const { correctAnswers } = this.state
    const { onUpdate } = this.props
    // eslint-disable-next-line no-restricted-properties
    const score = window.isNaN(_score) || !_score ? 0 : _score
    this.setState({ score }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            value: correctAnswers,
            score,
          },
          altResponses: [],
        },
        multipleResponses: correctAnswers.length > 1,
      }

      onUpdate(data)
    })
  }

  updateQuestionWithAIData = () => {
    const { question, aiGeneratedQuestion, onUpdate } = this.props
    const { options = [], validation } = question
    const { correctAnswer, name = '', displayAtSecond } = aiGeneratedQuestion
    let updateData = {
      stimulus:
        typeof displayAtSecond === 'number'
          ? `[At ${getFormattedTimeInMinutesAndSeconds(
              displayAtSecond * 1000
            )}] ${name}`
          : name,
    }
    let validAnswer = []
    if (typeof correctAnswer === 'boolean') {
      options.forEach((option) => {
        if (
          option?.value?.length &&
          option?.label?.toUpperCase() === `${correctAnswer}`.toUpperCase()
        ) {
          validAnswer = [option.value]
        }
      })
      if (validAnswer?.length) {
        updateData = {
          ...updateData,
          validation: {
            ...validation,
            validResponse: {
              ...validation.validResponse,
              value: validAnswer,
            },
          },
        }
      }
    }
    this.setState({ correctAnswers: validAnswer }, () => {
      onUpdate(updateData)
    })
  }

  render() {
    const { optionsValue, correctAnswers, score } = this.state
    const {
      type,
      question,
      isSnapQuizVideo,
      onUpdate,
      isGeneratingAIQuestion,
      generateViaAI,
      aiGeneratedQuestion,
    } = this.props
    const { options, title, stimulus = '' } = question
    const trueOrFalse = title === 'True or false'
    const { displayAtSecond } = aiGeneratedQuestion

    return (
      <QuestionFormWrapper>
        <EduIf condition={isSnapQuizVideo}>
          <EduIf condition={typeof displayAtSecond === 'number'}>
            <FormGroup>
              <TimeStampContainer>
                Suggested Timestamp -{' '}
                {getFormattedTimeInMinutesAndSeconds(displayAtSecond * 1000)}
              </TimeStampContainer>
            </FormGroup>
          </EduIf>

          <FormGroup>
            <VideoQuizStimulus
              stimulus={stimulus}
              generateViaAI={generateViaAI}
              loading={isGeneratingAIQuestion}
              onUpdate={onUpdate}
              type={trueOrFalse ? TRUE_OR_FALSE : type}
            />
          </FormGroup>
        </EduIf>
        <EduIf condition={isSnapQuizVideo && !trueOrFalse}>
          <EduThen>
            <VideoQuizQuestionChoice
              question={question}
              updateQuestionData={onUpdate}
              aiGeneratedQuestion={aiGeneratedQuestion}
            />
          </EduThen>
          <EduElse>
            {!trueOrFalse && (
              <FormGroup>
                <FormLabel>Options</FormLabel>
                <Input
                  value={optionsValue}
                  onChange={throttle(this.handleSetOptions, 2000)}
                  autoFocus
                  style={{
                    letterSpacing: '8px',
                    background: inputBgGrey,
                    border: `1px solid ${inputBorder}`,
                    borderRadius: '0px',
                  }}
                  data-cy="options"
                />
              </FormGroup>
            )}
            <FormGroup>
              <FormLabel>Correct Answers</FormLabel>
              {trueOrFalse ? (
                <RadioGroup
                  options={options}
                  value={correctAnswers[0]}
                  onChange={this.handleSetCorrectAnswers}
                />
              ) : (
                <CheckboxGroupStyled
                  options={options}
                  value={correctAnswers}
                  onChange={this.handleSetCorrectAnswers}
                  data-cy="answerLabels"
                />
              )}
              <InputNumber
                min={0}
                value={score}
                onChange={this.handleSetScore}
                data-cy="points"
              />
              <Points>Points</Points>
            </FormGroup>
          </EduElse>
        </EduIf>
      </QuestionFormWrapper>
    )
  }
}
