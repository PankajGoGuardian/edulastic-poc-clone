import React from 'react'
import PropTypes from 'prop-types'
import { InputNumber } from 'antd'

import { EXACT_MATCH } from '../../../../../../../assessment/constants/constantsForQuestions'
import {
  QuestionFormWrapper,
  FormGroup,
  Points,
  FormLabel,
} from '../../../../styled-components/QuestionForm'
import VideoQuizStimulus from '../common/VideoQuizStimulus'
import VideoQuizTimePicker from '../common/VideoQuizTimePicker'

const getDefaultState = (question) => {
  const { validation, uiStyle, id: qId } = question
  const {
    validResponse: { score },
  } = validation
  const { numberOfRows = 10 } = uiStyle
  return {
    qId,
    score,
    numberOfRows,
  }
}
export default class QuestionEssay extends React.Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    videoRef: PropTypes.object.isRequired,
  }

  state = {
    qId: '',
    score: 1,
    numberOfRows: 1,
  }

  componentDidMount() {
    const { question } = this.props
    this.setState(getDefaultState(question))
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { qId } = prevState
    const { question: nextQuestion } = nextProps
    if (nextQuestion && nextQuestion.id !== qId) {
      return getDefaultState(nextQuestion)
    }
    return null
  }

  handleScoreChange = (_score) => {
    const { numberOfRows } = this.state
    const { onUpdate } = this.props
    // eslint-disable-next-line no-restricted-properties
    const score = window.isNaN(_score) || !_score ? 0 : _score
    this.setState({ score }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score,
          },
        },
        uiStyle: {
          numberOfRows,
        },
      }
      onUpdate(data)
    })
  }

  changeNumberOfRows = (numberOfRows) => {
    const { score } = this.state
    const { onUpdate } = this.props

    this.setState({ numberOfRows }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score,
          },
        },
        uiStyle: {
          numberOfRows,
        },
      }
      onUpdate(data)
    })
  }

  render() {
    const { score, numberOfRows = 1 } = this.state
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
        <FormGroup>
          <InputNumber
            min={1}
            value={numberOfRows}
            onChange={this.changeNumberOfRows}
            data-cy="minHeightOption"
          />
          <Points>Minimum Line height</Points>
        </FormGroup>
        <FormGroup>
          <InputNumber
            min={0}
            value={score}
            onChange={this.handleScoreChange}
            data-cy="points"
          />
          <Points>Points</Points>
        </FormGroup>
        <FormGroup style={{ marginTop: 9 }} data-cy="videoQuizTimePicker">
          <FormLabel>Timestamp (mm:ss)</FormLabel>
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
