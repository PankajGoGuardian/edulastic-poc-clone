import React from 'react'
import PropTypes from 'prop-types'
import { Select, InputNumber, Button } from 'antd'
import { isEmpty, isEqual } from 'lodash'
import { arrayMove } from 'react-sortable-hoc'
import { ThemeProvider } from 'styled-components'
import { EduIf } from '@edulastic/common'

import { themes } from '../../../../../../theme'
import { EXACT_MATCH } from '../../../../../../assessment/constants/constantsForQuestions'
import SortableList from '../../../../../../assessment/components/SortableList'
import {
  QuestionFormWrapper,
  FormGroup,
  FormLabel,
  Points,
} from '../../common/QuestionForm'
import VideoQuizStimulus from '../common/VideoQuizStimulus'
import { getFormattedTimeInMinutesAndSeconds } from '../../../../../../assessment/utils/timeUtils'

export default class QuestionDropdown extends React.Component {
  static propTypes = {
    question: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
  }

  state = {
    value: '',
    score: 1,
  }

  static defaultProps = {
    question: {
      options: {
        0: ['A', 'B'],
      },
      validation: {
        validResponse: {
          score: 1,
          value: [],
        },
        altResponses: [],
      },
    },
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

  get currentOptions() {
    const {
      question: { options },
    } = this.props
    return [...options[0]]
  }

  handleSortEnd = ({ oldIndex, newIndex }) => {
    const nextOptions = arrayMove(this.currentOptions, oldIndex, newIndex)

    this.updateOptions(nextOptions)
  }

  handleAdd = () => {
    const nextOptions = this.currentOptions
    nextOptions.push(`New Choice ${nextOptions.length + 1}`)

    this.updateOptions(nextOptions)
  }

  handleRemove = (itemIndex) => {
    const nextOptions = this.currentOptions
    const removingValue = nextOptions[itemIndex]
    const validValue = this.props.question?.validation?.validResponse
      ?.value?.[0]?.value
    nextOptions.splice(itemIndex, 1)

    this.updateOptions(nextOptions, validValue === removingValue)
  }

  updateOptions = (nextOptions, resetValid = false) => {
    const { onUpdate } = this.props

    const data = {
      options: {
        0: nextOptions,
      },
      ...(resetValid
        ? {
            validation: {
              validResponse: {
                value: [],
              },
            },
          }
        : {}),
    }

    onUpdate(data)
  }

  handleOptionChange = (itemIndex, event) => {
    const nextOptions = this.currentOptions

    nextOptions[itemIndex] = event.target.value

    this.updateOptions(nextOptions)
  }

  handleValueChange = (value) => {
    const { score } = this.state
    this.setState({ value }, () => {
      this.updateValidation(value, score)
    })
  }

  handleScoreChange = (_score) => {
    const { value } = this.state
    // eslint-disable-next-line no-restricted-properties
    const score = window.isNaN(_score) || !_score ? 0 : _score
    this.setState({ score }, () => {
      this.updateValidation(value, score)
    })
  }

  updateValidation = (value, score) => {
    const { onUpdate } = this.props

    const data = {
      validation: {
        scoringType: EXACT_MATCH,
        validResponse: {
          value: [{ id: '0', value }],
          score,
        },
        altResponses: [],
      },
    }

    onUpdate(data)
  }

  updateQuestionWithAIData = () => {
    const { aiGeneratedQuestion, onUpdate } = this.props
    const {
      correctAnswer,
      name = '',
      options = [],
      displayAtSecond,
    } = aiGeneratedQuestion

    const questionOptions = (options || [])
      .map((option) => option?.name || '')
      .filter((option) => option?.length)

    if (options?.[correctAnswer]?.name?.length) {
      this.handleValueChange(options[correctAnswer].name)
    } else {
      this.handleValueChange('')
    }

    const updateData = {
      stimulus:
        typeof displayAtSecond === 'number'
          ? `[At ${getFormattedTimeInMinutesAndSeconds(
              displayAtSecond * 1000
            )}] ${name}`
          : name,
      options: { 0: questionOptions },
    }
    onUpdate(updateData)
  }

  render() {
    const {
      question: { validation, stimulus = '' },
      isSnapQuizVideo,
      generateViaAI,
      isGeneratingAIQuestion,
      onUpdate,
      type,
    } = this.props
    const {
      validResponse: { value, score },
    } = validation

    return (
      <ThemeProvider theme={themes.default}>
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
          <FormGroup>
            <FormLabel>Choices</FormLabel>
            <SortableList
              items={this.currentOptions}
              onSortEnd={this.handleSortEnd}
              dirty
              useDragHandle
              onRemove={this.handleRemove}
              onChange={this.handleOptionChange}
            />
            <Button onClick={this.handleAdd} data-cy="addNewChoices">
              Add choice
            </Button>
          </FormGroup>
          <FormGroup>
            <FormLabel>Correct Answer</FormLabel>
            <Select
              value={value[0] && value[0].value}
              onChange={this.handleValueChange}
              style={{ marginRight: '20px', minWidth: '200px' }}
              getPopupContainer={(trigger) => trigger.parentNode}
              data-cy="dropDownSelect"
            >
              {this.currentOptions.map((option, key) => (
                <Select.Option key={key} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
            <InputNumber
              min={0}
              value={score}
              onChange={this.handleScoreChange}
              data-cy="points"
            />
            <Points>Points</Points>
          </FormGroup>
        </QuestionFormWrapper>
      </ThemeProvider>
    )
  }
}
