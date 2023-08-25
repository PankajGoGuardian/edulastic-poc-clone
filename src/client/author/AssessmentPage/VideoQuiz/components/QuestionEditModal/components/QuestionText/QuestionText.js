import React from 'react'
import PropTypes from 'prop-types'
import {
  notification,
  TextInputStyled,
  SelectInputStyled,
  NumberInputStyled,
  CheckboxLabel,
  FieldLabel,
  EduButton,
} from '@edulastic/common'
import { throttle } from 'lodash'
import produce from 'immer'

import { IconTrash, IconAddStudents } from '@edulastic/icons'
import {
  EXACT_MATCH,
  CONTAINS,
} from '../../../../../../../assessment/constants/constantsForQuestions'
import {
  QuestionFormWrapper,
  FormInline,
  FormGroup,
} from '../../../../styled-components/QuestionForm'
import VideoQuizStimulus from '../common/VideoQuizStimulus'
import VideoQuizTimePicker from '../common/VideoQuizTimePicker'

export default class QuestionText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      answer: '',
      score: 1,
      allow: EXACT_MATCH,
      matchCase: false,
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
      altResponses,
      validResponse: { value, score, matchingRule, matchCase },
    } = validation

    this.setState({
      answer: value,
      altResponses,
      score,
      matchCase,
      allow: matchingRule || EXACT_MATCH,
    })
  }

  handleSetAnswer = ({ target: { value } }) => {
    const { score, allow, altResponses } = this.state
    const { onUpdate } = this.props

    this.setState({ answer: value }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            value,
            score,
            matchingRule: allow,
          },
          altResponses,
        },
      }

      onUpdate(data)
    })
  }

  handleScoreChange = (_score) => {
    const { answer, allow, altResponses } = this.state
    const { onUpdate } = this.props
    // eslint-disable-next-line no-restricted-properties
    const score = window.isNaN(_score) || !_score ? 0 : _score
    const newAltResponses = produce(altResponses, (draft) => {
      draft = draft.map((resp) => ({ ...resp, score }))
      return draft
    })
    this.setState({ score, altResponses: newAltResponses }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            value: answer,
            score,
            matchingRule: allow,
          },
          altResponses: newAltResponses,
        },
      }

      onUpdate(data)
    })
  }

  handleAllowChange = (allow) => {
    const { score, answer, altResponses } = this.state
    const { onUpdate } = this.props

    const newAltResponses = produce(altResponses, (draft) => {
      draft = draft.map((resp) => ({ ...resp, matchingRule: allow }))
      return draft
    })

    this.setState({ allow, altResponses: newAltResponses }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            value: answer,
            score,
            matchingRule: allow,
          },
          altResponses: newAltResponses,
        },
      }
      onUpdate(data)
    })
  }

  handleMatchCaseChange = (e) => {
    const { onUpdate } = this.props
    const { allow, score, answer, altResponses } = this.state
    const { checked } = e.target

    const newAltResponses = produce(altResponses, (draft) => {
      draft = draft.map((resp) => ({ ...resp, matchCase: checked }))
      return draft
    })

    this.setState({ matchCase: checked, altResponses: newAltResponses }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score,
            value: answer,
            matchCase: checked,
            matchingRule: allow,
          },
          altResponses: newAltResponses,
        },
      }
      onUpdate(data)
    })
  }

  handleCreateAltResponse = () => {
    const { altResponses, score, allow, answer } = this.state
    if (!answer) {
      return notification({ messageKey: 'answerChoiceShouldNotBeEmpty' })
    }
    altResponses.push({
      value: '',
      score,
      matchingRule: allow,
    })
    this.setState({ altResponses })
  }

  handleSetAltAnswer = (index, { target: { value } }) => {
    const { altResponses, answer, score, allow } = this.state
    const { onUpdate } = this.props
    const newAltResponses = produce(altResponses, (draft) => {
      draft[index] = { ...draft[index], value }
      return draft
    })

    this.setState({ altResponses: newAltResponses }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            value: answer,
            score,
            matchingRule: allow,
          },
          altResponses: newAltResponses,
        },
      }
      onUpdate(data)
    })
  }

  handleRemoveAltResponse = (index) => {
    const { altResponses, answer, score, allow } = this.state
    const { onUpdate } = this.props

    const newAltResponses = produce(altResponses, (draft) => {
      draft.splice(index, 1)
      return draft
    })
    this.setState({ altResponses: newAltResponses }, () => {
      const data = {
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            value: answer,
            score,
            matchingRule: allow,
          },
          altResponses: newAltResponses,
        },
      }
      onUpdate(data)
    })
  }

  render() {
    const { answer, score, allow, altResponses = [], matchCase } = this.state
    const { question, onUpdate, updateAnnotationTime, videoRef } = this.props
    const { stimulus = '', questionDisplayTimestamp = null, id } = question

    return (
      <QuestionFormWrapper>
        <FormGroup>
          <VideoQuizStimulus stimulus={stimulus} onUpdate={onUpdate} />
        </FormGroup>
        <FormGroup>
          <FieldLabel>Correct Answer</FieldLabel>
          <FormInline>
            <TextInputStyled
              value={answer}
              onChange={throttle(this.handleSetAnswer, 2000)}
              data-cy="correctAnswer"
            />
            <EduButton
              IconBtn
              isGhost
              height="32px"
              onClick={this.handleCreateAltResponse}
            >
              <IconAddStudents />
            </EduButton>
          </FormInline>
        </FormGroup>
        {altResponses.map((altResp, index) => (
          <FormGroup key={index}>
            <FieldLabel>Alternate Answer {index + 1}</FieldLabel>
            <FormInline>
              <TextInputStyled
                value={altResp.value}
                onChange={throttle(
                  (val) => this.handleSetAltAnswer(index, val),
                  2000
                )}
                data-cy="alternateAnswer"
              />
              <EduButton
                IconBtn
                isGhost
                height="32px"
                onClick={() => this.handleRemoveAltResponse(index)}
              >
                <IconTrash />
              </EduButton>
            </FormInline>
          </FormGroup>
        ))}
        <FormInline>
          <FormGroup width="50%">
            <FieldLabel>Allow</FieldLabel>
            <SelectInputStyled
              value={allow}
              height="32px"
              onChange={this.handleAllowChange}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              data-cy="allowDropDownSelect"
            >
              <SelectInputStyled.Option key={1} value={EXACT_MATCH}>
                Exact Match
              </SelectInputStyled.Option>
              <SelectInputStyled.Option key={2} value={CONTAINS}>
                Any Text Containing
              </SelectInputStyled.Option>
            </SelectInputStyled>
          </FormGroup>
          <FormGroup width="50%" ml="16px" pt="26px">
            <FieldLabel display="inline" mr="16px">
              Match Case
            </FieldLabel>
            <CheckboxLabel
              checked={matchCase}
              onChange={this.handleMatchCaseChange}
              data-cy="matchCase"
            />
          </FormGroup>
        </FormInline>
        <FormInline>
          <FormGroup width="50%">
            <FieldLabel>Points</FieldLabel>
            <NumberInputStyled
              min={0}
              value={score}
              width="100%"
              onChange={this.handleScoreChange}
              data-cy="points"
            />
          </FormGroup>
          <FormGroup width="50%" ml="16px">
            <FieldLabel>Timestamp (mm:ss)</FieldLabel>
            <VideoQuizTimePicker
              videoRef={videoRef}
              questionDisplayTimestamp={questionDisplayTimestamp}
              updateQuestionData={onUpdate}
              updateAnnotationTime={updateAnnotationTime}
              questionId={id}
            />
          </FormGroup>
        </FormInline>
      </QuestionFormWrapper>
    )
  }
}

QuestionText.propTypes = {
  question: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  videoRef: PropTypes.object.isRequired,
}
