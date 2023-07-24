import { FieldLabel, NumberInputStyled } from '@edulastic/common'
import PropTypes from 'prop-types'
import React from 'react'

import { maxAudioDurationLimit } from '../../../../../../../assessment/widgets/AudioResponse/constants'
import {
  FormGroup,
  FormInline,
  QuestionFormWrapper,
} from '../../../../styled-components/QuestionForm'
import VideoQuizStimulus from '../common/VideoQuizStimulus'
import VideoQuizTimePicker from '../common/VideoQuizTimePicker'

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

  render() {
    const { score, audioTimeLimitInMinutes } = this.state
    const {
      question: { stimulus = '', questionDisplayTimestamp = null, id },
      onUpdate,
      updateAnnotationTime,
    } = this.props

    return (
      <QuestionFormWrapper>
        <FormGroup>
          <VideoQuizStimulus stimulus={stimulus} onUpdate={onUpdate} />
        </FormGroup>
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
        <FormGroup style={{ marginTop: 9 }}>
          <FieldLabel>Timestamp (mm:ss)</FieldLabel>
          <VideoQuizTimePicker
            questionDisplayTimestamp={questionDisplayTimestamp}
            updateQuestionData={onUpdate}
            updateAnnotationTime={updateAnnotationTime}
            questionId={id}
          />
        </FormGroup>
      </QuestionFormWrapper>
    )
  }
}

QuestionAudio.propTypes = {
  question: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
}
