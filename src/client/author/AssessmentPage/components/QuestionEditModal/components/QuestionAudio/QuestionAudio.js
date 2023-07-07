import { FieldLabel, NumberInputStyled, EduIf } from '@edulastic/common'
import PropTypes from 'prop-types'
import React from 'react'
import { isEmpty, isEqual } from 'lodash'

import { maxAudioDurationLimit } from '../../../../../../assessment/widgets/AudioResponse/constants'
import {
  FormGroup,
  FormInline,
  QuestionFormWrapper,
} from '../../common/QuestionForm'
import VideoQuizStimulus from '../common/VideoQuizStimulus'
import { getFormattedTimeInMinutesAndSeconds } from '../../../../../../assessment/utils/timeUtils'

export default class QuestionAudio extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      score: 1,
      audioTimeLimitInMinutes: 5,
    }
  }

  componentDidMount() {
    const { question } = this.props
    this.setDefaultState(question)
  }

  componentDidUpdate(prevProps) {
    const { aiGeneratedQuestion = {}, isSnapQuizVideo = false } = this.props
    if (!isEqual(aiGeneratedQuestion, prevProps.aiGeneratedQuestion)) {
      if (isEmpty(aiGeneratedQuestion) || !isSnapQuizVideo) {
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
    const { validation } = question
    const {
      validResponse: { score },
    } = validation

    this.setState({
      score,
    })
  }

  handleChange = (_score, _audioTimeLimitInMinutes) => {
    const { onUpdate } = this.props
    _score = Number.isNaN(_score) || !_score ? 0 : _score

    this.setState(
      { score: _score, audioTimeLimitInMinutes: _audioTimeLimitInMinutes },
      () => {
        const data = {
          validation: {
            validResponse: {
              score: _score,
              audioTimeLimitInMinutes: _audioTimeLimitInMinutes,
            },
          },
        }
        onUpdate(data)
      }
    )
  }

  updateQuestionWithAIData = () => {
    const { aiGeneratedQuestion, onUpdate } = this.props
    const { name = '', displayAtSecond } = aiGeneratedQuestion
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

  render() {
    const { score, audioTimeLimitInMinutes } = this.state
    const {
      question: { stimulus = '' },
      generateViaAI,
      isGeneratingAIQuestion,
      onUpdate,
      isSnapQuizVideo,
      type,
    } = this.props

    return (
      <QuestionFormWrapper>
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
        <FormInline>
          <FormGroup width="50%">
            <FieldLabel>MAXIMUM RESPONSE DURATION ALLOWED</FieldLabel>
            <NumberInputStyled
              value={audioTimeLimitInMinutes}
              height="32px"
              onChange={(value) => this.handleChange(score, value)}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              data-cy="audioTimeLimitInMinutes"
              min={1}
              max={maxAudioDurationLimit}
              step={1}
            />
          </FormGroup>
          <FormGroup width="50%" ml="16px">
            <FieldLabel>Points</FieldLabel>
            <NumberInputStyled
              min={0}
              value={score}
              width="100%"
              onChange={(value) =>
                this.handleChange(value, audioTimeLimitInMinutes)
              }
              data-cy="points"
            />
          </FormGroup>
        </FormInline>
      </QuestionFormWrapper>
    )
  }
}

QuestionAudio.propTypes = {
  question: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
}
