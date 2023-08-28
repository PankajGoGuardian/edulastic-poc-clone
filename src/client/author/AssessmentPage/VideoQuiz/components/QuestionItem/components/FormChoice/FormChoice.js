import React from 'react'
import PropTypes from 'prop-types'
import { Radio } from 'antd'
import { isUndefined } from 'lodash'
import { helpers, Stimulus, MathFormulaDisplay } from '@edulastic/common'

import {
  QuestionOption,
  QuestionChunk,
  StyledOptionsContainer,
} from '../../../../styled-components/QuestionItem'

export default class FormChoice extends React.Component {
  static propTypes = {
    saveAnswer: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['edit', 'review', 'report']).isRequired,
    question: PropTypes.object.isRequired,
    evaluation: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
    answer: PropTypes.array,
  }

  static defaultProps = {
    evaluation: undefined,
    answer: [],
  }

  handleSelect = (nextValue) => () => {
    const {
      question: { multipleResponses },
      answer,
      saveQuestionResponse,
    } = this.props

    if (!multipleResponses) {
      this.saveValue([nextValue])
      saveQuestionResponse()
      return
    }

    const valueIndex = answer.findIndex((v) => v === nextValue)
    const toggledValue = [...answer]

    if (valueIndex > -1) {
      toggledValue.splice(valueIndex, 1)
    } else {
      toggledValue.push(nextValue)
      toggledValue.sort()
    }

    this.saveValue(toggledValue)
    saveQuestionResponse()
  }

  saveValue = (currentValue) => {
    const { saveAnswer } = this.props
    saveAnswer(currentValue)
  }

  getOptionLabel = (index) => helpers.getNumeration(index, 'uppercase')

  getCorrect = (value) => {
    const {
      question: { multipleResponses },
      evaluation,
      answer,
    } = this.props

    if (!multipleResponses) {
      return answer.includes(value) && evaluation[0]
    }

    const valueIndex = answer.findIndex((item) => item === value)

    if (valueIndex > -1) {
      return evaluation[valueIndex]
    }

    return false
  }

  renderRadioForm = (chosenValue, handleChange = () => {}) => {
    const {
      question: { options, stimulus = '' },
    } = this.props

    const radioStyle = {
      marginLeft: '2px',
      paddingLeft: '2px',
    }

    return (
      <QuestionChunk
        data-cy="truOrFalse"
        tabIndex="0"
        onMouseDown={(e) => e && e.preventDefault()}
      >
        <Stimulus
          style={{ marginBottom: 10, minHeight: 32 }}
          dangerouslySetInnerHTML={{ __html: stimulus }}
        />
        <Radio.Group onChange={handleChange} value={chosenValue[0]}>
          <Radio style={radioStyle} value={options[0].value}>
            {options[0].label}
          </Radio>
          <Radio style={radioStyle} value={options[1].value}>
            {options[1].label}
          </Radio>
        </Radio.Group>
      </QuestionChunk>
    )
  }

  renderView = () => {
    const {
      question: {
        options,
        multipleResponses,
        stimulus = '',
        validation: {
          validResponse: { value },
        },
      },
      isTrueOrFalse,
    } = this.props

    if (isTrueOrFalse) return this.renderRadioForm(value)

    return (
      <QuestionChunk>
        <Stimulus
          style={{ marginBottom: 10, minHeight: 32 }}
          dangerouslySetInnerHTML={{ __html: stimulus }}
        />
        {options.map(({ label, value: v }, key) => (
          <StyledOptionsContainer>
            <QuestionOption
              key={label + key}
              styleProps={{
                marginTop: '4px',
                minWidth: '25px',
                height: '25px',
                lineHeight: '23px',
              }}
              selected={value.includes(v)}
              multipleResponses={multipleResponses}
            >
              {this.getOptionLabel(key)}
            </QuestionOption>
            <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: label }} />
          </StyledOptionsContainer>
        ))}
      </QuestionChunk>
    )
  }

  renderForm = (mode) => {
    const {
      question: { options, multipleResponses, stimulus = '' },
      evaluation,
      view,
      answer,
      isTrueOrFalse,
    } = this.props

    const onChangeHandler = (e) => this.handleSelect(e.target.value)()

    if (isTrueOrFalse) return this.renderRadioForm(answer, onChangeHandler)

    return (
      <QuestionChunk>
        <Stimulus
          style={{ marginBottom: 10, minHeight: 32 }}
          dangerouslySetInnerHTML={{ __html: stimulus }}
        />
        {options.map(({ label, value }, key) => {
          return (
            <StyledOptionsContainer>
              <QuestionOption
                tabIndex="0"
                mode={mode}
                data-cy="choiceOption"
                key={`form-${label}-${key}`}
                selected={answer.includes(value)}
                correct={evaluation && this.getCorrect(value)}
                checked={!isUndefined(evaluation) && view !== 'clear'}
                onClick={mode === 'report' ? '' : this.handleSelect(value)}
                review
                multipleResponses={multipleResponses}
                onMouseDown={(e) => e && e.preventDefault()}
                onKeyDown={(e) => {
                  const code = e.which
                  if (code === 13 || code === 32) {
                    if (mode !== 'report') {
                      this.handleSelect(value)()
                    }
                  }
                }}
                styleProps={{
                  marginTop: '4px',
                  minWidth: '25px',
                  height: '25px',
                  lineHeight: '23px',
                }}
              >
                {this.getOptionLabel(key)}
              </QuestionOption>
              <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: label }} />
            </StyledOptionsContainer>
          )
        })}
      </QuestionChunk>
    )
  }

  render() {
    const { mode } = this.props

    switch (mode) {
      case 'edit':
        return this.renderView()
      case 'review':
      case 'report':
        return this.renderForm(mode)
      default:
        return null
    }
  }
}
