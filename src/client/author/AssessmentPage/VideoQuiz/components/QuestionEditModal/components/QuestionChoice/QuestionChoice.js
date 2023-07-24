import React from 'react'
import PropTypes from 'prop-types'
import { Input, InputNumber, Radio } from 'antd'
import { throttle, isArray } from 'lodash'

import { inputBgGrey, inputBorder } from '@edulastic/colors'
import { EduIf, EduElse, EduThen } from '@edulastic/common'
import { EXACT_MATCH } from '../../../../../../../assessment/constants/constantsForQuestions'
import {
  QuestionFormWrapper,
  FormGroup,
  FormLabel,
  Points,
  CheckboxGroupStyled,
} from '../../../../styled-components/QuestionForm'
import VideoQuizQuestionChoice from './VideoQuizQuestionChoice'
import VideoQuizStimulus from '../common/VideoQuizStimulus'
import VideoQuizTimePicker from '../common/VideoQuizTimePicker'

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

  render() {
    const { optionsValue, correctAnswers, score } = this.state
    const { question, onUpdate, updateAnnotationTime } = this.props
    const {
      options,
      title,
      stimulus = '',
      questionDisplayTimestamp = null,
      id,
    } = question
    const trueOrFalse = title === 'True or false'

    return (
      <QuestionFormWrapper>
        <FormGroup>
          <VideoQuizStimulus stimulus={stimulus} onUpdate={onUpdate} />
        </FormGroup>
        <EduIf condition={!trueOrFalse}>
          <EduThen>
            <VideoQuizQuestionChoice
              question={question}
              updateQuestionData={onUpdate}
              updateAnnotationTime={updateAnnotationTime}
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
              <EduIf condition={trueOrFalse}>
                <FormGroup style={{ marginTop: 9 }}>
                  <FormLabel>Timestamp (mm:ss)</FormLabel>
                  <VideoQuizTimePicker
                    questionId={id}
                    questionDisplayTimestamp={questionDisplayTimestamp}
                    updateQuestionData={onUpdate}
                    updateAnnotationTime={updateAnnotationTime}
                  />
                </FormGroup>
              </EduIf>
            </FormGroup>
          </EduElse>
        </EduIf>
      </QuestionFormWrapper>
    )
  }
}
