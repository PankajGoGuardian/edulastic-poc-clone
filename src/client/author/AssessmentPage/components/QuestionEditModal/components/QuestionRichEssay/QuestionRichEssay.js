import React from 'react'
import PropTypes from 'prop-types'
import { InputNumber } from 'antd'

import { EXACT_MATCH } from '../../../../../../assessment/constants/constantsForQuestions'
import {
  QuestionFormWrapper,
  FormGroup,
  Points,
} from '../../common/QuestionForm'

const getDefaultState = (question) => {
  const { validation, uiStyle, id: qId } = question
  const {
    validResponse: { score },
  } = validation
  const { height = 200 } = uiStyle
  return {
    qId,
    score,
    height,
  }
}
export default class QuestionRichEssay extends React.Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
  }

  state = {
    qId: '',
    score: 1,
    height: 200,
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
    const { height } = this.state
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
          height,
        },
      }
      onUpdate(data)
    })
  }

  changeHeight = (height) => {
    const { score } = this.state
    const { onUpdate } = this.props

    this.setState({ height }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score,
          },
        },
        uiStyle: {
          height,
        },
      }
      onUpdate(data)
    })
  }

  render() {
    const { score, height = 200 } = this.state
    return (
      <QuestionFormWrapper>
        <FormGroup>
          <InputNumber
            min={1}
            value={height}
            onChange={this.changeHeight}
            data-cy="minHeightOption"
          />
          <Points>Height</Points>
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
      </QuestionFormWrapper>
    )
  }
}
