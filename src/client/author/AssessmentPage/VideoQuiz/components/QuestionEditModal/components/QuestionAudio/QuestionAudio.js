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
      audioTimeLimitInMinutes: maxAudioDurationLimit,
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
    const {
      validation,
      audioTimeLimitInMinutes = maxAudioDurationLimit,
    } = question
    const {
      validResponse: { score },
    } = validation

    this.setState({
      score,
      audioTimeLimitInMinutes,
    })
  }

  handleScoreChange = (_score) => {
    const { onUpdate } = this.props
    _score = Number.isNaN(_score) || !_score ? 0 : _score

    this.setState({ score: _score }, () => {
      const data = {
        validation: {
          validResponse: {
            score: _score,
          },
        },
      }
      onUpdate(data)
    })
  }

  handleChangeAudioLimit = (value) => {
    const { onUpdate } = this.props
    this.setState({ audioTimeLimitInMinutes: value }, () => {
      const data = {
        audioTimeLimitInMinutes: value,
      }
      onUpdate(data)
    })
  }

  render() {
    const { score, audioTimeLimitInMinutes } = this.state
    const {
      question: { stimulus = '', questionDisplayTimestamp = null, id },
      onUpdate,
      updateAnnotationTime,
      videoRef,
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
              onChange={this.handleChangeAudioLimit}
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
              onChange={this.handleScoreChange}
              data-cy="points"
            />
          </FormGroup>
        </FormInline>
        <FormGroup style={{ marginTop: 9 }} data-cy="videoQuizTimePicker">
          <FieldLabel>Timestamp (mm:ss)</FieldLabel>
          <VideoQuizTimePicker
            videoRef={videoRef}
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
  videoRef: PropTypes.object.isRequired,
}
