import React from 'react'
import PropTypes from 'prop-types'
import { Select, InputNumber, Button } from 'antd'
import { arrayMove } from 'react-sortable-hoc'
import { ThemeProvider } from 'styled-components'

import { themes } from '../../../../../../../theme'
import { EXACT_MATCH } from '../../../../../../../assessment/constants/constantsForQuestions'
import SortableList from '../../../../../../../assessment/components/SortableList'
import {
  QuestionFormWrapper,
  FormGroup,
  FormLabel,
  Points,
  FormInline,
} from '../../../../styled-components/QuestionForm'
import VideoQuizStimulus from '../common/VideoQuizStimulus'
import VideoQuizTimePicker from '../common/VideoQuizTimePicker'
import { SortableListContainer } from '../../../../styled-components/QuestionItem'

export default class QuestionDropdown extends React.Component {
  static propTypes = {
    question: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    videoRef: PropTypes.object.isRequired,
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
    const { question } = this.props
    const nextOptions = this.currentOptions
    const removingValue = nextOptions[itemIndex]
    const validValue = question?.validation?.validResponse?.value?.[0]?.value
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

  render() {
    const {
      question: {
        validation,
        stimulus = '',
        questionDisplayTimestamp = null,
        id,
      },
      onUpdate,
      updateAnnotationTime,
      videoRef,
    } = this.props
    const {
      validResponse: { value, score },
    } = validation

    return (
      <ThemeProvider theme={themes.default}>
        <QuestionFormWrapper>
          <FormGroup>
            <VideoQuizStimulus stimulus={stimulus} onUpdate={onUpdate} />
          </FormGroup>
          <FormGroup>
            <FormLabel>Choices</FormLabel>
            <SortableListContainer>
              <SortableList
                items={this.currentOptions}
                onSortEnd={this.handleSortEnd}
                dirty
                useDragHandle
                onRemove={this.handleRemove}
                onChange={this.handleOptionChange}
              />
            </SortableListContainer>
            <Button onClick={this.handleAdd} data-cy="addNewChoices">
              Add choice
            </Button>
          </FormGroup>
          <FormInline>
            <FormGroup width="60%">
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
            <FormGroup width="40%">
              <FormLabel>Timestamp (mm:ss)</FormLabel>
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
      </ThemeProvider>
    )
  }
}
